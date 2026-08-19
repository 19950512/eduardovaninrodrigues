export type Artigo = {
  slug: string;
  titulo: string;
  resumo: string;
  data: string; // ISO 8601
  autor: string;
  imagem: string;
  imagemAlt: string;
  categoria: string;
  conteudo: string[]; // parágrafos
  relacionados: string[]; // slugs
};

/**
 * Conteúdo de exemplo (placeholder) para demonstrar a estrutura de artigos.
 * Texto meramente informativo e genérico — deve ser revisado, substituído
 * ou expandido pelo cliente antes da publicação. Nenhuma promessa de
 * resultado ou informação de caso real está presente, em conformidade com
 * as normas de publicidade da OAB.
 */
export const artigos: Artigo[] = [
  {
    slug: "prisao-em-flagrante-direitos-do-preso",
    titulo: "Prisão em flagrante: o que é e quais são os direitos do preso",
    resumo:
      "Entenda as hipóteses de flagrante previstas em lei e as garantias constitucionais que devem ser observadas desde o primeiro momento da prisão.",
    data: "2026-06-10",
    autor: "Eduardo Vanin Rodrigues",
    imagem: "/images/gallery/eduardo-tribunal-juri.jpg",
    imagemAlt:
      "Eduardo Vanin Rodrigues em atuação profissional durante audiência",
    categoria: "Direito Penal",
    conteudo: [
      "A prisão em flagrante é uma das modalidades de prisão previstas no ordenamento jurídico brasileiro e ocorre quando a pessoa é surpreendida cometendo a infração penal, ou logo após, nas situações descritas no artigo 302 do Código de Processo Penal.",
      "Desde o momento da prisão, a pessoa presa tem direito a ser informada sobre seus direitos constitucionais, entre eles o direito ao silêncio, à assistência de advogado e à comunicação da prisão à família e ao juízo competente.",
      "A lavratura do auto de prisão em flagrante deve observar formalidades legais específicas. Eventuais irregularidades nesse procedimento podem ser objeto de análise técnica pela defesa, que avaliará a legalidade do ato e as medidas cabíveis, incluindo o pedido de relaxamento de prisão quando identificada ilegalidade.",
      "A audiência de custódia, realizada em até 24 horas após a prisão, é o momento em que o preso é apresentado à autoridade judicial, que analisará a legalidade da prisão e a eventual necessidade de conversão em prisão preventiva ou aplicação de medidas cautelares diversas.",
      "Este texto tem caráter informativo geral e não substitui a orientação de um advogado sobre um caso concreto.",
    ],
    relacionados: [
      "audiencia-de-custodia-como-funciona",
      "diferenca-entre-inquerito-e-processo-penal",
    ],
  },
  {
    slug: "audiencia-de-custodia-como-funciona",
    titulo: "Audiência de custódia: como funciona e qual sua importância",
    resumo:
      "Um panorama sobre o procedimento da audiência de custódia e o papel da defesa técnica nessa etapa inicial do processo penal.",
    data: "2026-06-24",
    autor: "Eduardo Vanin Rodrigues",
    imagem: "/images/gallery/eduardo-bastidores.jpg",
    imagemAlt: "Eduardo Vanin Rodrigues nos bastidores de um tribunal",
    categoria: "Processo Penal",
    conteudo: [
      "A audiência de custódia é o ato processual em que a pessoa presa em flagrante é conduzida à presença de um juiz em até 24 horas, conforme prevê a Resolução 213/2015 do Conselho Nacional de Justiça e o Pacto de San José da Costa Rica.",
      "Nessa audiência, o juiz analisa a legalidade da prisão, verifica se houve algum tipo de violência ou tratamento desumano durante a abordagem e decide sobre a manutenção da prisão, a concessão de liberdade provisória ou a aplicação de medidas cautelares alternativas.",
      "A presença de defesa técnica na audiência de custódia é fundamental para que sejam apresentados os argumentos pertinentes à situação concreta, com atenção às circunstâncias pessoais do preso e à necessidade (ou não) da manutenção da prisão.",
      "Este texto tem caráter informativo geral e não substitui a orientação de um advogado sobre um caso concreto.",
    ],
    relacionados: [
      "prisao-em-flagrante-direitos-do-preso",
      "diferenca-entre-inquerito-e-processo-penal",
    ],
  },
  {
    slug: "diferenca-entre-inquerito-e-processo-penal",
    titulo: "Qual a diferença entre inquérito policial e processo penal?",
    resumo:
      "Duas etapas distintas da persecução penal, com funções, prazos e direitos diferentes para o investigado e para o réu.",
    data: "2026-07-08",
    autor: "Eduardo Vanin Rodrigues",
    imagem: "/images/gallery/eduardo-atuacao-gestual.jpg",
    imagemAlt: "Eduardo Vanin Rodrigues em atuação durante sustentação oral",
    categoria: "Inquéritos e Investigações",
    conteudo: [
      "O inquérito policial é um procedimento administrativo, presidido pela autoridade policial, que tem por finalidade reunir elementos de informação sobre a autoria e a materialidade de uma infração penal, subsidiando a decisão do Ministério Público sobre o oferecimento (ou não) de denúncia.",
      "Já o processo penal tem natureza jurisdicional e se inicia com o recebimento da denúncia ou queixa pelo juízo competente, momento em que a pessoa investigada passa à condição de acusada (ou ré), com todas as garantias do contraditório e da ampla defesa.",
      "Compreender essa diferença é importante porque os direitos e as estratégias de atuação variam conforme a fase em que o caso se encontra. Na fase de inquérito, por exemplo, ainda não há necessariamente uma acusação formal, o que não impede o acompanhamento técnico desde esse momento.",
      "Este texto tem caráter informativo geral e não substitui a orientação de um advogado sobre um caso concreto.",
    ],
    relacionados: [
      "prisao-em-flagrante-direitos-do-preso",
      "audiencia-de-custodia-como-funciona",
    ],
  },
];

export function getArtigoBySlug(slug: string) {
  return artigos.find((artigo) => artigo.slug === slug);
}

export function getArtigosRelacionados(slugs: string[]) {
  return artigos.filter((artigo) => slugs.includes(artigo.slug));
}
