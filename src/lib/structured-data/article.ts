import { siteConfig } from "@/lib/config";
import type { Artigo } from "@/content/artigos";

export function buildArticleJsonLd(artigo: Artigo) {
  const url = new URL(`/artigos/${artigo.slug}`, siteConfig.site.url).toString();
  const imageUrl = new URL(artigo.imagem, siteConfig.site.url).toString();

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#artigo`,
    headline: artigo.titulo,
    description: artigo.resumo,
    image: [imageUrl],
    datePublished: artigo.data,
    dateModified: artigo.data,
    author: {
      "@type": "Person",
      name: artigo.autor,
      url: siteConfig.site.url,
    },
    publisher: {
      "@type": "Attorney",
      name: siteConfig.nomeExibicao,
      logo: {
        "@type": "ImageObject",
        url: new URL(
          "/images/people/eduardo-retrato-formal.jpg",
          siteConfig.site.url,
        ).toString(),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    articleSection: artigo.categoria,
    inLanguage: "pt-BR",
  } as const;
}
