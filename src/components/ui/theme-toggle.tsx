"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * Alternância manual entre tema claro e escuro. Persistência e detecção de
 * preferência do sistema são tratadas pelo next-themes (localStorage).
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Padrão recomendado pelo next-themes para evitar mismatch de hidratação:
  // só sabemos o tema real após montar no cliente.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground-muted transition-colors hover:border-primary hover:text-primary"
      aria-label={
        mounted
          ? isDark
            ? "Ativar tema claro"
            : "Ativar tema escuro"
          : "Alternar tema"
      }
    >
      {mounted ? (
        isDark ? (
          <Sun className="h-[18px] w-[18px]" aria-hidden="true" />
        ) : (
          <Moon className="h-[18px] w-[18px]" aria-hidden="true" />
        )
      ) : (
        <span className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
