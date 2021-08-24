import { Grid } from "@geist-ui/react";
import { ThemeSwitch, TTheme } from "@components/ThemeSwitch";

// == Types ================================================================

interface IProps {
  theme: TTheme;
  setTheme: (theme: TTheme) => void;
}

// == Constants ============================================================

// == Functions ============================================================

// == Component ============================================================

export function Header({ theme, setTheme }: IProps) {
  return (
    <Grid.Container
      alignItems="center"
      justify="flex-end"
      margin={1}
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        zIndex: 8,
      }}
      width="auto"
    >
      <ThemeSwitch setTheme={setTheme} theme={theme} />
    </Grid.Container>
  );
}

// == Styles ===============================================================
