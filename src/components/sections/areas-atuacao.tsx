import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { areasAtuacao } from "@/content/areas-atuacao";

export function AreasAtuacaoSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-editorial">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Áreas de atuação"
            title="Onde a defesa técnica faz a diferença"
          />
          <Link
            href="/atuacao"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            Ver todas as áreas
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {areasAtuacao.map((area) => (
            <Link
              key={area.slug}
              href={`/atuacao/${area.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-border p-7 transition-colors hover:border-primary"
            >
              <div>
                <h3 className="font-display text-xl font-medium text-foreground group-hover:text-primary">
                  {area.titulo}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
                  {area.resumo}
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Saiba mais
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
