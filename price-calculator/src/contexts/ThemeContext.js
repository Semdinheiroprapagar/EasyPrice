import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext({});

export const useTheme = () => useContext(ThemeContext);

export const themes = {
  light: {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    card: '#FFFFFF',
    primary: '#007AFF',
    secondary: '#FF9500',
    text: '#000000',
    textSecondary: '#6C757D',
    border: '#E5E5EA',
    error: '#FF3B30',
    success: '#34C759',
    shadow: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
  },
  dark: {
    background: '#000000',
    surface: '#1C1C1E',
    card: '#2C2C2E',
    primary: '#0A84FF',
    secondary: '#FF9F0A',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#38383A',
    error: '#FF453A',
    success: '#32D74B',
    shadow: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
  },
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [theme, setTheme] = useState(isDarkMode ? themes.dark : themes.light);

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    setTheme(isDarkMode ? themes.dark : themes.light);
    saveThemePreference(isDarkMode);
  }, [isDarkMode]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@theme');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const saveThemePreference = async (isDark) => {
    try {
      await AsyncStorage.setItem('@theme', isDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      isDarkMode,
      toggleTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};