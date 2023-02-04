import { Theme } from '@mui/material';

export const Accordion = (theme: Theme) => {
  return {
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: '15px',
        },
      },
    },
  };
};
