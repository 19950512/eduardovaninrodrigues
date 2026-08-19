export type Artigo = {
  slug: string;
  titulo: string;
  resumo: string;
  data: string; // ISO 8601 (YYYY-MM-DD)
  autor: string;
  imagem: string;
  imagemAlt: string;
  categoria: string;
  conteudo: string[]; // parágrafos
  relacionados: string[]; // slugs
};
