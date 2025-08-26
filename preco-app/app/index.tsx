import React, { useState } from 'react';
import { Link, router } from 'expo-router';
import { Image, View, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../src/theme';
import { ThemedTextField } from '../src/ui/TextField';
import { PrimaryButton, GoogleButton } from '../src/ui/Button';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function onLogin() {
    if (!email || !password) {
      setError('Preencha e-mail e senha.');
      return;
    }
    setError(null);
    router.replace('/(tabs)/cadastro');
  }

  function onGoogle() {
    Alert.alert('Google OAuth', 'Placeholder de autenticação com Google. Configure os Client IDs no README.');
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={[theme.colors.background, theme.colors.surface]} style={styles.container}>
        <View style={styles.logoWrap}>
          <View style={[styles.logo, { backgroundColor: theme.colors.card, shadowColor: theme.colors.shadow }]} />
          <Text style={[styles.title, { color: theme.colors.text }]}>Preço</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Cálculo e Gestão</Text>
        </View>
        <View style={styles.form}>
          <ThemedTextField placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <ThemedTextField placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
          {error ? <Text style={[styles.error, { color: theme.colors.danger }]}>{error}</Text> : null}
          <PrimaryButton label="Entrar" onPress={onLogin} />
          <GoogleButton label="Entrar com Google" onPress={onGoogle} />
          <View style={styles.linksRow}>
            <TouchableOpacity onPress={() => Alert.alert('Criar conta', 'Placeholder')}> 
              <Text style={[styles.link, { color: theme.colors.accent }]}>Criar conta</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert('Esqueci minha senha', 'Placeholder')}>
              <Text style={[styles.link, { color: theme.colors.accent }]}>Esqueci minha senha</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  logoWrap: { alignItems: 'center', marginBottom: 24 },
  logo: { width: 72, height: 72, borderRadius: 20, marginBottom: 12, shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 8 } },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 14 },
  form: { width: '100%', gap: 12 },
  error: { fontSize: 13, marginTop: -4, marginBottom: 6 },
  linksRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  link: { fontSize: 14, fontWeight: '600' }
});

