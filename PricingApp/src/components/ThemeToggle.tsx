import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { currentTheme, themeMode, setThemeMode, isDark } = useTheme();

  const themeOptions = [
    { key: 'light', label: 'Claro', icon: 'sunny' },
    { key: 'dark', label: 'Escuro', icon: 'moon' },
    { key: 'system', label: 'Sistema', icon: 'phone-portrait' },
  ] as const;

  return (
    <View style={styles.container}>
      <Text 
        style={[
          styles.title,
          {
            color: currentTheme.colors.text,
            ...currentTheme.typography.textStyles.headline,
          }
        ]}
      >
        Aparência
      </Text>
      
      <View style={styles.optionsContainer}>
        {themeOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.option,
              {
                backgroundColor: themeMode === option.key 
                  ? currentTheme.colors.primary 
                  : currentTheme.colors.surface,
                borderColor: currentTheme.colors.border,
              }
            ]}
            onPress={() => setThemeMode(option.key)}
          >
            <Ionicons
              name={option.icon}
              size={20}
              color={themeMode === option.key 
                ? '#FFFFFF' 
                : currentTheme.colors.textSecondary}
            />
            <Text
              style={[
                styles.optionText,
                {
                  color: themeMode === option.key 
                    ? '#FFFFFF' 
                    : currentTheme.colors.textSecondary,
                  ...currentTheme.typography.textStyles.subhead,
                }
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  optionText: {
    fontWeight: '500',
  },
});