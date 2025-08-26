export const lightTheme = {
  primary: '#007AFF', // iOS Blue
  primarySoft: '#E3F2FD',
  secondary: '#FF9500', // iOS Orange
  secondarySoft: '#FFF3E0',
  accent: '#34C759', // iOS Green
  background: '#FFFFFF',
  surface: '#F8F9FA',
  card: '#FFFFFF',
  text: '#000000',
  textSecondary: '#6C6C70',
  textTertiary: '#8E8E93',
  border: '#E5E5EA',
  divider: '#F2F2F7',
  error: '#FF3B30',
  warning: '#FF9500',
  success: '#34C759',
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowStrong: 'rgba(0, 0, 0, 0.15)',
  overlay: 'rgba(0, 0, 0, 0.4)',
};

export const darkTheme = {
  primary: '#0A84FF', // iOS Blue Dark
  primarySoft: '#1C1C1E',
  secondary: '#FF9F0A', // iOS Orange Dark
  secondarySoft: '#2C2C2E',
  accent: '#30D158', // iOS Green Dark
  background: '#000000',
  surface: '#1C1C1E',
  card: '#2C2C2E',
  text: '#FFFFFF',
  textSecondary: '#EBEBF5',
  textTertiary: '#8E8E93',
  border: '#38383A',
  divider: '#38383A',
  error: '#FF453A',
  warning: '#FF9F0A',
  success: '#30D158',
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowStrong: 'rgba(0, 0, 0, 0.5)',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

export type Theme = typeof lightTheme;