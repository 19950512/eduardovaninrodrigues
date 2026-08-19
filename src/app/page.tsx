import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { SobrePreview } from "@/components/sections/sobre-preview";
import { Formacao } from "@/components/sections/formacao";
import { AreasAtuacaoSection } from "@/components/sections/areas-atuacao";
import { Metodologia } from "@/components/sections/metodologia";
import { FraseInstitucional } from "@/components/sections/frase-institucional";
import { ArtigosDestaque } from "@/components/sections/artigos-destaque";
import { GaleriaPreview } from "@/components/sections/galeria-preview";
import { ContatoCta } from "@/components/sections/contato-cta";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Advogado Criminalista em Direito Penal e Tribunal do Júri",
  description:
    "Eduardo Vanin Rodrigues, advogado criminalista OAB/RS 133.074. Defesa técnica em Direito Penal, Processo Penal, Tribunal do Júri, inquéritos e crimes empresariais.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <SobrePreview />
      <Formacao />
      <AreasAtuacaoSection />
      <Metodologia />
      <FraseInstitucional />
      <ArtigosDestaque />
      <GaleriaPreview />
      <ContatoCta />
    </>
  );
}
