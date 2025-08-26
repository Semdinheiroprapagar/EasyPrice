import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useTheme } from '../context/ThemeContext';
import { Input, Button, Card } from '../components';
import { RootStackParamList } from '../navigation/AppNavigator';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginScreen: React.FC = () => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any valid email/password
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      // Simulate Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao conectar com Google. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Recuperar Senha',
      'Um link de recuperação será enviado para seu email.',
      [{ text: 'OK' }]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[currentTheme.colors.background, currentTheme.colors.surface]}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View 
              style={[
                styles.logoContainer,
                { 
                  backgroundColor: currentTheme.colors.primary,
                  ...currentTheme.shadows.lg,
                  shadowColor: currentTheme.colors.shadow,
                }
              ]}
            >
              <Ionicons name="calculator" size={48} color="#FFFFFF" />
            </View>
            <Text 
              style={[
                styles.logoText,
                {
                  color: currentTheme.colors.text,
                  ...currentTheme.typography.textStyles.title1,
                }
              ]}
            >
              PricingApp
            </Text>
            <Text 
              style={[
                styles.tagline,
                {
                  color: currentTheme.colors.textSecondary,
                  ...currentTheme.typography.textStyles.subhead,
                }
              ]}
            >
              Calcule preços com precisão
            </Text>
          </View>

          {/* Form Section */}
          <Card style={styles.formCard}>
            <Text 
              style={[
                styles.formTitle,
                {
                  color: currentTheme.colors.text,
                  ...currentTheme.typography.textStyles.title2,
                }
              ]}
            >
              {isSignUp ? 'Criar Conta' : 'Entrar'}
            </Text>

            <View style={styles.form}>
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChangeText={(email) => setFormData({ ...formData, email })}
                error={errors.email}
                leftIcon="mail-outline"
                placeholder="seu@email.com"
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Input
                label="Senha"
                type="password"
                value={formData.password}
                onChangeText={(password) => setFormData({ ...formData, password })}
                error={errors.password}
                leftIcon="lock-closed-outline"
                placeholder="••••••••"
              />

              <Button
                title={isSignUp ? 'Criar Conta' : 'Entrar'}
                onPress={handleLogin}
                loading={isLoading}
                style={styles.loginButton}
              />

              <View style={styles.divider}>
                <View 
                  style={[
                    styles.dividerLine, 
                    { backgroundColor: currentTheme.colors.border }
                  ]} 
                />
                <Text 
                  style={[
                    styles.dividerText,
                    {
                      color: currentTheme.colors.textSecondary,
                      backgroundColor: currentTheme.colors.card,
                      ...currentTheme.typography.textStyles.caption1,
                    }
                  ]}
                >
                  ou
                </Text>
                <View 
                  style={[
                    styles.dividerLine, 
                    { backgroundColor: currentTheme.colors.border }
                  ]} 
                />
              </View>

              <Button
                title="Continuar com Google"
                onPress={handleGoogleLogin}
                variant="outline"
                loading={isLoading}
                icon={<Ionicons name="logo-google" size={20} color={currentTheme.colors.primary} />}
                style={styles.googleButton}
              />
            </View>
          </Card>

          {/* Footer Links */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
              <Text 
                style={[
                  styles.linkText,
                  {
                    color: currentTheme.colors.primary,
                    ...currentTheme.typography.textStyles.subhead,
                  }
                ]}
              >
                {isSignUp ? 'Já tem conta? Entrar' : 'Não tem conta? Criar'}
              </Text>
            </TouchableOpacity>

            {!isSignUp && (
              <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
                <Text 
                  style={[
                    styles.linkText,
                    {
                      color: currentTheme.colors.textSecondary,
                      ...currentTheme.typography.textStyles.footnote,
                    }
                  ]}
                >
                  Esqueci minha senha
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoText: {
    marginBottom: 8,
  },
  tagline: {
    textAlign: 'center',
  },
  formCard: {
    marginBottom: 32,
  },
  formTitle: {
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    gap: 20,
  },
  loginButton: {
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  dividerText: {
    paddingHorizontal: 16,
  },
  googleButton: {
    marginBottom: 8,
  },
  footer: {
    alignItems: 'center',
    gap: 16,
  },
  linkText: {
    textAlign: 'center',
  },
  forgotPassword: {
    marginTop: 8,
  },
});

export default LoginScreen;