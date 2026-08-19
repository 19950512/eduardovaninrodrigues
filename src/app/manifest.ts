import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.site.nomeCurto,
    short_name: siteConfig.nome,
    description: siteConfig.frasesInstitucionais.principal,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#7a1128",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
