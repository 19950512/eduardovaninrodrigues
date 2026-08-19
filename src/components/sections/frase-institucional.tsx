import { siteConfig } from "@/lib/config";

export function FraseInstitucional() {
  return (
    <section className="bg-primary py-20 text-primary-foreground lg:py-24">
      <div className="container-editorial">
        <p className="font-display mx-auto max-w-3xl text-balance text-center text-2xl font-medium leading-snug sm:text-3xl lg:text-4xl">
          &ldquo;{siteConfig.frasesInstitucionais.principal}&rdquo;
        </p>
        <p className="mt-6 text-center text-sm uppercase tracking-[0.2em] text-primary-foreground/80">
          {siteConfig.nomeExibicao} — {siteConfig.oab.exibicao}
        </p>
      </div>
    </section>
  );
}
