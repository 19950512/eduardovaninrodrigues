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
    "Bacharel em Direito",
    "Pós-graduado em Direito Penal e Processo Penal",
    "Pós-graduado em Direito Penal e Criminologia",
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
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3508.0727611896345!2d-52.1995160767212!3d-28.447222935427362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94e29d114908cf5f%3A0x9ad800a9929bcb5e!2sEduardo%20Vanin%20Rodrigues%20-%20Advogado%20Criminalista!5e0!3m2!1spt-PT!2sbr!4v1787963891179!5m2!1spt-PT!2sbr",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Ed.+Gaia,+Av.+Julio+Borella,+630,+Centro,+Marau+-+RS,+99150-000",
  },

  redesSociais: {
    instagram: "https://www.instagram.com/eduardovanin.criminalista",
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
