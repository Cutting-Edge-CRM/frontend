import { Theme } from '@mui/material';

export const Chip = (theme: Theme) => {
  return {
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: '5px',
          minWidth: '99px',
        },
        colorPrimary: {
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.primary.main,
        },
        colorWarning: {
          backgroundColor: theme.palette.warning.main,
          color: theme.palette.warning.dark,
        },
        colorError: {
          backgroundColor: theme.palette.error.light,
          color: theme.palette.error.main,
        },
        colorSuccess: {
          backgroundColor: theme.palette.success.light,
          color: theme.palette.success.main,
        },
        colorDefault: {
          backgroundColor: theme.palette.neutral.light,
          color: theme.palette.neutral.dark,
        },
      },
    },
  };
};
