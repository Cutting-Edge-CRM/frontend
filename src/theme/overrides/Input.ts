import { Theme } from '@mui/material';

export const Input = (theme: Theme) => {
  return {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
        },
      },
    },
  };
};
