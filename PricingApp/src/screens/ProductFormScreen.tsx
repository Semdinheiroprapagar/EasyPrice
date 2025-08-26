import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { Input, Button, Card } from '../components';
import { RootStackParamList } from '../navigation/AppNavigator';

type ProductFormScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProductForm'>;

interface ProductFormData {
  name: string;
  baseCost: string;
  taxPercentage: string;
  profitMargin: string;
  profitType: 'percentage' | 'fixed';
  additionalCosts: number[];
  imageUri?: string;
}

interface FormErrors {
  name?: string;
  baseCost?: string;
  taxPercentage?: string;
  profitMargin?: string;
}

const ProductFormScreen: React.FC = () => {
  const { currentTheme } = useTheme();
  const { addProduct, updateProduct, getProductById } = useData();
  const navigation = useNavigation<ProductFormScreenNavigationProp>();
  const route = useRoute();
  
  const productId = (route.params as any)?.productId;
  const isEditing = !!productId;

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    baseCost: '',
    taxPercentage: '',
    profitMargin: '',
    profitType: 'percentage',
    additionalCosts: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showAdditionalCosts, setShowAdditionalCosts] = useState(false);
  const [newAdditionalCost, setNewAdditionalCost] = useState('');

  // Load existing product data if editing
  useEffect(() => {
    if (isEditing) {
      const product = getProductById(productId);
      if (product) {
        setFormData({
          name: product.name,
          baseCost: product.baseCost.toString(),
          taxPercentage: product.taxPercentage.toString(),
          profitMargin: product.profitMargin.toString(),
          profitType: product.profitType,
          additionalCosts: product.additionalCosts,
          imageUri: product.imageUri,
        });
        if (product.additionalCosts.length > 0) {
          setShowAdditionalCosts(true);
        }
      }
    }
  }, [productId, isEditing]);

  // Calculate prices in real time
  const calculatePrices = () => {
    const baseCost = parseFloat(formData.baseCost) || 0;
    const taxPercentage = parseFloat(formData.taxPercentage) || 0;
    const profitMargin = parseFloat(formData.profitMargin) || 0;
    const additionalCostsTotal = formData.additionalCosts.reduce((sum, cost) => sum + cost, 0);
    
    const totalCost = baseCost + additionalCostsTotal;
    
    let profit = 0;
    if (formData.profitType === 'percentage') {
      profit = totalCost * (profitMargin / 100);
    } else {
      profit = profitMargin;
    }
    
    const priceBeforeTax = totalCost + profit;
    const tax = priceBeforeTax * (taxPercentage / 100);
    const finalPrice = priceBeforeTax + tax;

    return {
      totalCost,
      profit,
      priceBeforeTax,
      tax,
      finalPrice,
      profitPercentage: totalCost > 0 ? (profit / totalCost) * 100 : 0,
    };
  };

  const prices = calculatePrices();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do produto é obrigatório';
    }

    if (!formData.baseCost || parseFloat(formData.baseCost) <= 0) {
      newErrors.baseCost = 'Custo base deve ser maior que zero';
    }

    if (!formData.taxPercentage || parseFloat(formData.taxPercentage) < 0) {
      newErrors.taxPercentage = 'Percentual de imposto deve ser maior ou igual a zero';
    }

    if (!formData.profitMargin || parseFloat(formData.profitMargin) <= 0) {
      newErrors.profitMargin = 'Margem de lucro deve ser maior que zero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const productData = {
        name: formData.name.trim(),
        baseCost: parseFloat(formData.baseCost),
        taxPercentage: parseFloat(formData.taxPercentage),
        profitMargin: parseFloat(formData.profitMargin),
        profitType: formData.profitType,
        additionalCosts: formData.additionalCosts,
        finalPrice: prices.finalPrice,
        imageUri: formData.imageUri,
      };

      if (isEditing) {
        await updateProduct(productId, productData);
        Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
      } else {
        await addProduct(productData);
        Alert.alert('Sucesso', 'Produto salvo com sucesso!');
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar produto. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para selecionar imagens.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData({ ...formData, imageUri: result.assets[0].uri });
    }
  };

  const addAdditionalCost = () => {
    const cost = parseFloat(newAdditionalCost);
    if (cost > 0) {
      setFormData({
        ...formData,
        additionalCosts: [...formData.additionalCosts, cost],
      });
      setNewAdditionalCost('');
    }
  };

  const removeAdditionalCost = (index: number) => {
    const newCosts = formData.additionalCosts.filter((_, i) => i !== index);
    setFormData({ ...formData, additionalCosts: newCosts });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Image Section */}
      <Card>
        <TouchableOpacity style={styles.imageSection} onPress={handleImagePicker}>
          {formData.imageUri ? (
            <Image source={{ uri: formData.imageUri }} style={styles.productImage} />
          ) : (
            <View 
              style={[
                styles.imagePlaceholder,
                { backgroundColor: currentTheme.colors.surface }
              ]}
            >
              <Ionicons 
                name="camera-outline" 
                size={48} 
                color={currentTheme.colors.textTertiary} 
              />
              <Text 
                style={[
                  styles.imagePlaceholderText,
                  {
                    color: currentTheme.colors.textSecondary,
                    ...currentTheme.typography.textStyles.subhead,
                  }
                ]}
              >
                Toque para adicionar foto
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </Card>

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

        <Input
          label="Nome do Produto"
          value={formData.name}
          onChangeText={(name) => setFormData({ ...formData, name })}
          error={errors.name}
          placeholder="Digite o nome do produto"
        />

        <Input
          label="Custo Base (R$)"
          type="number"
          value={formData.baseCost}
          onChangeText={(baseCost) => setFormData({ ...formData, baseCost })}
          error={errors.baseCost}
          placeholder="0,00"
          keyboardType="numeric"
        />

        <Input
          label="Percentual de Imposto (%)"
          type="number"
          value={formData.taxPercentage}
          onChangeText={(taxPercentage) => setFormData({ ...formData, taxPercentage })}
          error={errors.taxPercentage}
          placeholder="0"
          keyboardType="numeric"
        />
      </Card>

      {/* Additional Costs */}
      <Card>
        <View style={styles.additionalCostsHeader}>
          <Text 
            style={[
              styles.sectionTitle,
              {
                color: currentTheme.colors.text,
                ...currentTheme.typography.textStyles.headline,
              }
            ]}
          >
            Custos Adicionais
          </Text>
          <TouchableOpacity
            onPress={() => setShowAdditionalCosts(!showAdditionalCosts)}
            style={[
              styles.toggleButton,
              { backgroundColor: currentTheme.colors.primarySoft }
            ]}
          >
            <Ionicons 
              name={showAdditionalCosts ? "remove" : "add"} 
              size={20} 
              color={currentTheme.colors.primary} 
            />
          </TouchableOpacity>
        </View>

        {showAdditionalCosts && (
          <View style={styles.additionalCostsContent}>
            <View style={styles.addCostRow}>
              <Input
                value={newAdditionalCost}
                onChangeText={setNewAdditionalCost}
                placeholder="Valor adicional"
                keyboardType="numeric"
                containerStyle={styles.addCostInput}
              />
              <Button
                title="Adicionar"
                onPress={addAdditionalCost}
                size="small"
                style={styles.addCostButton}
              />
            </View>

            {formData.additionalCosts.map((cost, index) => (
              <View key={index} style={styles.costItem}>
                <Text 
                  style={[
                    styles.costValue,
                    {
                      color: currentTheme.colors.text,
                      ...currentTheme.typography.textStyles.body,
                    }
                  ]}
                >
                  {formatCurrency(cost)}
                </Text>
                <TouchableOpacity
                  onPress={() => removeAdditionalCost(index)}
                  style={styles.removeCostButton}
                >
                  <Ionicons 
                    name="close-circle" 
                    size={20} 
                    color={currentTheme.colors.error} 
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </Card>

      {/* Profit Margin */}
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
          Margem de Lucro
        </Text>

        <View style={styles.profitTypeSelector}>
          <TouchableOpacity
            style={[
              styles.profitTypeButton,
              {
                backgroundColor: formData.profitType === 'percentage' 
                  ? currentTheme.colors.primary 
                  : currentTheme.colors.surface,
              }
            ]}
            onPress={() => setFormData({ ...formData, profitType: 'percentage' })}
          >
            <Text 
              style={[
                styles.profitTypeText,
                {
                  color: formData.profitType === 'percentage' 
                    ? '#FFFFFF' 
                    : currentTheme.colors.textSecondary,
                  ...currentTheme.typography.textStyles.subhead,
                }
              ]}
            >
              Percentual (%)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.profitTypeButton,
              {
                backgroundColor: formData.profitType === 'fixed' 
                  ? currentTheme.colors.primary 
                  : currentTheme.colors.surface,
              }
            ]}
            onPress={() => setFormData({ ...formData, profitType: 'fixed' })}
          >
            <Text 
              style={[
                styles.profitTypeText,
                {
                  color: formData.profitType === 'fixed' 
                    ? '#FFFFFF' 
                    : currentTheme.colors.textSecondary,
                  ...currentTheme.typography.textStyles.subhead,
                }
              ]}
            >
              Valor Fixo (R$)
            </Text>
          </TouchableOpacity>
        </View>

        <Input
          label={formData.profitType === 'percentage' ? 'Margem (%)' : 'Valor (R$)'}
          type="number"
          value={formData.profitMargin}
          onChangeText={(profitMargin) => setFormData({ ...formData, profitMargin })}
          error={errors.profitMargin}
          placeholder={formData.profitType === 'percentage' ? '0' : '0,00'}
          keyboardType="numeric"
        />
      </Card>

      {/* Price Summary */}
      <Card style={[styles.priceCard, { backgroundColor: currentTheme.colors.primarySoft }]}>
        <Text 
          style={[
            styles.priceCardTitle,
            {
              color: currentTheme.colors.primary,
              ...currentTheme.typography.textStyles.title3,
            }
          ]}
        >
          Resumo do Cálculo
        </Text>

        <View style={styles.priceRow}>
          <Text style={[styles.priceLabel, { color: currentTheme.colors.textSecondary }]}>
            Preço base:
          </Text>
          <Text style={[styles.priceValue, { color: currentTheme.colors.text }]}>
            {formatCurrency(prices.totalCost)}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={[styles.priceLabel, { color: currentTheme.colors.textSecondary }]}>
            Lucro:
          </Text>
          <Text style={[styles.priceValue, { color: currentTheme.colors.accent }]}>
            {formatCurrency(prices.profit)} ({prices.profitPercentage.toFixed(1)}%)
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={[styles.priceLabel, { color: currentTheme.colors.textSecondary }]}>
            Preço antes do imposto:
          </Text>
          <Text style={[styles.priceValue, { color: currentTheme.colors.text }]}>
            {formatCurrency(prices.priceBeforeTax)}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={[styles.priceLabel, { color: currentTheme.colors.textSecondary }]}>
            Imposto:
          </Text>
          <Text style={[styles.priceValue, { color: currentTheme.colors.warning }]}>
            {formatCurrency(prices.tax)}
          </Text>
        </View>

        <View style={[styles.priceRow, styles.finalPriceRow]}>
          <Text 
            style={[
              styles.finalPriceLabel,
              {
                color: currentTheme.colors.primary,
                ...currentTheme.typography.textStyles.title3,
              }
            ]}
          >
            Preço Final:
          </Text>
          <Text 
            style={[
              styles.finalPriceValue,
              {
                color: currentTheme.colors.primary,
                ...currentTheme.typography.textStyles.title2,
              }
            ]}
          >
            {formatCurrency(prices.finalPrice)}
          </Text>
        </View>
      </Card>

      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        <Button
          title={isEditing ? "Atualizar Produto" : "Salvar Produto"}
          onPress={handleSave}
          loading={isLoading}
          size="large"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  imageSection: {
    alignItems: 'center',
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E5E5EA',
  },
  imagePlaceholderText: {
    marginTop: 8,
    textAlign: 'center',
  },
  sectionTitle: {
    marginBottom: 16,
  },
  additionalCostsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  additionalCostsContent: {
    gap: 12,
  },
  addCostRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
  },
  addCostInput: {
    flex: 1,
  },
  addCostButton: {
    marginBottom: 0,
  },
  costItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  costValue: {
    flex: 1,
  },
  removeCostButton: {
    padding: 4,
  },
  profitTypeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  profitTypeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  profitTypeText: {
    fontWeight: '500',
  },
  priceCard: {
    marginBottom: 24,
  },
  priceCardTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    flex: 1,
    fontSize: 15,
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  finalPriceRow: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  finalPriceLabel: {
    flex: 1,
  },
  finalPriceValue: {
    fontWeight: '700',
  },
  saveButtonContainer: {
    padding: 24,
  },
});

export default ProductFormScreen;