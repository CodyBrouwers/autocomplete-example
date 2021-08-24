import { useEffect } from "react";
import { GeistProvider, CssBaseline } from "@geist-ui/react";
import { AppProps } from "next/app";
import { Header } from "@components";
import { useStateWithCallback } from "@hooks";

// == Types ================================================================

enum Theme {
  LIGHT = "light",
  DARK = "dark",
}

// == Constants ============================================================

const DEFAULT_THEME = Theme.DARK;

// == Component ============================================================

export default function MyApp({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useStateWithCallback(DEFAULT_THEME, (updatedTheme) => {
    window.localStorage.setItem("theme", updatedTheme);
  });

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    if (!savedTheme) return;

    setTheme(savedTheme as Theme);
  }, [setTheme]);

  return (
    <GeistProvider themeType={theme}>
      <CssBaseline />
      <Header setTheme={setTheme} theme={theme} />
      <Component {...pageProps} />
    </GeistProvider>
  );
}

// == Styles ===============================================================
