import React, { createContext, useContext, useMemo } from 'react';
import { Platform, ColorSchemeName } from 'react-native';

type ColorPalette = {
  background: string;
  card: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
  danger: string;
  shadow: string;
};

export type AppTheme = {
  colors: ColorPalette;
  roundness: number;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  fonts: {
    regular: string;
    medium: string;
    bold: string;
  };
};

function buildTheme(scheme: 'light' | 'dark'): AppTheme {
  const isDark = scheme === 'dark';
  const colors: ColorPalette = {
    background: isDark ? '#0B0B0C' : '#F7F8FA',
    card: isDark ? '#141416' : '#FFFFFF',
    surface: isDark ? '#1B1C1F' : '#F1F3F6',
    text: isDark ? '#F5F7FB' : '#0F1115',
    textSecondary: isDark ? '#B3B8C5' : '#4D5562',
    border: isDark ? '#2A2C31' : '#E5E7EB',
    accent: '#5E9BFF',
    danger: '#FF6B6B',
    shadow: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(16,24,40,0.08)'
  };

  return {
    colors,
    roundness: 14,
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
    fonts: {
      regular: Platform.select({ ios: 'System', default: 'System' })!,
      medium: Platform.select({ ios: 'System', default: 'System' })!,
      bold: Platform.select({ ios: 'System', default: 'System' })!
    }
  };
}

const ThemeContext = createContext<AppTheme | null>(null);

export function ThemeProvider({ scheme, children }: { scheme: ColorSchemeName | 'light' | 'dark'; children: React.ReactNode }) {
  const resolvedScheme: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';
  const value = useMemo(() => buildTheme(resolvedScheme), [resolvedScheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): AppTheme {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

