import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-1 items-center justify-center py-24">
      <div className="container-editorial text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Erro 404
        </p>
        <h1 className="font-display mt-3 text-4xl font-medium text-foreground sm:text-5xl">
          Página não encontrada
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-foreground-muted">
          O conteúdo que você procura não existe ou foi movido.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Voltar para o início
        </Link>
      </div>
    </section>
  );
}
