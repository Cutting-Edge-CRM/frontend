import { Theme } from '@mui/material';
import { Button } from './Button';
import { Card } from './Card';
import { DataGrid } from './DataGrid';
import { IconButton } from './IconButton';
import { Input } from './Input';
import { Tabs } from './Tabs';

export const componentsOverrides = (theme: Theme) => {
  return {
    ...theme.components,
    ...Button(theme),
    ...Input(theme),
    ...Card(theme),
    ...Tabs(theme),
    ...DataGrid(theme),
    ...IconButton(theme),
  };
};
