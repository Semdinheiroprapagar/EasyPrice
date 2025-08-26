import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, GestureResponderEvent, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

type ButtonProps = {
  label: string;
  onPress?: (e: GestureResponderEvent) => void;
  style?: ViewStyle;
};

export function PrimaryButton({ label, onPress, style }: ButtonProps) {
  const theme = useTheme();
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={style}>
      <LinearGradient
        colors={[theme.colors.accent, '#8BB7FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.button, { shadowColor: theme.colors.shadow }]}
      >
        <Text style={[styles.label, { color: '#fff' }]}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export function SubtleButton({ label, onPress, style }: ButtonProps) {
  const theme = useTheme();
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.subtle, { backgroundColor: theme.colors.surface }, style]}>
      <Text style={[styles.subtleLabel, { color: theme.colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function GoogleButton({ label, onPress, style }: ButtonProps) {
  const theme = useTheme();
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={style}>
      <View style={[styles.button, { backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.border, shadowColor: theme.colors.shadow, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}> 
        <Ionicons name="logo-google" size={18} color={theme.colors.text} style={{ marginRight: 8 }} />
        <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.15,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 }
  },
  label: { fontSize: 16, fontWeight: '700' },
  subtle: { paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
  subtleLabel: { fontSize: 15, fontWeight: '600' }
});

