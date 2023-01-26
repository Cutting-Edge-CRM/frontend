import { Theme } from '@mui/material';

export const createPalette = (theme: Theme) => {
  return {
    ...theme.palette,
    primary: {
      ...theme.palette.primary,
      main: '#0C8BE7',
    },
    text: {
      ...theme.palette.text,
      primary: '#202020',
    },
    info: {
      ...theme.palette.info,
      main: 'rgba(12, 139, 231, 0.4)',
      light: '#E7F0FF',
    },
    warning: {
      ...theme.palette.warning,
      light: '#FFF5E1',
    },
    neutral: {
      main: '#5F666F',
      light: '#B5B7C0',
      dark: '#202020',
      contrastText: '#fff',
    },
  };
};
