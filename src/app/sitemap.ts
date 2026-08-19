import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { areasAtuacao } from "@/content/areas-atuacao";
import { artigos } from "@/content/artigos";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.site.url;
  const agora = new Date();

  const paginasEstaticas: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: agora, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/sobre`, lastModified: agora, changeFrequency: "yearly", priority: 0.8 },
    { url: `${base}/atuacao`, lastModified: agora, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/artigos`, lastModified: agora, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/galeria`, lastModified: agora, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contato`, lastModified: agora, changeFrequency: "yearly", priority: 0.6 },
    {
      url: `${base}/politica-de-privacidade`,
      lastModified: agora,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const paginasAreas: MetadataRoute.Sitemap = areasAtuacao.map((area) => ({
    url: `${base}/atuacao/${area.slug}`,
    lastModified: agora,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const paginasArtigos: MetadataRoute.Sitemap = artigos.map((artigo) => ({
    url: `${base}/artigos/${artigo.slug}`,
    lastModified: new Date(artigo.data),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...paginasEstaticas, ...paginasAreas, ...paginasArtigos];
}
