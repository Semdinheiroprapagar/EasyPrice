import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: signOut
        }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Exportar Dados',
      'Funcionalidade em desenvolvimento',
      [{ text: 'OK' }]
    );
  };

  const handleBackupSettings = () => {
    Alert.alert(
      'Configurações de Backup',
      'Funcionalidade em desenvolvimento',
      [{ text: 'OK' }]
    );
  };

  const handlePrivacySettings = () => {
    Alert.alert(
      'Configurações de Privacidade',
      'Funcionalidade em desenvolvimento',
      [{ text: 'OK' }]
    );
  };

  const handleHelpSupport = () => {
    Alert.alert(
      'Ajuda e Suporte',
      'Funcionalidade em desenvolvimento',
      [{ text: 'OK' }]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'Sobre o EasyPrice',
      'Versão 1.0.0\n\nUm aplicativo minimalista para cálculo e gestão de custos e preços de venda.\n\nDesenvolvido com React Native e Expo.',
      [{ text: 'OK' }]
    );
  };

  const renderMenuItem = (
    icon: string,
    title: string,
    subtitle: string,
    onPress: () => void,
    showArrow: boolean = true,
    iconColor: string = '#007AFF'
  ) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuIcon, { backgroundColor: `${iconColor}20` }]}>
          <Ionicons name={icon as any} size={24} color={iconColor} />
        </View>
        <View style={styles.menuText}>
          <Text style={styles.menuTitle}>{title}</Text>
          <Text style={styles.menuSubtitle}>{subtitle}</Text>
        </View>
      </View>
      {showArrow && (
        <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header do Perfil */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color="#007AFF" />
            </View>
          </View>
          <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* Menu de Opções */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Conta</Text>
          
          {renderMenuItem(
            'person-outline',
            'Editar Perfil',
            'Alterar informações pessoais',
            () => Alert.alert('Editar Perfil', 'Funcionalidade em desenvolvimento')
          )}
          
          {renderMenuItem(
            'notifications-outline',
            'Notificações',
            'Configurar alertas e lembretes',
            () => Alert.alert('Notificações', 'Funcionalidade em desenvolvimento')
          )}
          
          {renderMenuItem(
            'shield-checkmark-outline',
            'Privacidade',
            'Configurações de segurança',
            handlePrivacySettings
          )}
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Dados</Text>
          
          {renderMenuItem(
            'download-outline',
            'Exportar Dados',
            'Baixar seus produtos e cálculos',
            handleExportData
          )}
          
          {renderMenuItem(
            'cloud-upload-outline',
            'Backup e Sincronização',
            'Configurar backup automático',
            handleBackupSettings
          )}
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Suporte</Text>
          
          {renderMenuItem(
            'help-circle-outline',
            'Ajuda e Suporte',
            'Central de ajuda e contato',
            handleHelpSupport
          )}
          
          {renderMenuItem(
            'information-circle-outline',
            'Sobre',
            'Informações do aplicativo',
            handleAbout
          )}
        </View>

        {/* Botão de Sair */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.signOutText}>Sair da Conta</Text>
        </TouchableOpacity>

        {/* Versão do App */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Versão 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#8E8E93',
  },
  menuSection: {
    backgroundColor: 'white',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F2F2F7',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  signOutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  versionText: {
    fontSize: 14,
    color: '#8E8E93',
  },
});