import { Theme } from '@mui/material';

export const Input = (theme: Theme) => {
  return {
    MuiInputBase: {
      styleOverrides: {
        input: {
          boxSizing: 'content-box!important' as any,
          backgroundColor: 'white',
          borderRadius: '0px 20px 20px 0px',
          paddingLeft: '10px !important'
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
