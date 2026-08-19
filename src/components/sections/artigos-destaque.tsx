import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ArticleCard } from "@/components/articles/article-card";
import { artigos } from "@/content/artigos";

export function ArtigosDestaque() {
  const destaques = [...artigos]
    .sort((a, b) => (a.data < b.data ? 1 : -1))
    .slice(0, 3);

  return (
    <section className="py-20 lg:py-28">
      <div className="container-editorial">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="Artigos" title="Conteúdo técnico e informativo" />
          <Link
            href="/artigos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            Ver todos os artigos
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destaques.map((artigo) => (
            <ArticleCard key={artigo.slug} artigo={artigo} />
          ))}
        </div>
      </div>
    </section>
  );
}
