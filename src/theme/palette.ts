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
    red: {
      main: '#FFC1E5',
      dark: '#DA001A',
      light: '',
      contrastText: '',
    },
    blue: {
      main: '#CCF3FF',
      dark: '#0C8BE7',
      light: '',
      contrastText: '',
    },
    yellow: {
      main: '#FFF3DC',
      dark: '#FFCE73',
      light: '',
      contrastText: '',
    },
    green: {
      main: '#E0FFEF',
      dark: '#00AC4F',
      light: '',
      contrastText: '',
    },
    gray: {
      main: '#E6E8F0',
      dark: '#44444F',
      light: '',
      contrastText: '',
    },
    purple: {
      main: '#BBBAFBE0',
      dark: '#403DFC',
      light: '',
      contrastText: '',
    },
    default: {
      light: '#F3F5F8',
      main: '#3D5F75',
      dark: '#44444F',
      contrastText: '#fff',
    },
  };
};
