import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function ContatoCta() {
  const href = `https://wa.me/${siteConfig.whatsapp.numeroE164}?text=${encodeURIComponent(
    siteConfig.whatsapp.mensagemPadrao,
  )}`;

  return (
    <section className="py-20 lg:py-28">
      <div className="container-editorial">
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl border border-border bg-background-subtle px-8 py-12 sm:flex-row sm:items-center sm:px-12">
          <div>
            <h2 className="font-display text-2xl font-medium text-foreground sm:text-3xl">
              Precisa de orientação técnica em um caso penal?
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-foreground-muted">
              Entre em contato para uma conversa inicial. Evite enviar
              informações sigilosas por formulário ou mensagem — os detalhes
              do caso poderão ser tratados com segurança em atendimento
              direto.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto">
            <Link
              href="/contato"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Ir para contato
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
