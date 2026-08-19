/**
 * Renderização do rascunho para os arquivos-fonte do site:
 *  - o arquivo do artigo: src/content/artigos/<slug>.ts
 *  - a edição do barrel:  src/content/artigos/index.ts (2 linhas, nas âncoras)
 */
import type { ArtigoDraft } from "./types";

const ANCORA_IMPORTS = "// AGENT-IMPORTS:INICIO";
const ANCORA_REGISTRO = "// AGENT-REGISTRO:INICIO";

/** Converte o slug em um identificador JS camelCase válido. */
export function slugParaIdent(slug: string): string {
  const camel = slug
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join("");
  return /^[a-zA-Z_$]/.test(camel) ? camel : "a" + camel;
}

/** Conteúdo do arquivo TS do artigo, no mesmo estilo dos arquivos existentes. */
export function renderArtigoFile(d: ArtigoDraft): string {
  const arr = (xs: string[]) =>
    xs.length === 0
      ? "[]"
      : "[\n" + xs.map((x) => `    ${JSON.stringify(x)},`).join("\n") + "\n  ]";

  return `import type { Artigo } from "./types";

export const artigo: Artigo = {
  slug: ${JSON.stringify(d.slug)},
  titulo: ${JSON.stringify(d.titulo)},
  resumo: ${JSON.stringify(d.resumo)},
  data: ${JSON.stringify(d.data)},
  autor: ${JSON.stringify(d.autor)},
  imagem: ${JSON.stringify(d.imagem)},
  imagemAlt: ${JSON.stringify(d.imagemAlt)},
  categoria: ${JSON.stringify(d.categoria)},
  conteudo: ${arr(d.conteudo)},
  relacionados: ${arr(d.relacionados)},
};
`;
}

/** Insere as 2 linhas do artigo novo no conteúdo atual do index.ts. */
export function inserirNoIndex(indexAtual: string, d: ArtigoDraft): string {
  if (indexAtual.includes(`from "./${d.slug}"`)) {
    throw new Error(`Artigo "${d.slug}" já está registrado no index.ts.`);
  }
  const ident = slugParaIdent(d.slug);

  const importLine = `import { artigo as ${ident} } from "./${d.slug}";`;
  const registroLine = `  ${ident},`;

  if (!indexAtual.includes(ANCORA_IMPORTS) || !indexAtual.includes(ANCORA_REGISTRO)) {
    throw new Error("Âncoras AGENT-IMPORTS/AGENT-REGISTRO não encontradas no index.ts.");
  }

  let out = indexAtual.replace(ANCORA_IMPORTS, `${ANCORA_IMPORTS}\n${importLine}`);
  out = out.replace(ANCORA_REGISTRO, `${ANCORA_REGISTRO}\n${registroLine}`);
  return out;
}
