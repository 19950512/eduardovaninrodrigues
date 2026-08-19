import { headers } from "next/headers";
import { z } from "zod";
import { WEBMCP_TOOL_NAMES } from "@/lib/webmcp/tool-names";

/**
 * Recebe a confirmação de que uma ferramenta WebMCP foi chamada por um
 * agente no navegador de um visitante e repassa um aviso ao Discord —
 * mesmo webhook de destino conceitual do formulário de contato, mas uma
 * URL própria (DISCORD_WEBMCP_WEBHOOK_URL), para não misturar leads reais
 * com telemetria de uso do WebMCP.
 */

const corpoSchema = z.object({
  tool: z.enum(WEBMCP_TOOL_NAMES),
  pagina: z.string().trim().max(200).optional(),
});

const janelaRateLimitMs = 60_000;
const maxEnviosPorJanela = 20;
const historico = new Map<string, number[]>();

function excedeuLimite(chave: string) {
  const agora = Date.now();
  const envios = (historico.get(chave) ?? []).filter(
    (timestamp) => agora - timestamp < janelaRateLimitMs,
  );
  envios.push(agora);
  historico.set(chave, envios);
  return envios.length > maxEnviosPorJanela;
}

async function obterIp() {
  const cabecalhos = await headers();
  const encaminhadoPor = cabecalhos.get("x-forwarded-for");
  if (encaminhadoPor) return encaminhadoPor.split(",")[0]!.trim();
  return cabecalhos.get("x-real-ip") ?? "desconhecido";
}

export async function POST(request: Request) {
  const ip = await obterIp();
  if (excedeuLimite(ip)) {
    return Response.json({ ok: false }, { status: 429 });
  }

  const corpoBruto = await request.json().catch(() => null);
  const resultado = corpoSchema.safeParse(corpoBruto);
  if (!resultado.success) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const webhookUrl = process.env.DISCORD_WEBMCP_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn(
      "[webmcp-ping] DISCORD_WEBMCP_WEBHOOK_URL não configurada — aviso não enviado ao Discord.",
    );
    return Response.json({ ok: false }, { status: 200 });
  }

  try {
    const resposta = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title: "🔧 Ferramenta WebMCP usada no site",
            color: 0x7a1128,
            fields: [
              { name: "Ferramenta", value: resultado.data.tool, inline: true },
              { name: "Página", value: resultado.data.pagina || "desconhecida", inline: true },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });
    return Response.json({ ok: resposta.ok }, { status: 200 });
  } catch (erro) {
    console.error("[webmcp-ping] Falha ao enviar aviso ao Discord", erro);
    return Response.json({ ok: false }, { status: 200 });
  }
}
