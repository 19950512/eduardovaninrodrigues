export type FotoGaleria = {
  slug: string;
  src: string;
  alt: string;
  largura: number;
  altura: number;
};

/**
 * Fotos aprovadas para uso público no site. Duas fotografias recebidas do
 * cliente foram deliberadamente excluídas desta galeria por precaução:
 * uma envolve um terceiro identificável em contexto de comemoração
 * (susceptível de ser lida como promessa/alusão a resultado, vedada pelas
 * normas de publicidade da OAB) e outra exibe, em segundo plano, dados
 * legíveis de um documento processual. Ambas seguem disponíveis em
 * public/images/source caso o cliente quera revisar o recorte e autorizar o uso.
 */
export const fotosGaleria: FotoGaleria[] = [
  {
    slug: "retrato-formal",
    src: "/images/people/eduardo-retrato-formal.jpg",
    alt: "Retrato de Eduardo Vanin Rodrigues, advogado criminalista, trajando becas em sala de audiência",
    largura: 1400,
    altura: 2489,
  },
  {
    slug: "atuacao-tribunal-juri",
    src: "/images/gallery/eduardo-tribunal-juri.jpg",
    alt: "Eduardo Vanin Rodrigues em sustentação oral perante o Tribunal do Júri",
    largura: 1600,
    altura: 2133,
  },
  {
    slug: "atuacao-gestual",
    src: "/images/gallery/eduardo-atuacao-gestual.jpg",
    alt: "Eduardo Vanin Rodrigues em momento de argumentação durante audiência",
    largura: 1200,
    altura: 2667,
  },
  {
    slug: "bastidores",
    src: "/images/gallery/eduardo-bastidores.jpg",
    alt: "Eduardo Vanin Rodrigues nos bastidores de um tribunal, a caminho de uma sessão",
    largura: 1200,
    altura: 2136,
  },
];
