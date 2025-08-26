import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Card, ThemeToggle } from '../components';

const SettingsScreen: React.FC = () => {
  const { currentTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text 
            style={[
              styles.headerTitle,
              {
                color: currentTheme.colors.text,
                ...currentTheme.typography.textStyles.largeTitle,
              }
            ]}
          >
            Configurações
          </Text>
        </View>

        <Card>
          <ThemeToggle />
        </Card>

        <Card>
          <View style={styles.appInfo}>
            <Text 
              style={[
                styles.appInfoTitle,
                {
                  color: currentTheme.colors.text,
                  ...currentTheme.typography.textStyles.headline,
                }
              ]}
            >
              Sobre o App
            </Text>
            
            <View style={styles.infoRow}>
              <Text 
                style={[
                  styles.infoLabel,
                  {
                    color: currentTheme.colors.textSecondary,
                    ...currentTheme.typography.textStyles.subhead,
                  }
                ]}
              >
                Versão:
              </Text>
              <Text 
                style={[
                  styles.infoValue,
                  {
                    color: currentTheme.colors.text,
                    ...currentTheme.typography.textStyles.subhead,
                  }
                ]}
              >
                1.0.0
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text 
                style={[
                  styles.infoLabel,
                  {
                    color: currentTheme.colors.textSecondary,
                    ...currentTheme.typography.textStyles.subhead,
                  }
                ]}
              >
                Desenvolvido com:
              </Text>
              <Text 
                style={[
                  styles.infoValue,
                  {
                    color: currentTheme.colors.text,
                    ...currentTheme.typography.textStyles.subhead,
                  }
                ]}
              >
                React Native & Expo
              </Text>
            </View>

            <Text 
              style={[
                styles.description,
                {
                  color: currentTheme.colors.textSecondary,
                  ...currentTheme.typography.textStyles.footnote,
                }
              ]}
            >
              Aplicativo para cálculo e gestão de custos e preços de venda, 
              desenvolvido com design minimalista inspirado no estilo Apple.
            </Text>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    marginBottom: 4,
  },
  appInfo: {
    padding: 16,
  },
  appInfoTitle: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    flex: 1,
  },
  infoValue: {
    fontWeight: '500',
  },
  description: {
    marginTop: 16,
    lineHeight: 18,
  },
});

export default SettingsScreen;