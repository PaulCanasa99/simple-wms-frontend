import { createTheme } from '@mui/material/styles';
import { esES as coreEsES, enUS as coreEnUS } from '@mui/material/locale';
import { esES as gridEsES, enUS as gridEnUS } from '@mui/x-data-grid/locales';

declare module '@mui/material/styles' {
  interface Palette {
    white: string;
    black: string;
    success: Palette['primary'];
  }
  interface PaletteOptions {
    white?: string;
    black?: string;
  }
}

export const buildTheme = (lang: 'es' | 'en') =>
  createTheme(
    {
      typography: {
        fontFamily: "'Montserrat', sans-serif",
        h4: { fontSize: 24, color: '#FFFFFF', fontWeight: 600 },
        h5: { fontSize: 18, color: '#FFFFFF', fontWeight: 500 },
        body1: { fontSize: 18, color: '#353535' },
        body2: { fontSize: 18 },
        button: { fontWeight: 400, textTransform: 'none', fontSize: 16 },
      },
      palette: {
        primary: { main: '#214D5B', light: '#4C7EA4' },
        secondary: { main: '#284B63', light: '#C3E8F8' },
        white: '#ffffff',
        black: '#000000',
      },
      shape: { borderRadius: 5 },
    },
    lang === 'es' ? gridEsES : gridEnUS,
    lang === 'es' ? coreEsES : coreEnUS,
  );
