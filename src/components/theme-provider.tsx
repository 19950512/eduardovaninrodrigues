"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * Wrapper client-side do next-themes.
 * - attribute="class" alterna a classe `.dark` no elemento <html>.
 * - defaultTheme="system" respeita a preferência do sistema operacional.
 * - O script anti-flash é injetado automaticamente pelo next-themes antes
 *   da hidratação, evitando o "flash" de tema incorreto no carregamento.
 */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
