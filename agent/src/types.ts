/** Ambiente (bindings) do Worker. Veja wrangler.toml e os secrets no README. */
export interface Env {
  // --- KV (estado do agente) ---
  AGENTE_KV: KVNamespace;

  // --- Segredos (wrangler secret put ...) ---
  /** Chave da API Anthropic (Claude). */
  ANTHROPIC_API_KEY: string;
  /** (Opcional) Sobrescreve CONFIG.modeloDefault. */
  ANTHROPIC_MODEL?: string;

  /** Token GitHub (fine-grained) com permissão de Contents+Pull requests: RW no repo. */
  GITHUB_TOKEN: string;

  /** WhatsApp Cloud API: token permanente do app / system user. */
  WHATSAPP_TOKEN: string;
  /** ID do número de telefone (Phone Number ID) no WhatsApp Cloud API. */
  WHATSAPP_PHONE_ID: string;
  /** Número do advogado que recebe/aprova, em E.164 só dígitos (ex.: 5554997007379). */
  WHATSAPP_DESTINO: string;
  /** Nome do template aprovado usado para notificar (ex.: "novo_artigo"). */
  WHATSAPP_TEMPLATE?: string;
  /** Código de idioma do template (ex.: "pt_BR"). */
  WHATSAPP_TEMPLATE_LANG?: string;

  /** Token de verificação do webhook do WhatsApp (você escolhe; usado no setup). */
  WHATSAPP_VERIFY_TOKEN: string;
  /** App Secret do app Meta, para validar a assinatura X-Hub-Signature-256. */
  META_APP_SECRET: string;

  /** Segredo próprio para assinar os links/tokens de aprovação (gere um aleatório). */
  APPROVAL_SECRET: string;
}

/** Rascunho de artigo gerado pelo Claude (mesma forma do tipo Artigo do site). */
export interface ArtigoDraft {
  slug: string;
  titulo: string;
  resumo: string;
  data: string; // YYYY-MM-DD
  autor: string;
  imagem: string;
  imagemAlt: string;
  categoria: string;
  conteudo: string[];
  relacionados: string[];
}

/** Item de notícia coletado das fontes. */
export interface Noticia {
  fonte: string;
  titulo: string;
  url: string;
  resumo?: string;
  data?: string; // ISO
}

/** Rascunho pendente de aprovação, guardado no KV. */
export interface Pendente {
  token: string;
  draft: ArtigoDraft;
  prNumber: number;
  prUrl: string;
  branch: string;
  criadoEm: string; // ISO
  fontes: { titulo: string; url: string }[];
}
