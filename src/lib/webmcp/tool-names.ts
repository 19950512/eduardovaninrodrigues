export const WEBMCP_TOOL_NAMES = [
  "buscar_artigos",
  "listar_areas_atuacao",
  "obter_area_atuacao",
  "obter_informacoes_contato",
  "preencher_formulario_contato",
] as const;

export type WebMCPToolName = (typeof WEBMCP_TOOL_NAMES)[number];
