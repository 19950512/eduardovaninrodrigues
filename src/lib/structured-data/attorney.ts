import { siteConfig } from "@/lib/config";
import { areasAtuacao } from "@/content/areas-atuacao";

/**
 * Dados estruturados Schema.org (JSON-LD) do tipo Attorney, que estende
 * LocalBusiness. Reúne as informações essenciais para SEO local e para
 * mecanismos de busca generativa / IA (GEO) identificarem corretamente
 * quem é o profissional, sua especialidade, localização e credenciais.
 */
export function buildAttorneyJsonLd() {
  const { endereco } = siteConfig;

  return {
    "@context": "https://schema.org",
    "@type": "Attorney",
    "@id": `${siteConfig.site.url}/#advogado`,
    name: siteConfig.nomeExibicao,
    alternateName: siteConfig.nome,
    url: siteConfig.site.url,
    image: `${siteConfig.site.url}/images/people/eduardo-retrato-formal.jpg`,
    description:
      "Advogado criminalista com atuação técnica em Direito Penal, Processo Penal, Tribunal do Júri, inquéritos, investigações e crimes empresariais e econômicos.",
    jobTitle: siteConfig.titulo,
    telephone: siteConfig.telefone.e164,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: endereco.logradouro,
      addressLocality: endereco.cidade,
      addressRegion: endereco.uf,
      postalCode: endereco.cep,
      addressCountry: endereco.pais,
    },
    areaServed: {
      "@type": "State",
      name: "Rio Grande do Sul",
    },
    knowsAbout: areasAtuacao.map((area) => area.titulo),
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Registro profissional",
      recognizedBy: {
        "@type": "Organization",
        name: "Ordem dos Advogados do Brasil — Seccional Rio Grande do Sul",
      },
      identifier: siteConfig.oab.exibicao,
    },
    alumniOf: siteConfig.formacao.map((item) => ({
      "@type": "EducationalOrganization",
      name: item,
    })),
    sameAs: Object.values(siteConfig.redesSociais).filter(Boolean),
  } as const;
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.site.url}/#site`,
    url: siteConfig.site.url,
    name: siteConfig.site.nomeCurto,
    publisher: { "@id": `${siteConfig.site.url}/#advogado` },
    inLanguage: "pt-BR",
  } as const;
}
