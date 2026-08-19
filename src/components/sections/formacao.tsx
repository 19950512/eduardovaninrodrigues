import { GraduationCap, Scale, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/lib/config";

const credenciais = [
  {
    Icon: Scale,
    titulo: siteConfig.oab.exibicao,
    descricao: "Registro profissional ativo junto à Ordem dos Advogados do Brasil.",
  },
  {
    Icon: GraduationCap,
    titulo: "Formação acadêmica",
    descricao: siteConfig.formacao.join(" · "),
  },
  {
    Icon: ShieldCheck,
    titulo: "Sigilo e discrição",
    descricao:
      "Atendimento pautado pelo sigilo profissional e pela conduta ética em cada etapa do caso.",
  },
];

export function Formacao() {
  return (
    <section className="border-y border-border bg-background-subtle py-20 lg:py-24">
      <div className="container-editorial">
        <SectionHeading
          eyebrow="Autoridade e formação"
          title="Base técnica sólida para uma defesa consistente"
          align="center"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {credenciais.map(({ Icon, titulo, descricao }) => (
            <div
              key={titulo}
              className="rounded-2xl border border-border bg-surface p-7"
            >
              <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
              <p className="font-display mt-4 text-lg font-medium text-foreground">
                {titulo}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                {descricao}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
