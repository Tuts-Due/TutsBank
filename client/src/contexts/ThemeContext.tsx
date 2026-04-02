/**
 * CONTEXTO DE TEMA
 *
 * Gerencia tema claro/escuro usando next-themes.
 * Fornece hook useTheme para acessar tema e função de alternância.
 */

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: string;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "tutsbank-theme",
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem
      storageKey={storageKey}
      themes={["light", "dark"]}
      forcedTheme={undefined}
      enableColorScheme={false}
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}

// Re-export useTheme hook from next-themes
export { useTheme } from "next-themes";
