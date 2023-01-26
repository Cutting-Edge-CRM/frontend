import { Theme } from '@mui/material';

export const createPalette = (theme: Theme) => {
  return {
    ...theme.palette,
    primary: {
      ...theme.palette.primary,
      light: '#CCF3FF',
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
      main: '#FFF3DC',
      dark: '#FFB427',
    },
    success: {
      ...theme.palette.success,
      light: '#E0FFEF',
      main: '#00AC4F',
    },
    error: {
      ...theme.palette.error,
      main: '#DA001A',
      light: '#FFC1E5',
    },
    neutral: {
      main: '#5F666F',
      light: '#B5B7C0',
      dark: '#44444F',
      contrastText: '#fff',
    },
  };
};
