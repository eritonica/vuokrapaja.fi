
import { createTheme } from '@mui/material/styles';

const appTheme = createTheme({
  mode: 'dark',
  palette: {
    primary: {
      light: '#1d6873',
      main: '#1a6570',
      dark: '#1565c0',
    },
    secondary: {
      light: '#ba68c8',
      main: '#15484f',
      dark: '#7b1fa2',
    },
    error: {
      light: '#ef5350',
      main: '#d32f2f',
      dark: '#c62828',
    },
    warning: {
      light: '#ff9800',
      main: '#ed6c02',
      dark: '#e65100',
    },
    info: {
      light: '#03a9f4',
      main: '#0288d1',
      dark: '#01579b',
    },
    success: {
      light: '#4caf50',
      main: '#2e7d32',
      dark: '#1b5e20',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'sans-serif',
    ].join(','),
  },
  spacing: 8,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default appTheme;