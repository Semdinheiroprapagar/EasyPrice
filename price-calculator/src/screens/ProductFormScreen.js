import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';

export default function ProductFormScreen({ navigation, route }) {
  const { theme } = useTheme();
  const { saveProduct, updateProduct, getProduct, calculatePrice } = useData();
  
  const editMode = route.params?.productId;
  const existingProduct = editMode ? getProduct(route.params.productId) : null;
  
  const [productImage, setProductImage] = useState(existingProduct?.image || null);
  const [productName, setProductName] = useState(existingProduct?.name || '');
  const [productCost, setProductCost] = useState(existingProduct?.cost?.toString() || '');
  const [taxPercentage, setTaxPercentage] = useState(existingProduct?.taxPercentage?.toString() || '');
  const [additionalCosts, setAdditionalCosts] = useState([]);
  const [profitMargin, setProfitMargin] = useState(existingProduct?.profitMargin?.toString() || '');
  const [profitType, setProfitType] = useState(existingProduct?.profitType || 'percentage');
  const [showAdditionalCosts, setShowAdditionalCosts] = useState(false);
  const [newCost, setNewCost] = useState({ name: '', value: '' });
  
  const [priceCalculation, setPriceCalculation] = useState({
    baseCost: 0,
    profit: 0,
    profitPercentage: 0,
    priceBeforeTax: 0,
    tax: 0,
    finalPrice: 0,
  });

  useEffect(() => {
    if (existingProduct?.additionalCosts) {
      setAdditionalCosts(existingProduct.additionalCosts);
      setShowAdditionalCosts(existingProduct.additionalCosts.length > 0);
    }
  }, [existingProduct]);

  useEffect(() => {
    updateCalculation();
  }, [productCost, additionalCosts, profitMargin, profitType, taxPercentage]);

  const updateCalculation = () => {
    const totalAdditional = additionalCosts.reduce((sum, cost) => sum + parseFloat(cost.value || 0), 0);
    const calculation = calculatePrice(productCost, totalAdditional, profitMargin, profitType, taxPercentage);
    setPriceCalculation(calculation);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProductImage(result.assets[0].uri);
    }
  };

  const addAdditionalCost = () => {
    if (newCost.name && newCost.value) {
      setAdditionalCosts([...additionalCosts, { ...newCost, id: Date.now().toString() }]);
      setNewCost({ name: '', value: '' });
    }
  };

  const removeAdditionalCost = (id) => {
    setAdditionalCosts(additionalCosts.filter(cost => cost.id !== id));
  };

  const handleSave = async () => {
    if (!productName || !productCost) {
      Alert.alert('Erro', 'Nome e custo do produto são obrigatórios');
      return;
    }

    const productData = {
      image: productImage,
      name: productName,
      cost: parseFloat(productCost),
      taxPercentage: parseFloat(taxPercentage || 0),
      additionalCosts,
      profitMargin: parseFloat(profitMargin || 0),
      profitType,
      ...priceCalculation,
    };

    try {
      if (editMode) {
        await updateProduct(route.params.productId, productData);
        Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
      } else {
        await saveProduct(productData);
        Alert.alert('Sucesso', 'Produto salvo com sucesso!');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar produto');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={28} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              {editMode ? 'Editar Produto' : 'Novo Produto'}
            </Text>
            <View style={{ width: 28 }} />
          </View>

          {/* Product Image */}
          <TouchableOpacity
            style={[styles.imageContainer, { backgroundColor: theme.card, ...theme.shadow }]}
            onPress={pickImage}
          >
            {productImage ? (
              <Image source={{ uri: productImage }} style={styles.productImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera" size={40} color={theme.textSecondary} />
                <Text style={[styles.imagePlaceholderText, { color: theme.textSecondary }]}>
                  Adicionar Imagem
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Form Fields */}
          <View style={[styles.card, { backgroundColor: theme.card, ...theme.shadow }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Informações Básicas</Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Nome do Produto</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text }]}
                value={productName}
                onChangeText={setProductName}
                placeholder="Ex: Camiseta Premium"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Custo do Produto (R$)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text }]}
                value={productCost}
                onChangeText={setProductCost}
                placeholder="0,00"
                placeholderTextColor={theme.textSecondary}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Imposto (%)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text }]}
                value={taxPercentage}
                onChangeText={setTaxPercentage}
                placeholder="0"
                placeholderTextColor={theme.textSecondary}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          {/* Additional Costs */}
          <View style={[styles.card, { backgroundColor: theme.card, ...theme.shadow }]}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => setShowAdditionalCosts(!showAdditionalCosts)}
            >
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Custos Adicionais</Text>
              <Ionicons
                name={showAdditionalCosts ? "chevron-up" : "chevron-down"}
                size={24}
                color={theme.text}
              />
            </TouchableOpacity>

            {showAdditionalCosts && (
              <View>
                {additionalCosts.map((cost) => (
                  <View key={cost.id} style={[styles.costItem, { backgroundColor: theme.surface }]}>
                    <View style={styles.costInfo}>
                      <Text style={[styles.costName, { color: theme.text }]}>{cost.name}</Text>
                      <Text style={[styles.costValue, { color: theme.primary }]}>
                        R$ {parseFloat(cost.value).toFixed(2)}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => removeAdditionalCost(cost.id)}>
                      <Ionicons name="trash-outline" size={20} color={theme.error} />
                    </TouchableOpacity>
                  </View>
                ))}

                <View style={styles.addCostContainer}>
                  <TextInput
                    style={[styles.addCostInput, { backgroundColor: theme.surface, color: theme.text }]}
                    value={newCost.name}
                    onChangeText={(text) => setNewCost({ ...newCost, name: text })}
                    placeholder="Nome do custo"
                    placeholderTextColor={theme.textSecondary}
                  />
                  <TextInput
                    style={[styles.addCostValue, { backgroundColor: theme.surface, color: theme.text }]}
                    value={newCost.value}
                    onChangeText={(text) => setNewCost({ ...newCost, value: text })}
                    placeholder="Valor"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="decimal-pad"
                  />
                  <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: theme.primary }]}
                    onPress={addAdditionalCost}
                  >
                    <Ionicons name="add" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Profit Margin */}
          <View style={[styles.card, { backgroundColor: theme.card, ...theme.shadow }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Margem de Lucro</Text>
            
            <View style={styles.profitTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.profitTypeButton,
                  profitType === 'percentage' && { backgroundColor: theme.primary },
                  { borderColor: theme.primary }
                ]}
                onPress={() => setProfitType('percentage')}
              >
                <Text
                  style={[
                    styles.profitTypeText,
                    { color: profitType === 'percentage' ? '#FFFFFF' : theme.text }
                  ]}
                >
                  Percentual
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.profitTypeButton,
                  profitType === 'fixed' && { backgroundColor: theme.primary },
                  { borderColor: theme.primary }
                ]}
                onPress={() => setProfitType('fixed')}
              >
                <Text
                  style={[
                    styles.profitTypeText,
                    { color: profitType === 'fixed' ? '#FFFFFF' : theme.text }
                  ]}
                >
                  Valor Fixo
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text }]}
              value={profitMargin}
              onChangeText={setProfitMargin}
              placeholder={profitType === 'percentage' ? 'Percentual (%)' : 'Valor (R$)'}
              placeholderTextColor={theme.textSecondary}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Price Calculation */}
          <View style={[styles.calculationCard, { backgroundColor: theme.primary }]}>
            <Text style={styles.calculationTitle}>Preço Final</Text>
            <Text style={styles.finalPrice}>
              R$ {priceCalculation.finalPrice.toFixed(2)}
            </Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.card, ...theme.shadow }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Resumo do Cálculo</Text>
            
            <View style={styles.calculationRow}>
              <Text style={[styles.calculationLabel, { color: theme.textSecondary }]}>Preço base:</Text>
              <Text style={[styles.calculationValue, { color: theme.text }]}>
                R$ {priceCalculation.baseCost.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.calculationRow}>
              <Text style={[styles.calculationLabel, { color: theme.textSecondary }]}>
                Lucro ({priceCalculation.profitPercentage.toFixed(1)}%):
              </Text>
              <Text style={[styles.calculationValue, { color: theme.success }]}>
                R$ {priceCalculation.profit.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.calculationRow}>
              <Text style={[styles.calculationLabel, { color: theme.textSecondary }]}>
                Preço antes do imposto:
              </Text>
              <Text style={[styles.calculationValue, { color: theme.text }]}>
                R$ {priceCalculation.priceBeforeTax.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.calculationRow}>
              <Text style={[styles.calculationLabel, { color: theme.textSecondary }]}>Imposto:</Text>
              <Text style={[styles.calculationValue, { color: theme.secondary }]}>
                R$ {priceCalculation.tax.toFixed(2)}
              </Text>
            </View>
            
            <View style={[styles.calculationRow, styles.totalRow]}>
              <Text style={[styles.calculationLabel, { color: theme.text, fontWeight: '600' }]}>
                Preço final:
              </Text>
              <Text style={[styles.calculationValue, { color: theme.primary, fontWeight: '700' }]}>
                R$ {priceCalculation.finalPrice.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.primary }]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>
              {editMode ? 'Atualizar Produto' : 'Salvar Produto'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  imageContainer: {
    height: 200,
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 10,
    fontSize: 16,
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  costItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  costInfo: {
    flex: 1,
  },
  costName: {
    fontSize: 14,
    marginBottom: 4,
  },
  costValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  addCostContainer: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  addCostInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 14,
  },
  addCostValue: {
    width: 80,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 14,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profitTypeContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  profitTypeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  profitTypeText: {
    fontSize: 15,
    fontWeight: '500',
  },
  calculationCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
  },
  calculationTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
  },
  finalPrice: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  calculationLabel: {
    fontSize: 15,
  },
  calculationValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  saveButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});