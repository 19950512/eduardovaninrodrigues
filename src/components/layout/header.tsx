"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { navegacao, siteConfig } from "@/lib/config";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Fecha o menu mobile ao trocar de rota, ajustando o estado durante a
  // renderização (em vez de em um efeito), seguindo o padrão recomendado
  // pelo React para "resetar estado quando um prop muda".
  const [pathnameAnterior, setPathnameAnterior] = useState(pathname);
  if (pathname !== pathnameAnterior) {
    setPathnameAnterior(pathname);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="container-editorial flex h-20 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label={`${siteConfig.nomeExibicao} — página inicial`}
        >
          <Image
            src="/logo/logo.png"
            alt=""
            width={228}
            height={180}
            priority
            className="h-9 w-auto shrink-0 dark:invert sm:h-10"
          />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              {siteConfig.nome}
            </span>
            <span className="text-[11px] uppercase tracking-[0.16em] text-primary sm:text-xs">
              {siteConfig.titulo} · {siteConfig.oab.exibicao}
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label="Navegação principal"
        >
          {navegacao.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                  active ? "text-primary" : "text-foreground-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Link
            href="/contato"
            className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Entrar em contato
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground"
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="menu-mobile"
          className="border-t border-border bg-background lg:hidden"
        >
          <nav
            className="container-editorial flex flex-col gap-1 py-4"
            aria-label="Navegação mobile"
          >
            {navegacao.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-md px-2 py-3 text-base font-medium ${
                    active
                      ? "text-primary"
                      : "text-foreground-muted hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/contato"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              Entrar em contato
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
