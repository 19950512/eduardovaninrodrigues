import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ArticleCard } from "@/components/articles/article-card";
import { ContatoCta } from "@/components/sections/contato-cta";
import { JsonLd } from "@/components/seo/json-ld";
import {
  artigos,
  getArtigoBySlug,
  getArtigosRelacionados,
} from "@/content/artigos";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildArticleJsonLd } from "@/lib/structured-data/article";

type Params = { slug: string };

export function generateStaticParams() {
  return artigos.map((artigo) => ({ slug: artigo.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artigo = getArtigoBySlug(slug);
  if (!artigo) return {};

  return buildMetadata({
    title: artigo.titulo,
    description: artigo.resumo,
    path: `/artigos/${artigo.slug}`,
    image: artigo.imagem,
  });
}

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function ArtigoPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const artigo = getArtigoBySlug(slug);
  if (!artigo) notFound();

  const relacionados = getArtigosRelacionados(artigo.relacionados);

  return (
    <>
      <JsonLd data={buildArticleJsonLd(artigo)} />
      <Breadcrumbs
        items={[
          { label: "Início", path: "/" },
          { label: "Artigos", path: "/artigos" },
          { label: artigo.titulo, path: `/artigos/${artigo.slug}` },
        ]}
      />

      <article className="pb-20 pt-4 lg:pb-28">
        <div className="container-editorial max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {artigo.categoria}
          </p>
          <h1 className="font-display mt-3 text-balance text-3xl font-medium leading-tight text-foreground sm:text-4xl lg:text-[2.6rem]">
            {artigo.titulo}
          </h1>
          <p className="mt-4 text-sm text-foreground-muted">
            Por {artigo.autor} ·{" "}
            <time dateTime={artigo.data}>{formatarData(artigo.data)}</time>
          </p>

          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-ink">
            <Image
              src={artigo.imagem}
              alt={artigo.imagemAlt}
              fill
              priority
              sizes="(min-width: 1024px) 768px, 100vw"
              className="object-cover"
            />
          </div>

          <div className="prose-article mt-10 space-y-5 text-base leading-relaxed text-foreground-muted">
            {artigo.conteudo.map((paragrafo, index) => (
              <p key={index}>{paragrafo}</p>
            ))}
          </div>
        </div>
      </article>

      {relacionados.length > 0 && (
        <section className="border-t border-border bg-background-subtle py-16 lg:py-20">
          <div className="container-editorial">
            <h2 className="font-display text-2xl font-medium text-foreground">
              Artigos relacionados
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relacionados.map((relacionado) => (
                <ArticleCard key={relacionado.slug} artigo={relacionado} />
              ))}
            </div>
          </div>
        </section>
      )}

      <ContatoCta />
    </>
  );
}
