import { createTheme } from '@mui/material';
import { componentsOverrides } from './overrides';
import { createPalette } from './palette';

export const theme = createTheme();

theme.palette = createPalette(theme);
theme.components = componentsOverrides(theme)
