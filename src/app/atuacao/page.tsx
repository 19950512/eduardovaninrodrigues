import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ContatoCta } from "@/components/sections/contato-cta";
import { areasAtuacao } from "@/content/areas-atuacao";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Áreas de Atuação",
  description:
    "Direito Penal, Processo Penal, Tribunal do Júri, Inquéritos e Investigações, Crimes Empresariais e Crimes Econômicos — áreas de atuação de Eduardo Vanin Rodrigues.",
  path: "/atuacao",
});

export default function AtuacaoPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Início", path: "/" }, { label: "Atuação", path: "/atuacao" }]} />

      <section className="pb-20 pt-4 lg:pb-28">
        <div className="container-editorial">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Áreas de atuação
          </p>
          <h1 className="font-display mt-3 max-w-2xl text-balance text-4xl font-medium leading-tight text-foreground sm:text-5xl">
            Defesa técnica especializada em Direito Penal
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground-muted">
            Áreas em que a atuação profissional é efetivamente exercida,
            descritas de forma técnica e objetiva — sem promessas de
            resultado, em conformidade com as normas de publicidade da OAB.
          </p>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {areasAtuacao.map((area) => (
              <Link
                key={area.slug}
                href={`/atuacao/${area.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-border p-7 transition-colors hover:border-primary"
              >
                <div>
                  <h2 className="font-display text-xl font-medium text-foreground group-hover:text-primary">
                    {area.titulo}
                  </h2>
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

      <ContatoCta />
    </>
  );
}
