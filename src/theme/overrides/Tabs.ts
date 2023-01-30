import { Theme } from '@mui/material';

export const Tabs = (theme: Theme) => {
  return {
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          textTransform: 'none' as any,
        },
      },
    },
  };
};
