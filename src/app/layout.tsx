import type { Metadata } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { JsonLd } from "@/components/seo/json-ld";
import { buildAttorneyJsonLd, buildWebSiteJsonLd } from "@/lib/structured-data/attorney";
import { siteConfig } from "@/lib/config";
import { defaultTitleTemplate } from "@/lib/seo/metadata";

// Fontes hospedadas localmente (next/font/local) a partir de arquivos
// variáveis auto-hospedados em src/fonts — evita dependência de rede em
// tempo de build/execução e mantém zero layout shift (next/font).
const fontDisplay = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    { path: "../fonts/fraunces-normal.woff2", weight: "300 700", style: "normal" },
    { path: "../fonts/fraunces-italic.woff2", weight: "300 700", style: "italic" },
  ],
});

const fontBody = localFont({
  variable: "--font-body",
  display: "swap",
  src: [{ path: "../fonts/inter-normal.woff2", weight: "300 800", style: "normal" }],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.site.url),
  title: {
    default: `${siteConfig.nomeExibicao} — ${siteConfig.titulo} | ${siteConfig.oab.exibicao}`,
    template: defaultTitleTemplate,
  },
  description:
    "Eduardo Vanin Rodrigues é advogado criminalista, OAB/RS 133.074. Defesa técnica em Direito Penal, Processo Penal, Tribunal do Júri, inquéritos e investigações.",
  keywords: [
    "advogado criminalista",
    "direito penal",
    "tribunal do júri",
    "advogado criminal RS",
    "Eduardo Vanin Rodrigues",
  ],
  authors: [{ name: siteConfig.nomeExibicao }],
  creator: siteConfig.nomeExibicao,
  applicationName: siteConfig.site.nomeCurto,
  formatDetection: { telephone: true, email: true, address: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${fontDisplay.variable} ${fontBody.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <JsonLd data={buildAttorneyJsonLd()} />
        <JsonLd data={buildWebSiteJsonLd()} />
        <ThemeProvider>
          <a
            href="#conteudo-principal"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            Pular para o conteúdo
          </a>
          <Header />
          <main id="conteudo-principal" className="flex-1">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId={siteConfig.analytics.googleAnalyticsId} />
    </html>
  );
}
