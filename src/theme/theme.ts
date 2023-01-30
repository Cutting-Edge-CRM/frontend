import { createTheme } from '@mui/material';
import { componentsOverrides } from './overrides';
import { createPalette } from './palette';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: React.CSSProperties['color'];
    };
  }

  interface Palette {
    neutral: Palette['primary'];
  }

  interface PaletteOptions {
    neutral: PaletteOptions['primary'];
  }

  interface PaletteColor {
    darker?: string;
  }

  interface SimplePaletteColorOptions {
    darker?: string;
  }

  interface ThemeOptions {
    status: {
      danger: React.CSSProperties['color'];
    };
  }
}

export const theme = createTheme();

theme.palette = createPalette(theme);
theme.components = componentsOverrides(theme);