import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ArticleCard } from "@/components/articles/article-card";
import { artigos } from "@/content/artigos";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Artigos",
  description:
    "Artigos e conteúdo técnico sobre direito criminal e Processo Penal, escritos por Eduardo Vanin Rodrigues, advogado criminalista OAB/RS 133.074.",
  path: "/artigos",
});

export default function ArtigosPage() {
  const ordenados = [...artigos].sort((a, b) => (a.data < b.data ? 1 : -1));

  return (
    <>
      <Breadcrumbs items={[{ label: "Início", path: "/" }, { label: "Artigos", path: "/artigos" }]} />

      <section className="pb-20 pt-4 lg:pb-28">
        <div className="container-editorial">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Artigos
          </p>
          <h1 className="font-display mt-3 max-w-2xl text-balance text-4xl font-medium leading-tight text-foreground sm:text-5xl">
            Conteúdo técnico sobre direito criminal
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground-muted">
            Textos informativos sobre procedimentos e direitos em matéria
            penal. O conteúdo tem caráter geral e não substitui a orientação
            do advogado sobre um caso concreto.
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ordenados.map((artigo) => (
              <ArticleCard key={artigo.slug} artigo={artigo} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
