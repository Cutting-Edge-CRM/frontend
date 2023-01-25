import { ComponentsPropsList, Theme } from '@mui/material'

export const Button = (theme: Theme) => {
    return {
        MuiButton: {
          styleOverrides: {
            root: ({ ownerState }: { ownerState: ComponentsPropsList[keyof ComponentsPropsList] & Record<string, unknown> }) => {
                return {
                    borderRadius: '10px',
                    textTransform: 'none' as any,
                    fontWeight: 600,
                    fontSize: '14px',
                    lineHeight: '21px',
                    minHeight: '44px',
                    padding: '12.5px 23px',
                    ...(ownerState.variant === 'contained' &&
                    ownerState.color === 'primary' && {
                      backgroundColor: theme.palette.primary.main,
                      color: '#fff',
                    }),
                }
            },
          },
        },
      }
}