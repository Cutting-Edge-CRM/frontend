import { Theme } from '@mui/material';

export const Input = (theme: Theme) => {
  return {
    MuiInputBase: {
      styleOverrides: {
        input: {
          boxSizing: 'content-box!important' as any,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
        },
      },
    },
  };
};
