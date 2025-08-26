import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { Calculation } from '../../types/product';

export default function CalculationsScreen() {
  const { user } = useAuth();
  const [calculations, setCalculations] = useState<Calculation[]>([]);

  useEffect(() => {
    loadCalculations();
  }, []);

  const loadCalculations = () => {
    // Simulação de cálculos salvos
    const mockCalculations: Calculation[] = [
      {
        id: '1',
        productName: 'Smartphone XYZ',
        baseCost: 800.00,
        profitValue: 200.00,
        profitPercentage: 25.0,
        taxValue: 180.00,
        finalPrice: 1050.00,
        calculatedAt: new Date('2024-01-15T10:30:00'),
        additionalCosts: [
          { id: '1', description: 'Frete', value: 25.00 },
          { id: '2', description: 'Embalagem', value: 15.00 }
        ],
        taxPercentage: 18.0,
        profitMargin: 25.0,
        profitType: 'percentage'
      },
      {
        id: '2',
        productName: 'Notebook Pro',
        baseCost: 2500.00,
        profitValue: 750.00,
        profitPercentage: 30.0,
        taxValue: 585.00,
        finalPrice: 3315.00,
        calculatedAt: new Date('2024-01-10T14:20:00'),
        additionalCosts: [
          { id: '1', description: 'Frete', value: 50.00 }
        ],
        taxPercentage: 18.0,
        profitMargin: 30.0,
        profitType: 'percentage'
      },
      {
        id: '3',
        productName: 'Fone de Ouvido Premium',
        baseCost: 150.00,
        profitValue: 45.00,
        profitPercentage: 30.0,
        taxValue: 35.10,
        finalPrice: 230.10,
        calculatedAt: new Date('2024-01-08T09:15:00'),
        additionalCosts: [],
        taxPercentage: 18.0,
        profitMargin: 30.0,
        profitType: 'percentage'
      }
    ];
    setCalculations(mockCalculations);
  };

  const handleCalculationPress = (calculation: Calculation) => {
    showCalculationDetails(calculation);
  };

  const showCalculationDetails = (calculation: Calculation) => {
    const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;
    const formatDate = (date: Date) => date.toLocaleString('pt-BR');

    Alert.alert(
      `Detalhes: ${calculation.productName}`,
      `📅 Data: ${formatDate(calculation.calculatedAt)}\n\n` +
      `💰 Custo Base: ${formatCurrency(calculation.baseCost)}\n` +
      `📈 Lucro (${calculation.profitPercentage.toFixed(1)}%): ${formatCurrency(calculation.profitValue)}\n` +
      `💸 Preço antes do imposto: ${formatCurrency(calculation.baseCost + calculation.profitValue)}\n` +
      `🏛️ Imposto (${calculation.taxPercentage}%): ${formatCurrency(calculation.taxValue)}\n` +
      `🎯 Preço Final: ${formatCurrency(calculation.finalPrice)}\n\n` +
      `📋 Custos Adicionais: ${calculation.additionalCosts.length > 0 ? 
        calculation.additionalCosts.map(cost => `${cost.description}: ${formatCurrency(cost.value)}`).join(', ') : 
        'Nenhum'}`,
      [{ text: 'Fechar', style: 'default' }]
    );
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Hoje';
    } else if (diffDays === 2) {
      return 'Ontem';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} dia${diffDays - 1 !== 1 ? 's' : ''} atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const renderCalculationCard = ({ item }: { item: Calculation }) => (
    <TouchableOpacity
      style={styles.calculationCard}
      onPress={() => handleCalculationPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.productName}
          </Text>
          <Text style={styles.calculationDate}>
            {formatDate(item.calculatedAt)}
          </Text>
        </View>
        <View style={styles.finalPriceContainer}>
          <Text style={styles.finalPrice}>
            {formatCurrency(item.finalPrice)}
          </Text>
        </View>
      </View>

      <View style={styles.calculationDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Custo Base:</Text>
          <Text style={styles.detailValue}>{formatCurrency(item.baseCost)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Lucro ({item.profitPercentage.toFixed(1)}%):</Text>
          <Text style={styles.detailValue}>{formatCurrency(item.profitValue)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Imposto ({item.taxPercentage}%):</Text>
          <Text style={styles.detailValue}>{formatCurrency(item.taxValue)}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.additionalCostsInfo}>
          <Ionicons name="list-outline" size={16} color="#8E8E93" />
          <Text style={styles.additionalCostsText}>
            {item.additionalCosts.length} custo{item.additionalCosts.length !== 1 ? 's' : ''} adicional{item.additionalCosts.length !== 1 ? 'es' : ''}
          </Text>
        </View>
        
        <View style={styles.tapIndicator}>
          <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico de Cálculos</Text>
        <Text style={styles.subtitle}>
          {calculations.length} cálculo{calculations.length !== 1 ? 's' : ''} realizado{calculations.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {calculations.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="calculator-outline" size={64} color="#8E8E93" />
          <Text style={styles.emptyStateTitle}>Nenhum cálculo realizado</Text>
          <Text style={styles.emptyStateSubtitle}>
            Os cálculos aparecerão aqui após você salvar produtos
          </Text>
        </View>
      ) : (
        <FlatList
          data={calculations}
          renderItem={renderCalculationCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.calculationsList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  calculationsList: {
    padding: 16,
  },
  calculationCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  productInfo: {
    flex: 1,
    marginRight: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  calculationDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  finalPriceContainer: {
    alignItems: 'flex-end',
  },
  finalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
  },
  calculationDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  additionalCostsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  additionalCostsText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  tapIndicator: {
    opacity: 0.6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
  },
});