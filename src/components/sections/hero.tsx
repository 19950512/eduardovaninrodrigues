import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background-subtle">
      <div className="container-editorial grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div>
          <h1 className="font-display mt-5 text-balance text-4xl font-medium leading-[1.08] text-foreground sm:text-5xl lg:text-[3.4rem]">
            Defesa técnica e discrição em cada etapa do processo penal
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground-muted">
            Atuação criminalista pautada pelo rigor técnico, pela análise
            cuidadosa de cada caso e pelo compromisso com as garantias
            constitucionais do cliente — do inquérito ao Tribunal do Júri.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contato"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Entrar em contato
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/atuacao"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Áreas de atuação
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-ink">
            <Image
              src="/images/people/eduardo-retrato-formal.jpg"
              alt={`Retrato de ${siteConfig.nomeExibicao}, ${siteConfig.titulo}`}
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-xl border border-border bg-surface px-6 py-4 shadow-lg sm:block">
            <p className="font-display text-2xl font-semibold text-primary">
              {siteConfig.oab.exibicao}
            </p>
            <p className="text-xs uppercase tracking-[0.14em] text-foreground-muted">
              Registro profissional ativo
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
