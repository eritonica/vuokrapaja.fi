
import { createTheme } from '@mui/material/styles';

/**
 * Represents the custom MUI theme for the application.
 * @constant
 * @type {import('@mui/material/styles').Theme}
 * @property {string} mode - The mode of the theme ('dark' or 'light').
 * @property {Object} palette - The color palette for the theme.
 * @property {Object} palette.primary - The primary color variants.
 * @property {string} palette.primary.light - The light shade of the primary color.
 * @property {string} palette.primary.main - The main shade of the primary color.
 * @property {string} palette.primary.dark - The dark shade of the primary color.
 * @property {Object} palette.secondary - The secondary color variants.
 * @property {string} palette.secondary.light - The light shade of the secondary color.
 * @property {string} palette.secondary.main - The main shade of the secondary color.
 * @property {string} palette.secondary.dark - The dark shade of the secondary color.
 * @property {Object} palette.error - The error color variants.
 * @property {string} palette.error.light - The light shade of the error color.
 * @property {string} palette.error.main - The main shade of the error color.
 * @property {string} palette.error.dark - The dark shade of the error color.
 * @property {Object} palette.warning - The warning color variants.
 * @property {string} palette.warning.light - The light shade of the warning color.
 * @property {string} palette.warning.main - The main shade of the warning color.
 * @property {string} palette.warning.dark - The dark shade of the warning color.
 * @property {Object} palette.info - The info color variants.
 * @property {string} palette.info.light - The light shade of the info color.
 * @property {string} palette.info.main - The main shade of the info color.
 * @property {string} palette.info.dark - The dark shade of the info color.
 * @property {Object} palette.success - The success color variants.
 * @property {string} palette.success.light - The light shade of the success color.
 * @property {string} palette.success.main - The main shade of the success color.
 * @property {string} palette.success.dark - The dark shade of the success color.
 * @property {Object} typography - The typography settings for the theme.
 * @property {string} typography.fontFamily - The font family to be used in the theme.
 * @property {number} spacing - The spacing unit used in the theme.
 * @property {Object} breakpoints - The breakpoints used in the theme.
 * @property {Object} breakpoints.values - The breakpoint values for different screen sizes.
 * @property {number} breakpoints.values.xs - The value of the 'xs' breakpoint.
 * @property {number} breakpoints.values.sm - The value of the 'sm' breakpoint.
 * @property {number} breakpoints.values.md - The value of the 'md' breakpoint.
 * @property {number} breakpoints.values.lg - The value of the 'lg' breakpoint.
 * @property {number} breakpoints.values.xl - The value of the 'xl' breakpoint.
 */
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