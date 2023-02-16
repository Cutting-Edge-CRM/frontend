import { createTheme } from '@mui/material';
import { componentsOverrides } from './overrides';
import { createPalette } from './palette';

export function getChipColor(status: string) {
  switch (status) {
    case 'Lead':
      return 'purple'
    case 'Pending':
      return 'yellow'
    case 'Awaiting Payment':
      return 'yellow'
    case 'Approved':
      return 'green'
    case 'Active':
      return 'green'
    case 'Paid':
      return 'green'
    case 'Rejected':
      return 'red' 
    case 'Bad Debt':
      return 'red'
    case 'Past Client':
      return 'blue' 
    case 'Converted':
      return 'blue'
    case 'Complete':
      return 'blue'
    case 'Archived':
      return 'gray'
    case 'Draft':
      return 'gray'
    case 'Imported':
      return 'gray'
    default:
      return 'gray'
  }
}

export function getEventColor(type: string) {
  switch (type) {
    case "Job":
      return '#E0FFEF';
    case "Estimate":
      return '#BBBAFBE0';
    case "Task":
      return '#CCF3FF';
    case "Reminder":
      return '#FFC1E5';
  }
}

export function getBorderColor(type: string) {
  switch (type) {
    case "Job":
      return '#00AC4F';
    case "Estimate":
      return '#403DFC';
    case "Task":
      return '#0C8BE7';
    case "Reminder":
      return '#DA001A';
  }
}

declare module '@mui/material/styles' {

  interface Palette {
    neutral: Palette['primary'];
    red: Palette['primary'];
    blue: Palette['primary'];
    yellow: Palette['primary'];
    green: Palette['primary'];
    gray: Palette['primary'];
    purple: Palette['primary'];
    backgroundColor: Palette['primary'];
  }

  interface PaletteOptions {
    neutral: Palette['primary'];
    red: Palette['primary'];
    blue: Palette['primary'];
    yellow: Palette['primary'];
    green: Palette['primary'];
    gray: Palette['primary'];
    purple: Palette['primary'];
    backgroundColor: Palette['primary'];
  }
}

export const theme = createTheme({
  typography: {
    fontFamily: [
      'Poppins',
      'sans-serif'
    ].join(',')
  }
});

theme.palette = createPalette(theme);
theme.components = componentsOverrides(theme);
