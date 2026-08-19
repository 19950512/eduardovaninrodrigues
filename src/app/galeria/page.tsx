import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { fotosGaleria } from "@/content/galeria";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Galeria",
  description:
    "Fotos da atuação profissional de Eduardo Vanin Rodrigues, advogado criminalista OAB/RS 133.074.",
  path: "/galeria",
});

export default function GaleriaPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Início", path: "/" }, { label: "Galeria", path: "/galeria" }]} />

      <section className="pb-20 pt-4 lg:pb-28">
        <div className="container-editorial">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Galeria
          </p>
          <h1 className="font-display mt-3 max-w-2xl text-balance text-4xl font-medium leading-tight text-foreground sm:text-5xl">
            Registros da atuação profissional
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground-muted">
            Uma seleção de fotografias profissionais. Clique em qualquer
            imagem para ampliar e navegar pela galeria.
          </p>

          <div className="mt-14">
            <GalleryGrid fotos={fotosGaleria} />
          </div>
        </div>
      </section>
    </>
  );
}
