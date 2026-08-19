/**
 * DADOS GLOBAIS DO ESCRITÓRIO
 * ---------------------------------------------------------------------------
 * Fonte única de verdade, reutilizada no Header, Footer, página de Contato,
 * metadata de SEO e nos dados estruturados (Schema.org / JSON-LD).
 *
 * IMPORTANTE — CAMPOS PENDENTES DE CONFIRMAÇÃO:
 * Os campos marcados com "[PENDENTE]" são placeholders e NÃO devem ir para
 * produção sem revisão do cliente. Nome completo, título profissional, OAB,
 * formação, endereço, telefone, e-mail, domínio, Instagram e Facebook foram
 * confirmados pelo cliente. Falta apenas o LinkedIn (se houver).
 */

export const siteConfig = {
  nome: "Eduardo Vanin Rodrigues",
  nomeExibicao: "Dr. Eduardo Vanin Rodrigues",
  titulo: "Advogado Criminalista",
  oab: {
    numero: "133.074",
    uf: "RS",
    exibicao: "OAB/RS 133.074",
  },
  formacao: [
    "Bacharel em Direito pela FABE",
    "Pós-graduando em Direito Penal e Processo Penal",
    "Pós-graduando em Direito Penal e Criminologia pela UNINTER",
  ],

  telefone: {
    exibicao: "(54) 99700-7379",
    e164: "+5554997007379",
  },
  whatsapp: {
    exibicao: "(54) 99700-7379",
    numeroE164: "5554997007379", // apenas dígitos, com código do país
    mensagemPadrao:
      "Olá, Dr. Eduardo. Encontrei seu site e gostaria de mais informações sobre atendimento.",
  },
  email: "eduardovrodrigues.adv@gmail.com",

  endereco: {
    logradouro: "Ed. Gaia, Av. Julio Borella, 630 — Sala 203",
    bairro: "Centro",
    cidade: "Marau",
    estado: "RS",
    uf: "RS",
    cep: "99150-000",
    pais: "BR",
    googleMapsEmbedUrl:
      "https://www.google.com/maps?q=Ed.+Gaia,+Av.+Julio+Borella,+630,+Centro,+Marau+-+RS,+99150-000&output=embed",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Ed.+Gaia,+Av.+Julio+Borella,+630,+Centro,+Marau+-+RS,+99150-000",
  },

  redesSociais: {
    instagram: "https://www.instagram.com/evrodrigues.adv/",
    linkedin: "", // [PENDENTE]
    facebook: "https://www.facebook.com/profile.php?id=61550965868564",
  },

  site: {
    url: "https://www.eduardovrodrigues.adv.br",
    nomeCurto: "Eduardo Vanin Rodrigues Advocacia",
  },

  analytics: {
    googleAnalyticsId: "G-DQ3CV53X8L",
  },

  frasesInstitucionais: {
    principal:
      "Defesa técnica, estratégica e discreta em cada etapa do processo penal.",
  },
} as const;

export const navegacao = [
  { label: "Início", href: "/" },
  { label: "O Advogado", href: "/sobre" },
  { label: "Atuação", href: "/atuacao" },
  { label: "Artigos", href: "/artigos" },
  { label: "Galeria", href: "/galeria" },
  { label: "Contato", href: "/contato" },
] as const;

export const footerLegal = [
  { label: "Política de Privacidade", href: "/politica-de-privacidade" },
] as const;
