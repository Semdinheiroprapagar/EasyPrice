import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('@user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      // Simulação de login - em produção, fazer chamada à API
      if (email && password) {
        const userData = {
          id: '1',
          email,
          name: email.split('@')[0],
        };
        await AsyncStorage.setItem('@user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }
      return { success: false, error: 'Email e senha são obrigatórios' };
    } catch (error) {
      return { success: false, error: 'Erro ao fazer login' };
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Configuração OAuth do Google - em produção, usar suas credenciais
      const result = { type: 'success', user: { email: 'user@gmail.com', name: 'Google User' } };
      
      if (result.type === 'success') {
        const userData = {
          id: '2',
          email: result.user.email,
          name: result.user.name,
        };
        await AsyncStorage.setItem('@user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }
      return { success: false, error: 'Login cancelado' };
    } catch (error) {
      return { success: false, error: 'Erro ao fazer login com Google' };
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('@user');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signInWithGoogle,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};