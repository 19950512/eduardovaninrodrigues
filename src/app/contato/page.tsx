import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ContactForm } from "@/components/contact-form";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = buildMetadata({
  title: "Contato",
  description:
    "Entre em contato com Eduardo Vanin Rodrigues, advogado criminalista OAB/RS 133.074, por telefone, WhatsApp, e-mail ou formulário.",
  path: "/contato",
});

export default function ContatoPage() {
  const { endereco, telefone, whatsapp, email } = siteConfig;
  const whatsappHref = `https://wa.me/${whatsapp.numeroE164}?text=${encodeURIComponent(
    whatsapp.mensagemPadrao,
  )}`;

  return (
    <>
      <Breadcrumbs items={[{ label: "Início", path: "/" }, { label: "Contato", path: "/contato" }]} />

      <section className="pb-20 pt-4 lg:pb-28">
        <div className="container-editorial grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Contato
            </p>
            <h1 className="font-display mt-3 text-balance text-4xl font-medium leading-tight text-foreground sm:text-5xl">
              Fale com o escritório
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-foreground-muted">
              Utilize um dos canais abaixo ou preencha o formulário para uma
              primeira conversa. O atendimento é conduzido com discrição e
              atenção às particularidades de cada caso.
            </p>

            <ul className="mt-9 space-y-4">
              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:border-primary"
                >
                  <MessageCircle className="h-5 w-5 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">WhatsApp</p>
                    <p className="text-sm text-foreground-muted">{whatsapp.exibicao}</p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${telefone.e164}`}
                  className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:border-primary"
                >
                  <Phone className="h-5 w-5 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Telefone</p>
                    <p className="text-sm text-foreground-muted">{telefone.exibicao}</p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:border-primary"
                >
                  <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">E-mail</p>
                    <p className="break-all text-sm text-foreground-muted">{email}</p>
                  </div>
                </a>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-border p-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Endereço</p>
                  <p className="text-sm text-foreground-muted">
                    {endereco.logradouro}
                    <br />
                    {endereco.bairro} — {endereco.cidade}/{endereco.uf}
                    <br />
                    CEP {endereco.cep}
                  </p>
                </div>
              </li>
            </ul>

            {endereco.googleMapsEmbedUrl ? (
              <div className="mt-6 aspect-[4/3] w-full overflow-hidden rounded-xl border border-border">
                <iframe
                  src={endereco.googleMapsEmbedUrl}
                  title={`Localização do escritório — ${siteConfig.nomeExibicao}`}
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              <p className="mt-6 rounded-xl border border-dashed border-border p-4 text-xs text-foreground-muted">
                Mapa será exibido aqui assim que o endereço definitivo do
                escritório for confirmado.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-background-subtle p-6 sm:p-8">
            <h2 className="font-display text-2xl font-medium text-foreground">
              Envie uma mensagem
            </h2>
            <p className="mt-2 text-sm text-foreground-muted">
              Responderemos o quanto antes pelo e-mail ou telefone informado.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
