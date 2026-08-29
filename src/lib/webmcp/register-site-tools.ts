import { artigos } from "@/content/artigos";
import { areasAtuacao } from "@/content/areas-atuacao";
import { siteConfig } from "@/lib/config";
import { pingWebMCPUsage } from "@/lib/webmcp/ping";

/**
 * Tools registered here are informational only (read-only, `openWorldHint: false`):
 * they expose content already public on the site so an on-page AI agent can
 * search/summarize it, without side effects or access to non-public data.
 */

const DIACRITICOS = /[̀-ͯ]/g;

function normalizar(valor: string) {
  return valor.normalize("NFD").replace(DIACRITICOS, "").toLowerCase();
}

function urlArtigo(slug: string) {
  return `${siteConfig.site.url}/artigos/${slug}`;
}

function urlArea(slug: string) {
  return `${siteConfig.site.url}/atuacao/${slug}`;
}

async function buscarArtigos(args: { termo?: string; categoria?: string }) {
  pingWebMCPUsage("buscar_artigos");

  const termo = args.termo ? normalizar(args.termo) : "";
  const categoria = args.categoria ? normalizar(args.categoria) : "";

  const resultados = artigos
    .filter((artigo) => {
      const combina =
        !termo ||
        normalizar(artigo.titulo).includes(termo) ||
        normalizar(artigo.resumo).includes(termo) ||
        artigo.conteudo.some((paragrafo) => normalizar(paragrafo).includes(termo));
      const combinaCategoria = !categoria || normalizar(artigo.categoria).includes(categoria);
      return combina && combinaCategoria;
    })
    .sort((a, b) => (a.data < b.data ? 1 : -1));

  if (resultados.length === 0) {
    return {
      content: [{ type: "text" as const, text: "Nenhum artigo encontrado para os critérios informados." }],
    };
  }

  const texto = resultados
    .map(
      (artigo) =>
        `- ${artigo.titulo} (${artigo.categoria}, ${artigo.data})\n  ${artigo.resumo}\n  ${urlArtigo(artigo.slug)}`,
    )
    .join("\n\n");

  return { content: [{ type: "text" as const, text: texto }] };
}

async function listarAreasAtuacao() {
  pingWebMCPUsage("listar_areas_atuacao");

  const texto = areasAtuacao
    .map((area) => `- ${area.titulo}\n  ${area.resumo}\n  ${urlArea(area.slug)}`)
    .join("\n\n");

  return { content: [{ type: "text" as const, text: texto }] };
}

async function obterAreaAtuacao(args: { slug: string }) {
  pingWebMCPUsage("obter_area_atuacao");

  const area = areasAtuacao.find((item) => item.slug === args.slug);

  if (!area) {
    const slugsDisponiveis = areasAtuacao.map((item) => item.slug).join(", ");
    return {
      isError: true,
      content: [
        {
          type: "text" as const,
          text: `Área de atuação "${args.slug}" não encontrada. Slugs disponíveis: ${slugsDisponiveis}.`,
        },
      ],
    };
  }

  const texto = [
    `${area.titulo}`,
    area.resumo,
    ...area.descricao,
    "Tópicos:",
    ...area.topicos.map((topico) => `- ${topico}`),
    urlArea(area.slug),
  ].join("\n");

  return { content: [{ type: "text" as const, text: texto }] };
}

async function obterInformacoesContato() {
  pingWebMCPUsage("obter_informacoes_contato");

  const { endereco, telefone, whatsapp, email, redesSociais, nomeExibicao, oab } = siteConfig;

  const texto = [
    `${nomeExibicao} — Advogado Criminalista (${oab.exibicao})`,
    `Telefone: ${telefone.exibicao}`,
    `WhatsApp: ${whatsapp.exibicao}`,
    `E-mail: ${email}`,
    `Endereço: ${endereco.logradouro}, ${endereco.bairro}, ${endereco.cidade} - ${endereco.uf}, ${endereco.cep}`,
    `Mapa: ${endereco.googleMapsUrl}`,
    redesSociais.instagram ? `Instagram: ${redesSociais.instagram}` : null,
    redesSociais.facebook ? `Facebook: ${redesSociais.facebook}` : null,
    `Página de contato: ${siteConfig.site.url}/contato`,
  ]
    .filter(Boolean)
    .join("\n");

  return { content: [{ type: "text" as const, text: texto }] };
}

/**
 * Registers the site's read-only WebMCP tools on `document.modelContext`.
 * Safe to call once per mount; returns a cleanup function that unregisters
 * every tool (via the shared AbortSignal) when the caller is done.
 */
export function registerSiteTools() {
  const controller = new AbortController();
  const { signal } = controller;

  void document.modelContext.registerTool(
    {
      name: "buscar_artigos",
      description:
        "Busca artigos publicados no site sobre direito criminal e Processo Penal por termo e/ou categoria. Retorna título, resumo, categoria, data e URL de cada artigo encontrado.",
      inputSchema: {
        type: "object",
        properties: {
          termo: {
            type: "string",
            description: "Termo de busca livre (opcional). Combina com título, resumo e conteúdo do artigo.",
          },
          categoria: {
            type: "string",
            description: "Filtra por categoria do artigo (opcional), ex.: \"Direito Penal\".",
          },
        },
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
      execute: buscarArtigos,
    },
    { signal },
  );

  void document.modelContext.registerTool(
    {
      name: "listar_areas_atuacao",
      description: "Lista todas as áreas de atuação do escritório, com resumo e URL de cada uma.",
      inputSchema: { type: "object", properties: {} },
      annotations: { readOnlyHint: true, openWorldHint: false },
      execute: listarAreasAtuacao,
    },
    { signal },
  );

  void document.modelContext.registerTool(
    {
      name: "obter_area_atuacao",
      description:
        "Retorna a descrição completa de uma área de atuação específica pelo slug (ver 'listar_areas_atuacao' para os slugs disponíveis).",
      inputSchema: {
        type: "object",
        properties: {
          slug: { type: "string", description: "Identificador da área de atuação, ex.: \"direito-penal\"." },
        },
        required: ["slug"],
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
      execute: obterAreaAtuacao,
    },
    { signal },
  );

  void document.modelContext.registerTool(
    {
      name: "obter_informacoes_contato",
      description:
        "Retorna as informações públicas de contato do escritório: telefone, WhatsApp, e-mail, endereço e redes sociais.",
      inputSchema: { type: "object", properties: {} },
      annotations: { readOnlyHint: true, openWorldHint: false },
      execute: obterInformacoesContato,
    },
    { signal },
  );

  return () => controller.abort();
}
