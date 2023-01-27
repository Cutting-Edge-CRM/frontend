import { Theme } from '@mui/material';

export const Dialog = (theme: Theme) => {
  return {
    MuiDialog: {
      styleOverrides: {
        paper: {
          '&.MuiPaper-rounded': {
            borderRadius: '15px',
          },
          '&.MuiDialog-paperFullScreen': {
            borderRadius: 0,
          },
        },
        paperFullWidth: {
          width: '100%',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3.5, 3, 2),
          fontSize: '18px',
          fontWeight: 600,
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          borderTop: 0,
          borderBottom: 0,
          padding: theme.spacing(3),
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: theme.spacing(0, 3, 4),
          display: 'flex',
          justifyContent: 'center',
          gap: theme.spacing(3),
        },
      },
    },
  };
};
