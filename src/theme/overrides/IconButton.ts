import { ComponentsPropsList, Theme } from '@mui/material';

export const IconButton = (theme: Theme) => {
  return {
    MuiIconButton: {
      styleOverrides: {
        root: ({
          ownerState,
        }: {
          ownerState: ComponentsPropsList[keyof ComponentsPropsList] &
            Record<string, unknown>;
        }) => {
          return {
            borderRadius: '8px',
            ...(ownerState.color === 'info' && {
              '& .MuiSvgIcon-root': {
                color: theme.palette.primary.main,
              },
              backgroundColor: theme.palette.info.main,
              '&:hover': {
                backgroundColor: theme.palette.info.light,
              },
            }),
          };
        },
      },
    },
  };
};
