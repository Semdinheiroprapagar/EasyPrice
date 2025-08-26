import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { CalculationCard, Calculation, Card, Button } from '../components';

const CalculationsScreen: React.FC = () => {
  const { currentTheme } = useTheme();
  const { calculations, isLoading } = useData();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedCalculation, setSelectedCalculation] = useState<Calculation | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // In a real app, you might refetch data from server here
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleCalculationPress = (calculation: Calculation) => {
    setSelectedCalculation(calculation);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedCalculation(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const renderCalculation = ({ item }: { item: Calculation }) => (
    <CalculationCard
      calculation={item}
      onPress={handleCalculationPress}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View 
        style={[
          styles.emptyIconContainer,
          { backgroundColor: currentTheme.colors.surface }
        ]}
      >
        <Ionicons 
          name="calculator-outline" 
          size={64} 
          color={currentTheme.colors.textTertiary} 
        />
      </View>
      
      <Text 
        style={[
          styles.emptyTitle,
          {
            color: currentTheme.colors.text,
            ...currentTheme.typography.textStyles.title3,
          }
        ]}
      >
        Nenhum cálculo realizado
      </Text>
      
      <Text 
        style={[
          styles.emptyMessage,
          {
            color: currentTheme.colors.textSecondary,
            ...currentTheme.typography.textStyles.body,
          }
        ]}
      >
        Os cálculos de preços aparecerão aqui conforme você cadastrar produtos.
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View>
          <Text 
            style={[
              styles.headerTitle,
              {
                color: currentTheme.colors.text,
                ...currentTheme.typography.textStyles.largeTitle,
              }
            ]}
          >
            Cálculos
          </Text>
          <Text 
            style={[
              styles.headerSubtitle,
              {
                color: currentTheme.colors.textSecondary,
                ...currentTheme.typography.textStyles.subhead,
              }
            ]}
          >
            Histórico de {calculations.length} cálculo{calculations.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <View 
          style={[
            styles.statsContainer,
            { backgroundColor: currentTheme.colors.primarySoft }
          ]}
        >
          <Ionicons 
            name="trending-up" 
            size={20} 
            color={currentTheme.colors.primary} 
          />
        </View>
      </View>
    </View>
  );

  const renderDetailsModal = () => {
    if (!selectedCalculation) return null;

    return (
      <Modal
        visible={showDetails}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeDetails}
      >
        <View style={[styles.modalContainer, { backgroundColor: currentTheme.colors.background }]}>
          <View style={styles.modalHeader}>
            <Text 
              style={[
                styles.modalTitle,
                {
                  color: currentTheme.colors.text,
                  ...currentTheme.typography.textStyles.title2,
                }
              ]}
            >
              Detalhes do Cálculo
            </Text>
            <Button
              title="Fechar"
              onPress={closeDetails}
              variant="ghost"
              size="small"
            />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Product Info */}
            <Card>
              <Text 
                style={[
                  styles.sectionTitle,
                  {
                    color: currentTheme.colors.text,
                    ...currentTheme.typography.textStyles.headline,
                  }
                ]}
              >
                Informações do Produto
              </Text>
              
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: currentTheme.colors.textSecondary }]}>
                  Nome:
                </Text>
                <Text style={[styles.detailValue, { color: currentTheme.colors.text }]}>
                  {selectedCalculation.productName}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: currentTheme.colors.textSecondary }]}>
                  Data do cálculo:
                </Text>
                <Text style={[styles.detailValue, { color: currentTheme.colors.text }]}>
                  {formatDate(selectedCalculation.createdAt)}
                </Text>
              </View>
            </Card>

            {/* Cost Breakdown */}
            <Card>
              <Text 
                style={[
                  styles.sectionTitle,
                  {
                    color: currentTheme.colors.text,
                    ...currentTheme.typography.textStyles.headline,
                  }
                ]}
              >
                Breakdown de Custos
              </Text>

              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: currentTheme.colors.textSecondary }]}>
                  Custo Base:
                </Text>
                <Text style={[styles.detailValue, { color: currentTheme.colors.text }]}>
                  {formatCurrency(selectedCalculation.baseCost)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: currentTheme.colors.textSecondary }]}>
                  Margem de Lucro:
                </Text>
                <Text style={[styles.detailValue, { color: currentTheme.colors.accent }]}>
                  {formatCurrency(selectedCalculation.profit)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: currentTheme.colors.textSecondary }]}>
                  Percentual de Lucro:
                </Text>
                <Text style={[styles.detailValue, { color: currentTheme.colors.accent }]}>
                  {selectedCalculation.profitPercentage.toFixed(2)}%
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: currentTheme.colors.textSecondary }]}>
                  Valor do Imposto:
                </Text>
                <Text style={[styles.detailValue, { color: currentTheme.colors.warning }]}>
                  {formatCurrency(selectedCalculation.tax)}
                </Text>
              </View>
            </Card>

            {/* Final Price */}
            <Card style={[styles.finalPriceCard, { backgroundColor: currentTheme.colors.primarySoft }]}>
              <Text 
                style={[
                  styles.finalPriceTitle,
                  {
                    color: currentTheme.colors.primary,
                    ...currentTheme.typography.textStyles.title3,
                  }
                ]}
              >
                Preço Final de Venda
              </Text>
              
              <Text 
                style={[
                  styles.finalPriceValue,
                  {
                    color: currentTheme.colors.primary,
                    ...currentTheme.typography.textStyles.largeTitle,
                  }
                ]}
              >
                {formatCurrency(selectedCalculation.finalPrice)}
              </Text>

              <View style={styles.finalPriceBreakdown}>
                <Text 
                  style={[
                    styles.breakdownText,
                    {
                      color: currentTheme.colors.textSecondary,
                      ...currentTheme.typography.textStyles.caption1,
                    }
                  ]}
                >
                  Base + Lucro + Imposto
                </Text>
                <Text 
                  style={[
                    styles.breakdownText,
                    {
                      color: currentTheme.colors.textSecondary,
                      ...currentTheme.typography.textStyles.caption1,
                    }
                  ]}
                >
                  {formatCurrency(selectedCalculation.baseCost)} + {formatCurrency(selectedCalculation.profit)} + {formatCurrency(selectedCalculation.tax)}
                </Text>
              </View>
            </Card>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: currentTheme.colors.background }]}>
        <Text 
          style={[
            styles.loadingText,
            {
              color: currentTheme.colors.textSecondary,
              ...currentTheme.typography.textStyles.body,
            }
          ]}
        >
          Carregando cálculos...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <FlatList
        data={calculations}
        renderItem={renderCalculation}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={currentTheme.colors.primary}
            colors={[currentTheme.colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={calculations.length === 0 ? styles.emptyContainer : styles.listContainer}
      />
      
      {renderDetailsModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    marginBottom: 4,
  },
  headerSubtitle: {
    opacity: 0.8,
  },
  statsContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    paddingBottom: 24,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
    paddingVertical: 64,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyMessage: {
    textAlign: 'center',
    lineHeight: 24,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    paddingTop: 8,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    flex: 1,
    fontSize: 16,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'right',
  },
  finalPriceCard: {
    alignItems: 'center',
    marginBottom: 24,
  },
  finalPriceTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  finalPriceValue: {
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 16,
  },
  finalPriceBreakdown: {
    alignItems: 'center',
    gap: 4,
  },
  breakdownText: {
    textAlign: 'center',
  },
});

export default CalculationsScreen;