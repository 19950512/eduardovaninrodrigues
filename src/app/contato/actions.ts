"use server";

import { headers } from "next/headers";
import { z } from "zod";

/**
 * Validação e processamento do formulário de contato.
 *
 * Segurança implementada aqui:
 * - Validação estrita de schema (zod) — trata todo input como não confiável.
 * - Sanitização básica (trim + remoção de caracteres de controle) antes de
 *   qualquer uso do conteúdo.
 * - Campo honeypot ("empresa") invisível ao usuário real, para descartar
 *   submissões automatizadas de bots sem exigir CAPTCHA.
 * - Time-trap ("iniciadoEm"): o formulário registra no navegador o instante
 *   em que foi renderizado; envios concluídos rápido demais depois disso
 *   (abaixo de TEMPO_MINIMO_PREENCHIMENTO_MS) são tratados como automação.
 * - Heurística simples anti-spam: rejeita links em nome/assunto (não fazem
 *   sentido nesses campos) e mensagens com excesso de links.
 * - Rate limiting simples em memória por processo (por e-mail e por IP),
 *   como camada adicional. Em produção com múltiplas instâncias (ex.:
 *   Vercel serverless), este limite não é compartilhado entre instâncias —
 *   para um rate limit robusto, usar um serviço externo (ex.: Upstash
 *   Ratelimit) ou proteção na borda (ex.: Vercel Firewall / Cloudflare).
 *
 * Envios bloqueados por honeypot, time-trap ou heurística de spam retornam
 * "sucesso" ao remetente sem revelar que a submissão foi descartada — isso
 * evita que bots ajustem o comportamento para contornar os filtros.
 */

const TEMPO_MINIMO_PREENCHIMENTO_MS = 2_500;
const PADRAO_LINK = /https?:\/\/|www\./i;

const contatoSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome completo.").max(120),
  email: z.string().trim().email("Informe um e-mail válido.").max(160),
  telefone: z
    .string()
    .trim()
    .regex(/^[0-9()+\-.\s]*$/, "Informe um telefone válido.")
    .min(8, "Informe um telefone válido.")
    .max(20)
    .optional()
    .or(z.literal("")),
  assunto: z.string().trim().min(2, "Informe o assunto.").max(160),
  mensagem: z
    .string()
    .trim()
    .min(10, "A mensagem deve ter pelo menos 10 caracteres.")
    .max(2000, "A mensagem deve ter no máximo 2000 caracteres."),
  empresa: z.string().max(0).optional().or(z.literal("")), // honeypot
  iniciadoEm: z.coerce.number().int().positive(),
});

export type ContatoFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<keyof z.infer<typeof contatoSchema>, string>>;
};

const janelaRateLimitMs = 60_000;
const maxEnviosPorJanela = 3;
const historico = new Map<string, number[]>();

function sanitizar(valor: string) {
  // Remove caracteres de controle (codigo < 32, exceto tab/LF/CR, e o
  // caractere DEL) sem embutir bytes de controle literais no codigo-fonte.
  const semControle = Array.from(valor)
    .filter((char) => {
      const codigo = char.codePointAt(0) ?? 0;
      if (codigo === 9 || codigo === 10 || codigo === 13) return true;
      if (codigo < 32) return false;
      if (codigo === 127) return false;
      return true;
    })
    .join("");
  return semControle.trim();
}

function excedeuLimite(chave: string) {
  const agora = Date.now();
  const envios = (historico.get(chave) ?? []).filter(
    (timestamp) => agora - timestamp < janelaRateLimitMs,
  );
  envios.push(agora);
  historico.set(chave, envios);
  return envios.length > maxEnviosPorJanela;
}

function pareceSpam(dados: {
  nome: string;
  assunto: string;
  mensagem: string;
}) {
  if (PADRAO_LINK.test(dados.nome) || PADRAO_LINK.test(dados.assunto)) {
    return true;
  }
  const linksNaMensagem = dados.mensagem.match(/https?:\/\/|www\./gi) ?? [];
  return linksNaMensagem.length >= 3;
}

async function obterIp() {
  const cabecalhos = await headers();
  const encaminhadoPor = cabecalhos.get("x-forwarded-for");
  if (encaminhadoPor) return encaminhadoPor.split(",")[0]!.trim();
  return cabecalhos.get("x-real-ip") ?? "desconhecido";
}

async function enviarParaDiscord(dados: {
  nome: string;
  email: string;
  telefone: string;
  assunto: string;
  mensagem: string;
}) {
  const webhookUrl = process.env.DISCORD_CONTATO_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn(
      "[contato] DISCORD_CONTATO_WEBHOOK_URL não configurada — mensagem não enviada ao Discord.",
    );
    return false;
  }

  try {
    const resposta = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title: "Novo contato pelo site",
            color: 0x7a1128,
            fields: [
              { name: "Nome", value: dados.nome, inline: true },
              { name: "E-mail", value: dados.email, inline: true },
              {
                name: "Telefone",
                value: dados.telefone || "Não informado",
                inline: true,
              },
              { name: "Assunto", value: dados.assunto },
              { name: "Mensagem", value: dados.mensagem.slice(0, 1024) },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });
    return resposta.ok;
  } catch (erro) {
    console.error("[contato] Falha ao enviar mensagem ao Discord", erro);
    return false;
  }
}

export async function enviarContato(
  _prevState: ContatoFormState,
  formData: FormData,
): Promise<ContatoFormState> {
  const dados = {
    nome: sanitizar(String(formData.get("nome") ?? "")),
    email: sanitizar(String(formData.get("email") ?? "")),
    telefone: sanitizar(String(formData.get("telefone") ?? "")),
    assunto: sanitizar(String(formData.get("assunto") ?? "")),
    mensagem: sanitizar(String(formData.get("mensagem") ?? "")),
    empresa: String(formData.get("empresa") ?? ""),
    iniciadoEm: String(formData.get("iniciadoEm") ?? ""),
  };

  const resultado = contatoSchema.safeParse(dados);

  if (!resultado.success) {
    const errors: ContatoFormState["errors"] = {};
    for (const issue of resultado.error.issues) {
      const campo = issue.path[0] as keyof typeof dados;
      errors[campo] = issue.message;
    }
    return {
      status: "error",
      message: "Verifique os campos destacados e tente novamente.",
      errors,
    };
  }

  const respostaSilenciosa: ContatoFormState = {
    status: "success",
    message: "Mensagem enviada com sucesso. Retornaremos em breve.",
  };

  // Honeypot preenchido ou envio rápido demais após a renderização do
  // formulário: descarta silenciosamente, sem revelar ao remetente
  // automatizado que a submissão foi identificada.
  if (resultado.data.empresa) return respostaSilenciosa;
  if (Date.now() - resultado.data.iniciadoEm < TEMPO_MINIMO_PREENCHIMENTO_MS) {
    return respostaSilenciosa;
  }
  if (pareceSpam(resultado.data)) return respostaSilenciosa;

  const ip = await obterIp();
  if (excedeuLimite(resultado.data.email) || excedeuLimite(ip)) {
    return {
      status: "error",
      message:
        "Muitas tentativas em pouco tempo. Aguarde um momento e tente novamente.",
    };
  }

  const enviado = await enviarParaDiscord({
    ...resultado.data,
    telefone: resultado.data.telefone ?? "",
  });
  if (!enviado) {
    return {
      status: "error",
      message:
        "Não foi possível enviar sua mensagem agora. Tente novamente em instantes ou fale conosco pelo WhatsApp.",
    };
  }

  return {
    status: "success",
    message:
      "Mensagem enviada com sucesso. Retornaremos o contato o mais breve possível.",
  };
}
