export type AreaAtuacao = {
  slug: string;
  titulo: string;
  resumo: string;
  descricao: string[];
  topicos: string[];
};

/**
 * Áreas de atuação reais do escritório. Conteúdo redigido em tom técnico e
 * sóbrio, sem promessas de resultado, conforme diretrizes de publicidade da
 * OAB (Provimento 205/2021). Revisar e ajustar a descrição de cada área
 * conforme a prática real do advogado antes da publicação definitiva.
 */
export const areasAtuacao: AreaAtuacao[] = [
  {
    slug: "direito-penal",
    titulo: "Direito Penal",
    resumo:
      "Defesa técnica em todas as fases da persecução penal, da investigação ao trânsito em julgado.",
    descricao: [
      "Atuação voltada à defesa de pessoas físicas e jurídicas em matéria penal, com acompanhamento técnico desde os primeiros atos de apuração até as instâncias superiores.",
      "O trabalho é conduzido com base na análise cuidadosa de cada caso, na observância das garantias constitucionais do acusado e no rigor técnico exigido pela complexidade da legislação penal.",
    ],
    topicos: [
      "Análise técnica de casos penais",
      "Acompanhamento em todas as fases processuais",
      "Elaboração de defesas e recursos",
      "Atendimento com sigilo profissional",
    ],
  },
  {
    slug: "processo-penal",
    titulo: "Processo Penal",
    resumo:
      "Atuação estratégica no rito processual penal, com atenção a prazos, nulidades e garantias processuais.",
    descricao: [
      "O processo penal exige domínio técnico do rito e atenção constante às garantias processuais do acusado. A atuação abrange o acompanhamento de audiências, a análise de provas e a apresentação de manifestações e recursos nas instâncias competentes.",
      "Cada etapa processual é conduzida com planejamento, buscando assegurar o pleno exercício do contraditório e da ampla defesa.",
    ],
    topicos: [
      "Acompanhamento de audiências",
      "Análise de provas e nulidades",
      "Recursos em todas as instâncias",
      "Habeas corpus e medidas cautelares",
    ],
  },
  {
    slug: "tribunal-do-juri",
    titulo: "Tribunal do Júri",
    resumo:
      "Defesa técnica em processos de competência do Tribunal do Júri, da fase de pronúncia ao plenário.",
    descricao: [
      "Os processos de competência do Tribunal do Júri possuem rito e dinâmica próprios, que exigem preparação técnica específica — da fase de instrução e pronúncia até a sustentação oral em plenário perante o Conselho de Sentença.",
      "A atuação é pautada pela preparação minuciosa de cada etapa, com respeito às regras do procedimento e aos princípios constitucionais que regem o júri popular.",
    ],
    topicos: [
      "Fase de instrução e pronúncia",
      "Preparação para sessão de julgamento",
      "Sustentação oral em plenário",
      "Recursos contra decisões do júri",
    ],
  },
  {
    slug: "inqueritos-e-investigacoes",
    titulo: "Inquéritos e Investigações",
    resumo:
      "Acompanhamento de investigados desde a fase pré-processual, com atuação técnica junto à autoridade policial e ao Ministério Público.",
    descricao: [
      "A fase de inquérito policial e de investigações preliminares é frequentemente decisiva para o desenrolar de um caso penal. O acompanhamento técnico nessa etapa permite orientar o investigado sobre seus direitos e requerer as diligências pertinentes.",
      "A atuação preventiva e bem orientada nesta fase pode ser determinante para a estratégia de defesa nas etapas seguintes.",
    ],
    topicos: [
      "Acompanhamento de oitivas e depoimentos",
      "Requerimento de diligências",
      "Orientação sobre direitos do investigado",
      "Interlocução técnica com autoridades",
    ],
  },
  {
    slug: "crimes-empresariais",
    titulo: "Crimes Empresariais",
    resumo:
      "Defesa técnica de empresários, administradores e sociedades em matéria penal empresarial.",
    descricao: [
      "Empresários e administradores podem responder criminalmente por atos praticados no exercício da atividade empresarial. A atuação abrange a análise de riscos penais associados à gestão e a defesa técnica em processos que envolvam a pessoa jurídica ou seus representantes.",
      "O trabalho busca compreender a dinâmica societária e operacional de cada caso, com atenção às particularidades do direito penal econômico.",
    ],
    topicos: [
      "Defesa de administradores e sócios",
      "Análise de risco penal empresarial",
      "Atuação em investigações internas",
      "Interlocução com órgãos de fiscalização",
    ],
  },
  {
    slug: "crimes-economicos",
    titulo: "Crimes Econômicos",
    resumo:
      "Atuação técnica em matéria de direito penal econômico e financeiro.",
    descricao: [
      "Casos que envolvem crimes econômicos e financeiros costumam apresentar alta complexidade probatória, com necessidade de análise documental e contábil detalhada.",
      "A defesa técnica nesses casos exige domínio da legislação especial aplicável e articulação com peritos e assistentes técnicos, quando pertinente.",
    ],
    topicos: [
      "Crimes contra o sistema financeiro",
      "Lavagem de dinheiro",
      "Análise documental e contábil",
      "Atuação em processos de alta complexidade",
    ],
  },
];

export function getAreaBySlug(slug: string) {
  return areasAtuacao.find((area) => area.slug === slug);
}
