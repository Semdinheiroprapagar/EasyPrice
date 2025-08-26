import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { ThemeProvider } from '../src/theme';

export default function RootLayout() {
  const scheme = useColorScheme();
  return (
    <ThemeProvider scheme={scheme === 'dark' ? 'dark' : 'light'}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="calculo/[id]" options={{ title: 'Detalhe do Cálculo' }} />
      </Stack>
    </ThemeProvider>
  );
}

