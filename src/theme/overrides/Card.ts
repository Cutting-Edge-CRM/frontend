import { Theme, TypographyProps } from '@mui/material';

export const Card = (theme: Theme) => {
  return {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '15px',
          padding: `0px ${theme.spacing(2.5)}`,
          boxShadow: 'none'
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: {
          variant: 'h6',
          fontWeight: 600,
        } as TypographyProps,
        subheaderTypographyProps: { variant: 'body2' } as TypographyProps,
      },
      styleOverrides: {
        root: {
          padding: theme.spacing(2.5, 0, 2.5, 0),
        },
      },
    },
  };
};
