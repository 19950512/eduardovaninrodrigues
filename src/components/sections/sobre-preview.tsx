import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/lib/config";

export function SobrePreview() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-editorial grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl bg-ink lg:mx-0">
          <Image
            src="/images/gallery/eduardo-bastidores.jpg"
            alt={`${siteConfig.nomeExibicao} nos bastidores de um tribunal`}
            fill
            sizes="(min-width: 1024px) 35vw, 90vw"
            className="object-cover"
          />
        </div>

        <div>
          <SectionHeading
            eyebrow="O advogado"
            title="Atuação técnica, ética e comprometida com a defesa"
          />
          <div className="mt-6 space-y-4 text-base leading-relaxed text-foreground-muted">
            <p>
              {siteConfig.nomeExibicao} é advogado criminalista,{" "}
              {siteConfig.oab.exibicao}, com atuação dedicada ao Direito
              Penal e ao Processo Penal. Sua prática é orientada pela análise
              técnica de cada caso e pelo respeito às garantias
              constitucionais do cliente em todas as fases da persecução
              penal.
            </p>
            <p>
              Formado em Direito pela FABE, segue em constante
              aperfeiçoamento acadêmico, com pós-graduação em andamento em
              Direito Penal e Processo Penal, e em Direito Penal e
              Criminologia pela UNINTER.
            </p>
          </div>
          <Link
            href="/sobre"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            Conhecer a trajetória completa
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
