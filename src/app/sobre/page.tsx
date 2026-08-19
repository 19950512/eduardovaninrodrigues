import type { Metadata } from "next";
import Image from "next/image";
import { GraduationCap, Scale, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContatoCta } from "@/components/sections/contato-cta";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = buildMetadata({
  title: "O Advogado",
  description:
    "Conheça a formação, a trajetória e a filosofia de atuação de Eduardo Vanin Rodrigues, advogado criminalista OAB/RS 133.074.",
  path: "/sobre",
});

const principios = [
  {
    Icon: Scale,
    titulo: "Rigor técnico",
    descricao:
      "Cada caso é analisado com base na legislação aplicável, na jurisprudência relevante e nas particularidades do fato concreto.",
  },
  {
    Icon: ShieldCheck,
    titulo: "Ética e sigilo",
    descricao:
      "O atendimento observa o sigilo profissional e a conduta ética exigida pelo Estatuto da OAB em todas as etapas.",
  },
  {
    Icon: GraduationCap,
    titulo: "Atualização constante",
    descricao:
      "Formação continuada em Direito Penal, Processo Penal e Criminologia para acompanhar a evolução da legislação e da jurisprudência.",
  },
];

export default function SobrePage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Início", path: "/" }, { label: "O Advogado", path: "/sobre" }]} />

      <section className="pb-16 pt-4 lg:pb-24">
        <div className="container-editorial grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl bg-ink lg:sticky lg:top-28 lg:mx-0">
            <Image
              src="/images/people/eduardo-retrato-formal.jpg"
              alt={`Retrato de ${siteConfig.nomeExibicao}, ${siteConfig.titulo}`}
              fill
              sizes="(min-width: 1024px) 35vw, 90vw"
              className="object-cover"
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              O advogado
            </p>
            <h1 className="font-display mt-3 text-balance text-4xl font-medium leading-tight text-foreground sm:text-5xl">
              {siteConfig.nomeExibicao}
            </h1>
            <p className="mt-2 text-lg text-foreground-muted">
              {siteConfig.titulo} · {siteConfig.oab.exibicao}
            </p>

            <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground-muted">
              <p>
                {siteConfig.nomeExibicao} atua como advogado criminalista,
                com dedicação à defesa técnica em processos de natureza
                penal. Sua atuação abrange desde a fase de investigação
                preliminar até o julgamento em Tribunal do Júri, sempre
                pautada pela observância das garantias constitucionais do
                acusado.
              </p>
              <p>
                É bacharel em Direito pela FABE e mantém formação continuada
                na área criminal, atualmente cursando pós-graduação em
                Direito Penal e Processo Penal, além de pós-graduação em
                Direito Penal e Criminologia pela UNINTER.
              </p>
              <p>
                Sua atuação profissional é marcada pela presença constante em
                audiências e sessões do Tribunal do Júri, com preparação
                técnica cuidadosa para cada etapa processual — da instrução à
                sustentação oral em plenário.
              </p>
              <p className="text-sm italic text-foreground-muted/80">
                Este texto está em fase de revisão e será atualizado com mais
                detalhes sobre a trajetória profissional, conforme material
                fornecido pelo cliente.
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-3">
              {principios.map(({ Icon, titulo, descricao }) => (
                <div key={titulo} className="rounded-2xl border border-border p-6">
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  <p className="font-display mt-3 text-base font-medium text-foreground">
                    {titulo}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                    {descricao}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background-subtle py-16 lg:py-24">
        <div className="container-editorial">
          <SectionHeading
            eyebrow="Formação"
            title="Trajetória acadêmica"
            align="center"
          />
          <ul className="mx-auto mt-10 max-w-xl space-y-4">
            {siteConfig.formacao.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border border-border bg-surface px-5 py-4 text-sm text-foreground-muted"
              >
                <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContatoCta />
    </>
  );
}
