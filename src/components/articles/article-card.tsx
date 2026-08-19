import Image from "next/image";
import Link from "next/link";
import type { Artigo } from "@/content/artigos";

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function ArticleCard({ artigo }: { artigo: Artigo }) {
  return (
    <Link
      href={`/artigos/${artigo.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border transition-colors hover:border-primary"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink">
        <Image
          src={artigo.imagem}
          alt={artigo.imagemAlt}
          fill
          sizes="(min-width: 1024px) 33vw, 90vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          {artigo.categoria}
        </p>
        <h3 className="font-display mt-2.5 text-lg font-medium leading-snug text-foreground group-hover:text-primary">
          {artigo.titulo}
        </h3>
        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-foreground-muted">
          {artigo.resumo}
        </p>
        <p className="mt-4 text-xs text-foreground-muted">
          <time dateTime={artigo.data}>{formatarData(artigo.data)}</time>
          {" · "}
          {artigo.autor}
        </p>
      </div>
    </Link>
  );
}
