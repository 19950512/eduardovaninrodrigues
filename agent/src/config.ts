/**
 * Configuração do agente de conteúdo.
 *
 * O que você provavelmente vai querer ajustar aqui:
 *  - FONTES: a lista de sites de notícia (A, B, C, D...). Prefira RSS.
 *  - REPO: dono/nome/branch do repositório do site no GitHub.
 *  - CADENCIA_DIAS: de quantos em quantos dias gerar um post (default: 3).
 *
 * Segredos (tokens, chaves) NÃO ficam aqui — vão em `wrangler secret` / .dev.vars.
 * Veja README.md.
 */

export interface FonteNoticia {
  nome: string;
  /** "html" = página de listagem (extrai links de artigo); "rss" = feed RSS/Atom. */
  tipo: "html" | "rss";
  url: string;
  /**
   * (opcional) URL de feed RSS/Atom. Se presente, o agente TENTA o feed
   * primeiro e só cai para o scraping HTML de `url` se o feed falhar ou vier
   * vazio. Dá o melhor dos dois mundos: feed quando dá, HTML como rede.
   */
  feed?: string;
  /**
   * (html) Regex (source) aplicada à URL ABSOLUTA de cada link encontrado.
   * Só passam os links que casam — isola os artigos do resto da navegação.
   */
  match?: string;
  /**
   * (html) Regex (source) de exclusão aplicada à URL absoluta (redes sociais,
   * utilitários, etc.). Tem prioridade sobre `match`.
   */
  excluir?: string;
}

/**
 * Lista de sites que o agente vai ler (os "A, B, C, D"), confirmada pelo cliente.
 *
 * Nenhuma delas expõe RSS confiável, então são tratadas como páginas HTML:
 * o agente baixa a listagem, extrai os links de artigo (via HTMLRewriter) e
 * usa o padrão de URL (`match`) pra separar artigo de menu/rodapé.
 * A CriminalPlayer é agregadora (linka para outros domínios), por isso seu
 * `match` aceita links externos, excluindo redes sociais/utilitários.
 */
export const FONTES: FonteNoticia[] = [
  {
    nome: "Conjur — Criminal",
    tipo: "html",
    url: "https://www.conjur.com.br/areas-do-direito/criminal/",
    // Conjur é WordPress: a seção criminal expõe RSS em /feed/ (preferido).
    feed: "https://www.conjur.com.br/areas-do-direito/criminal/feed/",
    // fallback HTML — artigos: conjur.com.br/2026-ago-19/slug/
    match: String.raw`^https?://(www\.)?conjur\.com\.br/\d{4}-[a-zç]{3}-\d{1,2}/[^/]+/?$`,
  },
  {
    nome: "Migalhas Quentes",
    tipo: "html",
    url: "https://www.migalhas.com.br/quentes",
    // artigos: migalhas.com.br/quentes/462683/slug
    match: String.raw`^https?://(www\.)?migalhas\.com\.br/quentes/\d+/[^/]+/?$`,
  },
  {
    nome: "IBCCRIM — Contraponto Criminal",
    tipo: "html",
    url: "https://jcc.ibccrim.org.br/contraponto-criminal/",
    // artigos: jcc.ibccrim.org.br/(contraponto-criminal|artigos|noticias)/slug/
    match: String.raw`^https?://jcc\.ibccrim\.org\.br/(contraponto-criminal|artigos|noticias|colunistas)/[^/]+/?$`,
  },
  {
    nome: "Criminal Player",
    tipo: "html",
    url: "https://criminalplayer.com.br/noticias-criminais",
    // agregador: aceita links de artigo em domínios externos...
    match: String.raw`^https?://(?!(www\.)?criminalplayer\.com\.br)[^/]+/.+[^/]$`,
    // ...menos redes sociais e utilitários
    excluir: String.raw`(facebook|twitter|x\.com|instagram|linkedin|whatsapp|youtube|t\.me|telegram|mailto|/tag/|/categoria|/autor|/wp-)`,
  },
];

export const CONFIG = {
  /** Cadência mínima entre posts, em dias. */
  cadenciaDias: 3,

  /** Quantas notícias recentes (no total, entre as fontes) considerar por rodada. */
  maxNoticias: 12,

  /** Janela de "recente": ignora notícias mais antigas que isto (horas). */
  janelaHoras: 96,

  /** Repositório do site no GitHub. */
  repo: {
    owner: "19950512",
    name: "eduardovaninrodrigues",
    baseBranch: "main",
    /** Prefixo das branches criadas para cada rascunho. */
    branchPrefix: "agente/artigo-",
  },

  /**
   * Caminhos dentro do repositório (do refactor de conteúdo).
   * O agente cria um arquivo por artigo e insere 2 linhas no index.ts.
   */
  paths: {
    artigosDir: "src/content/artigos",
    indexFile: "src/content/artigos/index.ts",
  },

  /** Imagem de capa padrão usada em artigos gerados (não há foto nova). */
  imagemPadrao: "/images/artigos/default-cover.jpg",
  imagemPadraoAlt: "Direito Penal e Processo Penal — artigo do escritório",

  /** Autor exibido nos artigos. */
  autor: "Eduardo Vanin Rodrigues",

  /**
   * Modelo do Claude usado para gerar o texto. Ajuste para o id de modelo
   * atual disponível na sua conta Anthropic (ids mudam ao longo do tempo).
   * Pode ser sobrescrito pela env ANTHROPIC_MODEL.
   */
  modeloDefault: "claude-sonnet-4-5",

  /**
   * (Opcional) Template de URL de preview por PR, se o seu CI publicar
   * previews. Use {branch} ou {pr} como placeholder. Deixe vazio se não houver.
   * Ex.: "https://{branch}.eduardovaninrodrigues.pages.dev"
   */
  previewUrlTemplate: "",
} as const;
