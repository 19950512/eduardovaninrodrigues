/**
 * WhatsApp Cloud API (oficial, Meta).
 *
 * Fluxo:
 *  - enviarNotificacao(): dispara um TEMPLATE aprovado com 2 botões de resposta
 *    rápida ("Aprovar" / "Recusar"), cujo payload carrega o token do rascunho.
 *  - GET  /webhook: verificação (hub.challenge) na configuração do webhook.
 *  - POST /webhook: recebe o toque no botão -> parseWebhook() extrai ação+token.
 *  - Após o toque, abre-se a janela de 24h, então respondemos com texto simples.
 *
 * O template precisa ser criado e APROVADO no WhatsApp Manager antes de usar.
 * Veja README.md (seção "Template do WhatsApp").
 */
import type { Env } from "./types";

const GRAPH = "https://graph.facebook.com/v21.0";

export interface AcaoWebhook {
  acao: "APROVAR" | "RECUSAR";
  token: string;
  /** Número que respondeu (para eco de confirmação). */
  de?: string;
}

/** Envia o template de aprovação com os dois botões. */
export async function enviarNotificacao(
  env: Env,
  args: { titulo: string; resumo: string; prUrl: string; token: string },
): Promise<void> {
  const template = env.WHATSAPP_TEMPLATE || "novo_artigo";
  const lang = env.WHATSAPP_TEMPLATE_LANG || "pt_BR";

  const body = {
    messaging_product: "whatsapp",
    to: env.WHATSAPP_DESTINO,
    type: "template",
    template: {
      name: template,
      language: { code: lang },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: recorte(args.titulo, 120) },
            { type: "text", text: recorte(args.resumo, 300) },
            { type: "text", text: args.prUrl },
          ],
        },
        {
          type: "button",
          sub_type: "quick_reply",
          index: "0",
          parameters: [{ type: "payload", payload: `APROVAR:${args.token}` }],
        },
        {
          type: "button",
          sub_type: "quick_reply",
          index: "1",
          parameters: [{ type: "payload", payload: `RECUSAR:${args.token}` }],
        },
      ],
    },
  };

  await enviar(env, body);
}

/** Envia uma mensagem de texto simples (dentro da janela de 24h). */
export async function enviarTexto(env: Env, to: string, texto: string): Promise<void> {
  await enviar(env, {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: recorte(texto, 1000), preview_url: true },
  });
}

async function enviar(env: Env, body: unknown): Promise<void> {
  const res = await fetch(`${GRAPH}/${env.WHATSAPP_PHONE_ID}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`WhatsApp send ${res.status}: ${await res.text()}`);
  }
}

/**
 * Verifica a assinatura X-Hub-Signature-256 do webhook (HMAC-SHA256 do corpo
 * cru com o App Secret do Meta).
 */
export async function verificarAssinatura(
  env: Env,
  corpoCru: string,
  header: string | null,
): Promise<boolean> {
  if (!header) return false;
  const esperado = header.replace(/^sha256=/, "");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(env.META_APP_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(corpoCru));
  const hex = [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
  if (hex.length !== esperado.length) return false;
  let diff = 0;
  for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ esperado.charCodeAt(i);
  return diff === 0;
}

/** Extrai ação (APROVAR/RECUSAR) e token do payload do webhook. */
export function parseWebhook(payload: unknown): AcaoWebhook | null {
  try {
    const entry = (payload as any)?.entry?.[0];
    const msg = entry?.changes?.[0]?.value?.messages?.[0];
    if (!msg) return null;
    const de: string | undefined = msg.from;

    // Botão de template (quick reply) -> type "button", campo button.payload
    let raw: string | undefined = msg.button?.payload;
    // Botão interativo -> interactive.button_reply.id
    if (!raw && msg.interactive?.type === "button_reply") raw = msg.interactive.button_reply.id;
    if (!raw) return null;

    const [acao, token] = raw.split(":");
    if ((acao === "APROVAR" || acao === "RECUSAR") && token) {
      return { acao, token, de };
    }
    return null;
  } catch {
    return null;
  }
}

function recorte(s: string, max: number): string {
  const limpo = s.replace(/\s+/g, " ").trim();
  return limpo.length <= max ? limpo : limpo.slice(0, max - 1) + "…";
}
