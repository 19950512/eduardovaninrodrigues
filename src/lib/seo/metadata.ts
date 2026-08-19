import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

type BuildMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
};

const siteUrl = siteConfig.site.url;

/**
 * Helper central para metadata por página: title, description, canonical,
 * Open Graph e robots. Mantém consistência de SEO técnico em todo o site.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: BuildMetadataInput): Metadata {
  const url = new URL(path, siteUrl).toString();
  // Quando nenhuma imagem específica é informada, a página herda a imagem
  // gerada dinamicamente por app/opengraph-image.tsx (convenção de arquivo
  // do Next.js), então omitimos `images` aqui para não sobrescrevê-la.
  const imageUrl = image ? new URL(image, siteUrl).toString() : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true },
        },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.site.nomeCurto,
      locale: "pt_BR",
      type: "website",
      ...(imageUrl
        ? { images: [{ url: imageUrl, width: 1200, height: 630, alt: title }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}

export const defaultTitleTemplate = `%s | ${siteConfig.nomeExibicao} — ${siteConfig.titulo}`;
