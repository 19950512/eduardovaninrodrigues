/**
 * Coleta de notícias das fontes configuradas.
 *
 * Fontes "html": baixa a página de listagem e extrai os links de artigo com
 * HTMLRewriter (nativo do Workers), filtrando pela regex `match` de cada fonte.
 * Fontes "rss": parsing leve de RSS 2.0 / Atom por regex (mantido para o caso
 * de alguma fonte passar a oferecer feed).
 */
import { FONTES, CONFIG, type FonteNoticia } from "./config";
import { jaVista } from "./store";
import { stripHtml } from "./util";
import type { Env, Noticia } from "./types";

const UA =
  "Mozilla/5.0 (compatible; EduardoVaninAgente/1.0; +https://eduardovrodrigues.adv.br)";

export async function coletarNoticias(env: Env): Promise<Noticia[]> {
  console.log(`[debug] iniciando coleta de ${FONTES.length} fontes.`);
  const listas = await Promise.all(
    FONTES.map((f) =>
      coletarDaFonte(f)
        .then((itens) => {
          console.log(`[debug] ${f.nome}: ${itens.length} itens brutos.`);
          return itens;
        })
        .catch((e) => {
          console.warn(`Falha ao coletar ${f.nome}:`, (e as Error).message);
          return [] as Noticia[];
        }),
    ),
  );

  const agora = Date.now();
  const janelaMs = CONFIG.janelaHoras * 3600 * 1000;

  // Achata mantendo a ordem das fontes; filtra por recência quando há data.
  const todas = listas.flat().filter((n) => {
    if (!n.data) return true;
    const t = Date.parse(n.data);
    return isNaN(t) || agora - t <= janelaMs;
  });

  // Ordena por data desc; itens sem data mantêm a ordem original (sort estável).
  todas.sort(
    (a, b) => (Date.parse(b.data ?? "") || 0) - (Date.parse(a.data ?? "") || 0),
  );

  // Dedup por URL contra o histórico (KV) e dentro da própria rodada.
  const novas: Noticia[] = [];
  const vistasNaRodada = new Set<string>();
  for (const n of todas) {
    if (novas.length >= CONFIG.maxNoticias) break;
    if (vistasNaRodada.has(n.url)) continue;
    vistasNaRodada.add(n.url);
    if (await jaVista(env, n.url)) continue;
    novas.push(n);
  }
  return novas;
}

function buscar(url: string): Promise<Response> {
  return fetch(url, {
    headers: {
      "User-Agent": UA,
      Accept:
        "text/html,application/xhtml+xml,application/rss+xml,application/atom+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "pt-BR,pt;q=0.9",
    },
    redirect: "follow",
  });
}

async function coletarDaFonte(f: FonteNoticia): Promise<Noticia[]> {
  // 1) Se há feed configurado (ou a fonte é rss), tenta o feed primeiro.
  const feedUrl = f.feed ?? (f.tipo === "rss" ? f.url : null);
  if (feedUrl) {
    try {
      const res = await buscar(feedUrl);
      if (res.ok) {
        const itens = parseFeed(await res.text(), f.nome);
        if (itens.length > 0) return itens;
        console.warn(`Feed de ${f.nome} vazio — caindo para HTML.`);
      } else {
        console.warn(`Feed de ${f.nome} HTTP ${res.status} — caindo para HTML.`);
      }
    } catch (e) {
      console.warn(`Feed de ${f.nome} falhou (${(e as Error).message}) — caindo para HTML.`);
    }
    if (f.tipo === "rss") return []; // fonte puramente RSS sem HTML de fallback
  }

  // 2) Fallback / caso HTML: raspa a página de listagem.
  const res = await buscar(f.url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const itens = await extrairLinks(res, f);
  if (itens.length === 0) {
    // 0 links casando o `match` costuma indicar bloqueio/desafio anti-bot
    // (resposta 200 mas com HTML diferente do normal) em vez de "sem notícia".
    const mitigado = res.headers.get("cf-mitigated");
    const servidor = res.headers.get("server");
    console.warn(
      `${f.nome}: 0 links casaram o \`match\` (status ${res.status}${mitigado ? `, cf-mitigated=${mitigado}` : ""}${servidor ? `, server=${servidor}` : ""}) — possível bloqueio anti-bot.`,
    );
  }
  return itens;
}

/**
 * Extrai links de artigo de uma página de listagem HTML.
 * Usa HTMLRewriter para varrer as âncoras, resolve URLs relativas contra a
 * página, aplica `match`/`excluir` e usa o texto da âncora como título.
 */
export async function extrairLinks(res: Response, f: FonteNoticia): Promise<Noticia[]> {
  const base = f.url;
  const matchRe = f.match ? new RegExp(f.match, "i") : null;
  const excluirRe = f.excluir ? new RegExp(f.excluir, "i") : null;

  type Rec = { href: string | null; text: string };
  const coletados: Rec[] = [];
  let atual: Rec | null = null;

  const rewriter = new HTMLRewriter().on("a", {
    element(el) {
      atual = { href: el.getAttribute("href"), text: "" };
      const rec = atual;
      el.onEndTag(() => {
        coletados.push(rec);
        atual = null;
      });
    },
    text(chunk) {
      if (atual) atual.text += chunk.text;
    },
  });

  await rewriter.transform(res).arrayBuffer();

  const itens: Noticia[] = [];
  const vistos = new Set<string>();
  for (const rec of coletados) {
    if (!rec.href) continue;
    let url: string;
    try {
      url = new URL(rec.href, base).toString();
    } catch {
      continue;
    }
    url = url.split("#")[0];
    if (vistos.has(url)) continue;
    if (excluirRe && excluirRe.test(url)) continue;
    if (matchRe && !matchRe.test(url)) continue;

    const titulo = stripHtml(rec.text).replace(/\s+/g, " ").trim();
    if (titulo.length < 25) continue; // descarta "leia mais", ícones, etc.

    vistos.add(url);
    itens.push({ fonte: f.nome, titulo, url });
    if (itens.length >= 20) break;
  }
  return itens;
}

/** Parser de RSS 2.0 (<item>) e Atom (<entry>). Mantido para uso futuro. */
export function parseFeed(xml: string, fonte: string): Noticia[] {
  const itens: Noticia[] = [];
  const blocos = xml.match(/<(item|entry)\b[\s\S]*?<\/\1>/gi) ?? [];
  for (const bloco of blocos) {
    const titulo = stripHtml(pegar(bloco, "title") ?? "");
    const url = pegarLink(bloco);
    if (!titulo || !url) continue;
    const resumoRaw =
      pegar(bloco, "description") ?? pegar(bloco, "summary") ?? pegar(bloco, "content") ?? "";
    const dataRaw =
      pegar(bloco, "pubDate") ?? pegar(bloco, "updated") ?? pegar(bloco, "published") ?? "";
    itens.push({
      fonte,
      titulo,
      url,
      resumo: resumoRaw ? stripHtml(resumoRaw).slice(0, 600) : undefined,
      data: dataRaw ? safeISO(dataRaw) : undefined,
    });
  }
  return itens;
}

function pegar(bloco: string, tag: string): string | null {
  const m = bloco.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? m[1].trim() : null;
}

function pegarLink(bloco: string): string | null {
  const rss = bloco.match(/<link\b[^>]*>([\s\S]*?)<\/link>/i);
  if (rss && rss[1].trim().startsWith("http")) return rss[1].trim();
  const atom = bloco.match(/<link\b[^>]*href="([^"]+)"[^>]*\/?>(?:<\/link>)?/i);
  if (atom) return atom[1].trim();
  const guid = bloco.match(/<guid\b[^>]*>([\s\S]*?)<\/guid>/i);
  if (guid && guid[1].trim().startsWith("http")) return guid[1].trim();
  return null;
}

function safeISO(s: string): string | undefined {
  const t = Date.parse(s);
  return isNaN(t) ? undefined : new Date(t).toISOString();
}
