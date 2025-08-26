export * from './colors';
export * from './typography';
export * from './spacing';

import { lightTheme, darkTheme } from './colors';
import { typography } from './typography';
import { spacing, borderRadius, shadows } from './spacing';

export const theme = {
  light: {
    colors: lightTheme,
    typography,
    spacing,
    borderRadius,
    shadows,
  },
  dark: {
    colors: darkTheme,
    typography,
    spacing,
    borderRadius,
    shadows,
  },
};

export type AppTheme = typeof theme.light;