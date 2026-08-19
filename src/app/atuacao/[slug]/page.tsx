import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ContatoCta } from "@/components/sections/contato-cta";
import { areasAtuacao, getAreaBySlug } from "@/content/areas-atuacao";
import { buildMetadata } from "@/lib/seo/metadata";

type Params = { slug: string };

export function generateStaticParams() {
  return areasAtuacao.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = getAreaBySlug(slug);
  if (!area) return {};

  return buildMetadata({
    title: area.titulo,
    description: area.resumo,
    path: `/atuacao/${area.slug}`,
  });
}

export default async function AreaAtuacaoPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const area = getAreaBySlug(slug);
  if (!area) notFound();

  const outrasAreas = areasAtuacao.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Início", path: "/" },
          { label: "Atuação", path: "/atuacao" },
          { label: area.titulo, path: `/atuacao/${area.slug}` },
        ]}
      />

      <section className="pb-20 pt-4 lg:pb-28">
        <div className="container-editorial grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Área de atuação
            </p>
            <h1 className="font-display mt-3 text-balance text-4xl font-medium leading-tight text-foreground sm:text-5xl">
              {area.titulo}
            </h1>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground-muted">
              {area.descricao.map((paragrafo, index) => (
                <p key={index}>{paragrafo}</p>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-border bg-background-subtle p-7">
              <p className="font-display text-lg font-medium text-foreground">
                Frentes de atuação
              </p>
              <ul className="mt-4 space-y-3">
                {area.topicos.map((topico) => (
                  <li key={topico} className="flex items-start gap-2.5 text-sm text-foreground-muted">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    {topico}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/contato"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Entrar em contato
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <aside>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground-muted">
              Outras áreas
            </p>
            <div className="mt-5 space-y-3">
              {outrasAreas.map((outra) => (
                <Link
                  key={outra.slug}
                  href={`/atuacao/${outra.slug}`}
                  className="block rounded-xl border border-border p-5 transition-colors hover:border-primary"
                >
                  <p className="font-display text-base font-medium text-foreground">
                    {outra.titulo}
                  </p>
                  <p className="mt-1.5 text-sm text-foreground-muted">{outra.resumo}</p>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <ContatoCta />
    </>
  );
}
