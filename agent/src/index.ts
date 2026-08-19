/**
 * Agente de conteúdo — Cloudflare Worker.
 *
 *  scheduled(): a cada rodada (diária), respeitando a cadência de N dias,
 *    coleta notícias -> gera artigo (Claude, com travas OAB) -> abre PR no
 *    GitHub -> notifica o advogado no WhatsApp com botões Aprovar/Recusar.
 *
 *  fetch():
 *    GET  /            -> health check
 *    GET  /webhook     -> verificação do webhook do WhatsApp (hub.challenge)
 *    POST /webhook     -> toque no botão -> merge (aprovar) / fecha (recusar) PR
 *    GET  /aprovar     -> link assinado de fallback (?token=&sig=)
 *    GET  /recusar     -> link assinado de fallback (?token=&sig=)
 */
import { CONFIG } from "./config";
import { coletarNoticias } from "./news";
import { gerarArtigo } from "./generate";
import { criarRascunhoPR, aprovarPR, recusarPR } from "./github";
import { enviarNotificacao, enviarTexto, verificarAssinatura, parseWebhook } from "./whatsapp";
import {
  getLastRun,
  setLastRun,
  salvarPendente,
  lerPendente,
  removerPendente,
  getLastSlugs,
  pushLastSlug,
} from "./store";
import { randomToken, hmacHex, timingSafeEqual } from "./util";
import type { Env, Pendente } from "./types";

export default {
  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(rodada(env));
  },

  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return new Response("Agente de conteúdo — OK", { status: 200 });
    }

    // Verificação do webhook (Meta faz um GET com hub.*).
    if (request.method === "GET" && url.pathname === "/webhook") {
      const mode = url.searchParams.get("hub.mode");
      const token = url.searchParams.get("hub.verify_token");
      const challenge = url.searchParams.get("hub.challenge");
      if (mode === "subscribe" && token === env.WHATSAPP_VERIFY_TOKEN && challenge) {
        return new Response(challenge, { status: 200 });
      }
      return new Response("forbidden", { status: 403 });
    }

    // Toque no botão (Aprovar/Recusar).
    if (request.method === "POST" && url.pathname === "/webhook") {
      const corpoCru = await request.text();
      const assinaturaOk = await verificarAssinatura(
        env,
        corpoCru,
        request.headers.get("x-hub-signature-256"),
      );
      if (!assinaturaOk) return new Response("bad signature", { status: 401 });

      let payload: unknown;
      try {
        payload = JSON.parse(corpoCru);
      } catch {
        return new Response("bad json", { status: 400 });
      }

      const acao = parseWebhook(payload);
      if (acao) {
        // Processa em background e responde 200 imediatamente (exigência do WhatsApp).
        ctx.waitUntil(processarDecisao(env, acao.acao, acao.token, acao.de));
      }
      return new Response("EVENT_RECEIVED", { status: 200 });
    }

    // Links assinados de fallback (caso os botões falhem).
    if (request.method === "GET" && (url.pathname === "/aprovar" || url.pathname === "/recusar")) {
      const token = url.searchParams.get("token") ?? "";
      const sig = url.searchParams.get("sig") ?? "";
      const acao = url.pathname === "/aprovar" ? "APROVAR" : "RECUSAR";
      const esperado = await hmacHex(env.APPROVAL_SECRET, `${acao}:${token}`);
      if (!token || !timingSafeEqual(sig, esperado)) {
        return new Response("link inválido", { status: 403 });
      }
      const msg = await processarDecisao(env, acao, token);
      return new Response(msg, { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }

    return new Response("not found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;

/** Uma rodada de geração + notificação. */
async function rodada(env: Env): Promise<void> {
  try {
    // Cadência: só propõe se já passou o intervalo desde a última proposta.
    const last = await getLastRun(env);
    if (last) {
      const diasDesde = (Date.now() - last.getTime()) / (24 * 3600 * 1000);
      if (diasDesde < CONFIG.cadenciaDias) {
        console.log(`Cadência: ${diasDesde.toFixed(1)}d < ${CONFIG.cadenciaDias}d — pulando.`);
        return;
      }
    }

    const noticias = await coletarNoticias(env);
    console.log(`Coletadas ${noticias.length} notícias novas.`);
    if (noticias.length === 0) {
      console.log("Sem notícias novas — tentará na próxima rodada.");
      return;
    }

    const relacionados = await getLastSlugs(env);
    const resultado = await gerarArtigo(env, noticias, relacionados);
    if (resultado.pulado || !resultado.draft) {
      console.log(`Modelo pulou a geração: ${resultado.motivo ?? "sem motivo"}.`);
      return;
    }
    const draft = resultado.draft;

    const pr = await criarRascunhoPR(env, draft);
    const token = randomToken(16);
    const pendente: Pendente = {
      token,
      draft,
      prNumber: pr.prNumber,
      prUrl: pr.prUrl,
      branch: pr.branch,
      criadoEm: new Date().toISOString(),
      fontes: noticias.slice(0, 5).map((n) => ({ titulo: n.titulo, url: n.url })),
    };
    await salvarPendente(env, pendente);

    await enviarNotificacao(env, {
      titulo: draft.titulo,
      resumo: draft.resumo,
      prUrl: pr.prUrl,
      token,
    });

    await setLastRun(env, new Date());
    console.log(`Rascunho proposto: PR #${pr.prNumber} (${draft.slug}).`);
  } catch (e) {
    console.error("Falha na rodada:", (e as Error).message);
    // Não seta lastRun -> tenta de novo na próxima rodada.
  }
}

/** Aplica a decisão do advogado. Idempotente. Retorna mensagem legível. */
async function processarDecisao(
  env: Env,
  acao: "APROVAR" | "RECUSAR",
  token: string,
  de?: string,
): Promise<string> {
  const pendente = await lerPendente(env, token);
  if (!pendente) {
    const msg = "Este rascunho já foi processado ou expirou.";
    if (de) await enviarTexto(env, de, msg).catch(() => {});
    return msg;
  }

  try {
    if (acao === "APROVAR") {
      await aprovarPR(env, pendente.prNumber, pendente.branch);
      await pushLastSlug(env, pendente.draft.slug);
      await removerPendente(env, token);
      const msg = `✅ Publicado! "${pendente.draft.titulo}" foi para o site (PR #${pendente.prNumber} aprovado). O deploy leva alguns minutos.`;
      if (de) await enviarTexto(env, de, msg).catch(() => {});
      return msg;
    } else {
      await recusarPR(env, pendente.prNumber, pendente.branch);
      await removerPendente(env, token);
      const msg = `🗑️ Descartado. "${pendente.draft.titulo}" não será publicado (PR #${pendente.prNumber} fechado).`;
      if (de) await enviarTexto(env, de, msg).catch(() => {});
      return msg;
    }
  } catch (e) {
    const msg = `Erro ao processar a decisão: ${(e as Error).message}`;
    console.error(msg);
    if (de) await enviarTexto(env, de, "Ocorreu um erro ao processar sua decisão. Tente novamente ou avise o suporte.").catch(() => {});
    return msg;
  }
}
