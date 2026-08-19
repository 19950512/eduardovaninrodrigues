import { SectionHeading } from "@/components/ui/section-heading";

const etapas = [
  {
    numero: "01",
    titulo: "Escuta e análise",
    descricao:
      "Compreensão detalhada do caso, dos fatos e do estágio processual em que se encontra.",
  },
  {
    numero: "02",
    titulo: "Estratégia técnica",
    descricao:
      "Definição da linha de defesa com base na legislação aplicável e nas circunstâncias concretas do caso.",
  },
  {
    numero: "03",
    titulo: "Atuação processual",
    descricao:
      "Acompanhamento próximo de cada etapa, com as manifestações e diligências pertinentes.",
  },
  {
    numero: "04",
    titulo: "Comunicação constante",
    descricao:
      "Retorno claro e objetivo ao cliente sobre o andamento do caso, com sigilo e discrição.",
  },
];

export function Metodologia() {
  return (
    <section className="border-y border-border bg-background-subtle py-20 lg:py-28">
      <div className="container-editorial">
        <SectionHeading
          eyebrow="Metodologia"
          title="Como a atuação é conduzida"
          description="Um processo estruturado, pensado para dar previsibilidade e clareza ao cliente em cada fase do caso."
        />
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {etapas.map((etapa) => (
            <li key={etapa.numero} className="border-l-2 border-primary pl-5">
              <span className="font-display text-3xl font-medium text-primary">
                {etapa.numero}
              </span>
              <p className="mt-3 font-display text-lg font-medium text-foreground">
                {etapa.titulo}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                {etapa.descricao}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
