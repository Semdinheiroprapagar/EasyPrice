import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof spacingValues;
  margin?: keyof typeof spacingValues;
  shadow?: boolean;
}

const spacingValues = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  padding = 'md',
  margin = 'sm',
  shadow = true 
}) => {
  const { currentTheme } = useTheme();

  return (
    <View 
      style={[
        styles.card,
        {
          backgroundColor: currentTheme.colors.card,
          padding: spacingValues[padding],
          margin: spacingValues[margin],
          borderColor: currentTheme.colors.border,
          ...(shadow && {
            ...currentTheme.shadows.md,
            shadowColor: currentTheme.colors.shadow,
          }),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
});