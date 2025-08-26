import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { Product, AdditionalCost } from '../../types/product';

export default function AddProductScreen() {
  const { user } = useAuth();
  const [productName, setProductName] = useState('');
  const [baseCost, setBaseCost] = useState('');
  const [taxPercentage, setTaxPercentage] = useState('18');
  const [profitMargin, setProfitMargin] = useState('25');
  const [profitType, setProfitType] = useState<'percentage' | 'fixed'>('percentage');
  const [additionalCosts, setAdditionalCosts] = useState<AdditionalCost[]>([]);
  const [showAdditionalCosts, setShowAdditionalCosts] = useState(false);

  // Estados para custos adicionais
  const [newCostDescription, setNewCostDescription] = useState('');
  const [newCostValue, setNewCostValue] = useState('');

  // Cálculos em tempo real
  const [calculations, setCalculations] = useState({
    basePrice: 0,
    profitValue: 0,
    profitPercentage: 0,
    priceBeforeTax: 0,
    taxValue: 0,
    finalPrice: 0
  });

  useEffect(() => {
    calculatePrices();
  }, [baseCost, taxPercentage, profitMargin, profitType, additionalCosts]);

  const calculatePrices = () => {
    const base = parseFloat(baseCost) || 0;
    const tax = parseFloat(taxPercentage) || 0;
    const profit = parseFloat(profitMargin) || 0;
    const additionalTotal = additionalCosts.reduce((sum, cost) => sum + cost.value, 0);

    let basePrice = base + additionalTotal;
    let profitValue = 0;
    let priceBeforeTax = 0;
    let taxValue = 0;
    let finalPrice = 0;

    if (profitType === 'percentage') {
      profitValue = (basePrice * profit) / 100;
      priceBeforeTax = basePrice + profitValue;
      taxValue = (priceBeforeTax * tax) / 100;
      finalPrice = priceBeforeTax + taxValue;
    } else {
      profitValue = profit;
      priceBeforeTax = basePrice + profitValue;
      taxValue = (priceBeforeTax * tax) / 100;
      finalPrice = priceBeforeTax + taxValue;
    }

    setCalculations({
      basePrice,
      profitValue,
      profitPercentage: profitType === 'percentage' ? profit : (profitValue / basePrice) * 100,
      priceBeforeTax,
      taxValue,
      finalPrice
    });
  };

  const addAdditionalCost = () => {
    if (!newCostDescription || !newCostValue) {
      Alert.alert('Erro', 'Preencha todos os campos do custo adicional');
      return;
    }

    const value = parseFloat(newCostValue);
    if (isNaN(value) || value <= 0) {
      Alert.alert('Erro', 'Valor deve ser um número positivo');
      return;
    }

    const newCost: AdditionalCost = {
      id: Date.now().toString(),
      description: newCostDescription,
      value
    };

    setAdditionalCosts(prev => [...prev, newCost]);
    setNewCostDescription('');
    setNewCostValue('');
  };

  const removeAdditionalCost = (id: string) => {
    setAdditionalCosts(prev => prev.filter(cost => cost.id !== id));
  };

  const handleSaveProduct = () => {
    if (!productName || !baseCost) {
      Alert.alert('Erro', 'Preencha o nome e custo do produto');
      return;
    }

    const base = parseFloat(baseCost);
    if (isNaN(base) || base <= 0) {
      Alert.alert('Erro', 'Custo deve ser um número positivo');
      return;
    }

    // Aqui você salvaria o produto no banco de dados
    Alert.alert(
      'Sucesso',
      'Produto salvo com sucesso!',
      [{ text: 'OK' }]
    );

    // Limpar formulário
    setProductName('');
    setBaseCost('');
    setTaxPercentage('18');
    setProfitMargin('25');
    setProfitType('percentage');
    setAdditionalCosts([]);
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Novo Produto</Text>
            <Text style={styles.subtitle}>Configure os custos e preços</Text>
          </View>

          {/* Informações Básicas */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Informações do Produto</Text>
            
            <View style={styles.inputContainer}>
              <Ionicons name="cube-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nome do Produto"
                placeholderTextColor="#8E8E93"
                value={productName}
                onChangeText={setProductName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="cash-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Custo Base (R$)"
                placeholderTextColor="#8E8E93"
                value={baseCost}
                onChangeText={setBaseCost}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="calculator-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Imposto (%)"
                placeholderTextColor="#8E8E93"
                value={taxPercentage}
                onChangeText={setTaxPercentage}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Margem de Lucro */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Margem de Lucro</Text>
            
            <View style={styles.profitTypeContainer}>
              <Text style={styles.profitTypeLabel}>Tipo de margem:</Text>
              <View style={styles.switchContainer}>
                <Text style={profitType === 'percentage' ? styles.switchLabelActive : styles.switchLabel}>
                  Percentual
                </Text>
                <Switch
                  value={profitType === 'fixed'}
                  onValueChange={(value) => setProfitType(value ? 'fixed' : 'percentage')}
                  trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                  thumbColor="white"
                />
                <Text style={profitType === 'fixed' ? styles.switchLabelActive : styles.switchLabel}>
                  Valor Fixo
                </Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons 
                name={profitType === 'percentage' ? 'percent-outline' : 'cash-outline'} 
                size={20} 
                color="#8E8E93" 
                style={styles.inputIcon} 
              />
              <TextInput
                style={styles.input}
                placeholder={profitType === 'percentage' ? 'Margem (%)' : 'Margem (R$)'}
                placeholderTextColor="#8E8E93"
                value={profitMargin}
                onChangeText={setProfitMargin}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Custos Adicionais */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Custos Adicionais</Text>
            
            {additionalCosts.map((cost) => (
              <View key={cost.id} style={styles.additionalCostItem}>
                <View style={styles.costInfo}>
                  <Text style={styles.costDescription}>{cost.description}</Text>
                  <Text style={styles.costValue}>{formatCurrency(cost.value)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.removeCostButton}
                  onPress={() => removeAdditionalCost(cost.id)}
                >
                  <Ionicons name="close-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}

            {showAdditionalCosts && (
              <View style={styles.addCostForm}>
                <View style={styles.inputRow}>
                  <View style={[styles.inputContainer, styles.flex1]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Descrição"
                      placeholderTextColor="#8E8E93"
                      value={newCostDescription}
                      onChangeText={setNewCostDescription}
                    />
                  </View>
                  <View style={[styles.inputContainer, styles.flex1]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Valor (R$)"
                      placeholderTextColor="#8E8E93"
                      value={newCostValue}
                      onChangeText={setNewCostValue}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <View style={styles.addCostActions}>
                  <TouchableOpacity
                    style={styles.addCostButton}
                    onPress={addAdditionalCost}
                  >
                    <Text style={styles.addCostButtonText}>Adicionar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelAddButton}
                    onPress={() => setShowAdditionalCosts(false)}
                  >
                    <Text style={styles.cancelAddButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {!showAdditionalCosts && (
              <TouchableOpacity
                style={styles.addCostsButton}
                onPress={() => setShowAdditionalCosts(true)}
              >
                <Ionicons name="add" size={20} color="#007AFF" />
                <Text style={styles.addCostsButtonText}>Adicionar Custos</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Resumo do Cálculo */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Resumo do Cálculo</Text>
            
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Preço base:</Text>
              <Text style={styles.calculationValue}>{formatCurrency(calculations.basePrice)}</Text>
            </View>
            
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Lucro ({calculations.profitPercentage.toFixed(1)}%):</Text>
              <Text style={styles.calculationValue}>{formatCurrency(calculations.profitValue)}</Text>
            </View>
            
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Preço antes do imposto:</Text>
              <Text style={styles.calculationValue}>{formatCurrency(calculations.priceBeforeTax)}</Text>
            </View>
            
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Imposto ({taxPercentage}%):</Text>
              <Text style={styles.calculationValue}>{formatCurrency(calculations.taxValue)}</Text>
            </View>
            
            <View style={styles.finalPriceRow}>
              <Text style={styles.finalPriceLabel}>Preço Final:</Text>
              <Text style={styles.finalPriceValue}>{formatCurrency(calculations.finalPrice)}</Text>
            </View>
          </View>

          {/* Botão Salvar */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveProduct}
          >
            <Text style={styles.saveButtonText}>Salvar Produto</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
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
  card: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
  },
  flex1: {
    flex: 1,
  },
  profitTypeContainer: {
    marginBottom: 16,
  },
  profitTypeLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  switchLabelActive: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  additionalCostItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  costInfo: {
    flex: 1,
  },
  costDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  costValue: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  removeCostButton: {
    marginLeft: 12,
  },
  addCostsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 12,
    borderDashPattern: [5, 5],
  },
  addCostsButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  addCostForm: {
    marginTop: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  addCostActions: {
    flexDirection: 'row',
    gap: 12,
  },
  addCostButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addCostButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelAddButton: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelAddButtonText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '500',
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  calculationLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  calculationValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  finalPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#007AFF',
  },
  finalPriceLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  finalPriceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});