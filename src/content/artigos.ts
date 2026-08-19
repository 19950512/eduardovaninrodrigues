/**
 * API pública de artigos.
 *
 * O conteúdo foi separado em 1 arquivo por post dentro de `./artigos/`.
 * Este módulo apenas re-exporta a lista agregada e os helpers, mantendo
 * o import `@/content/artigos` estável para todo o resto do site (páginas,
 * sitemap, WebMCP, dados estruturados). Não coloque conteúdo de artigo aqui.
 */
import { artigos } from "./artigos/index";

export type { Artigo } from "./artigos/types";
export { artigos };

export function getArtigoBySlug(slug: string) {
  return artigos.find((artigo) => artigo.slug === slug);
}

export function getArtigosRelacionados(slugs: string[]) {
  return artigos.filter((artigo) => slugs.includes(artigo.slug));
}
