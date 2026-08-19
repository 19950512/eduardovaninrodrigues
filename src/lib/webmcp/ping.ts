import type { WebMCPToolName } from "@/lib/webmcp/tool-names";

/**
 * Notifica o backend (que repassa ao Discord) que uma ferramenta WebMCP foi
 * de fato chamada por um agente no navegador do usuário — sinal de que a
 * integração está em uso real, não só registrada. Fire-and-forget: nunca
 * deve atrasar ou quebrar a resposta da ferramenta para o agente.
 */
export function pingWebMCPUsage(tool: WebMCPToolName) {
  if (typeof window === "undefined") return;

  void fetch("/api/webmcp-ping", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tool, pagina: window.location.pathname }),
    keepalive: true,
  }).catch(() => {});
}
