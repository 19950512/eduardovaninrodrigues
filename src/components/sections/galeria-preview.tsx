import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { fotosGaleria } from "@/content/galeria";

export function GaleriaPreview() {
  const destaques = fotosGaleria.slice(0, 4);

  return (
    <section className="border-y border-border bg-background-subtle py-20 lg:py-28">
      <div className="container-editorial">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="Galeria" title="Registros da atuação profissional" />
          <Link
            href="/galeria"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            Ver galeria completa
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {destaques.map((foto, index) => (
            <Link
              key={foto.slug}
              href="/galeria"
              className="relative aspect-[3/4] overflow-hidden rounded-xl bg-ink"
            >
              <Image
                src={foto.src}
                alt={foto.alt}
                fill
                sizes="(min-width: 1024px) 22vw, 45vw"
                loading={index === 0 ? "eager" : "lazy"}
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
