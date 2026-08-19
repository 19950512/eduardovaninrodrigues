/** Geração do artigo via API da Anthropic (Claude). */
import { CONFIG } from "./config";
import { SYSTEM_PROMPT, montarUserPrompt } from "./oab";
import { slugify, hojeISO } from "./util";
import type { Env, Noticia, ArtigoDraft } from "./types";

interface RespostaModelo {
  titulo?: string;
  resumo?: string;
  categoria?: string;
  conteudo?: string[];
  temaBaseadoEm?: string;
  pular?: boolean;
  motivo?: string;
}

export interface ResultadoGeracao {
  draft?: ArtigoDraft;
  pulado?: boolean;
  motivo?: string;
}

export async function gerarArtigo(
  env: Env,
  noticias: Noticia[],
  relacionados: string[],
): Promise<ResultadoGeracao> {
  const modelo = env.ANTHROPIC_MODEL || CONFIG.modeloDefault;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: modelo,
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: montarUserPrompt(noticias) }],
    }),
  });

  if (!res.ok) {
    throw new Error(`Anthropic HTTP ${res.status}: ${await res.text()}`);
  }

  const data = (await res.json()) as {
    content?: { type: string; text?: string }[];
  };
  const texto =
    data.content?.filter((b) => b.type === "text").map((b) => b.text).join("") ?? "";

  const parsed = extrairJson(texto);
  if (!parsed) throw new Error(`Resposta do modelo não é JSON válido:\n${texto.slice(0, 500)}`);

  if (parsed.pular) return { pulado: true, motivo: parsed.motivo ?? "sem tema adequado" };

  const draft = validar(parsed, relacionados);
  return { draft };
}

function validar(p: RespostaModelo, relacionados: string[]): ArtigoDraft {
  if (!p.titulo || !p.resumo || !p.categoria || !Array.isArray(p.conteudo) || p.conteudo.length < 2) {
    throw new Error("Rascunho incompleto retornado pelo modelo.");
  }

  const RODAPE =
    "Este texto tem caráter informativo geral e não substitui a orientação de um advogado sobre um caso concreto.";
  const conteudo = p.conteudo.map((s) => s.trim()).filter(Boolean);
  if (conteudo[conteudo.length - 1] !== RODAPE) conteudo.push(RODAPE);

  return {
    slug: slugify(p.titulo),
    titulo: p.titulo.trim(),
    resumo: p.resumo.trim(),
    data: hojeISO(),
    autor: CONFIG.autor,
    imagem: CONFIG.imagemPadrao,
    imagemAlt: CONFIG.imagemPadraoAlt,
    categoria: p.categoria.trim(),
    conteudo,
    // relaciona com os 2 últimos artigos publicados pelo agente (se houver)
    relacionados: relacionados.slice(0, 2),
  };
}

/** Extrai o primeiro objeto JSON do texto (tolerante a fences ```json). */
function extrairJson(texto: string): RespostaModelo | null {
  const limpo = texto.replace(/```json\s*|\s*```/g, "").trim();
  try {
    return JSON.parse(limpo) as RespostaModelo;
  } catch {
    // fallback: pega do primeiro { até o último }
    const i = limpo.indexOf("{");
    const j = limpo.lastIndexOf("}");
    if (i >= 0 && j > i) {
      try {
        return JSON.parse(limpo.slice(i, j + 1)) as RespostaModelo;
      } catch {
        return null;
      }
    }
    return null;
  }
}
