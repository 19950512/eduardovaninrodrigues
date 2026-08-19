import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "@/components/ui/social-icons";
import { footerLegal, navegacao, siteConfig } from "@/lib/config";

export function Footer() {
  const ano = new Date().getFullYear();
  const { endereco, redesSociais } = siteConfig;

  const redes = [
    { nome: "Instagram", href: redesSociais.instagram, Icon: InstagramIcon },
    { nome: "LinkedIn", href: redesSociais.linkedin, Icon: LinkedInIcon },
    { nome: "Facebook", href: redesSociais.facebook, Icon: FacebookIcon },
  ].filter((rede) => rede.href);

  return (
    <footer className="border-t border-border bg-background-subtle">
      <div className="container-editorial grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Image
            src="/logo/logo.png"
            alt=""
            width={228}
            height={180}
            className="h-8 w-auto dark:invert"
          />
          <p className="font-display mt-3 text-xl font-semibold text-foreground">
            {siteConfig.nome}
          </p>
          <p className="mt-1 text-sm uppercase tracking-[0.14em] text-primary">
            {siteConfig.titulo} · {siteConfig.oab.exibicao}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground-muted">
            {siteConfig.frasesInstitucionais.principal}
          </p>

          {redes.length > 0 && (
            <div className="mt-6 flex items-center gap-3">
              {redes.map(({ nome, href, Icon }) => (
                <a
                  key={nome}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={nome}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground-muted transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">Navegação</p>
          <ul className="mt-4 space-y-2.5">
            {navegacao.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-foreground-muted transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">Contato</p>
          <ul className="mt-4 space-y-3 text-sm text-foreground-muted">
            <li className="flex items-start gap-2.5">
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <span>
                {endereco.logradouro}
                <br />
                {endereco.bairro} — {endereco.cidade}/{endereco.uf}
                <br />
                CEP {endereco.cep}
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <a
                href={`tel:${siteConfig.telefone.e164}`}
                className="transition-colors hover:text-primary"
              >
                {siteConfig.telefone.exibicao}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <a
                href={`mailto:${siteConfig.email}`}
                className="break-all transition-colors hover:text-primary"
              >
                {siteConfig.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-editorial flex flex-col items-start justify-between gap-3 py-6 text-xs text-foreground-muted sm:flex-row sm:items-center">
          <p>
            © {ano} {siteConfig.nome} — {siteConfig.oab.exibicao}. Todos os
            direitos reservados.
          </p>
          <div className="flex items-center gap-5">
            {footerLegal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
