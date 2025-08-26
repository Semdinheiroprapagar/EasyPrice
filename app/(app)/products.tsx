import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { Product } from '../../types/product';

export default function ProductsScreen() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    // Simulação de produtos salvos
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Smartphone XYZ',
        baseCost: 800.00,
        taxPercentage: 18.0,
        profitMargin: 25.0,
        profitType: 'percentage',
        additionalCosts: [
          { id: '1', description: 'Frete', value: 25.00 },
          { id: '2', description: 'Embalagem', value: 15.00 }
        ],
        image: null,
        createdAt: new Date('2024-01-15'),
        finalPrice: 1050.00
      },
      {
        id: '2',
        name: 'Notebook Pro',
        baseCost: 2500.00,
        taxPercentage: 18.0,
        profitMargin: 30.0,
        profitType: 'percentage',
        additionalCosts: [
          { id: '1', description: 'Frete', value: 50.00 }
        ],
        image: null,
        createdAt: new Date('2024-01-10'),
        finalPrice: 3315.00
      }
    ];
    setProducts(mockProducts);
  };

  const handleEdit = (product: Product) => {
    // Navegar para tela de edição
    console.log('Editar produto:', product.id);
  };

  const handleDelete = (product: Product) => {
    Alert.alert(
      'Excluir Produto',
      `Tem certeza que deseja excluir "${product.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setProducts(prev => prev.filter(p => p.id !== product.id));
          }
        }
      ]
    );
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  const renderProductCard = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <View style={styles.productImageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.productImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="cube-outline" size={32} color="#8E8E93" />
          </View>
        )}
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.finalPrice}>
          {formatCurrency(item.finalPrice)}
        </Text>
        <Text style={styles.productDetails}>
          Base: {formatCurrency(item.baseCost)} • 
          {item.additionalCosts.length} custo{item.additionalCosts.length !== 1 ? 's' : ''} adicional{item.additionalCosts.length !== 1 ? 'es' : ''} • 
          {formatDate(item.createdAt)}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEdit(item)}
        >
          <Ionicons name="pencil" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Produtos</Text>
        <Text style={styles.subtitle}>
          {products.length} produto{products.length !== 1 ? 's' : ''} cadastrado{products.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {products.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="cube-outline" size={64} color="#8E8E93" />
          <Text style={styles.emptyStateTitle}>Nenhum produto cadastrado</Text>
          <Text style={styles.emptyStateSubtitle}>
            Adicione seu primeiro produto para começar a calcular preços
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.productsList}
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
  productsList: {
    padding: 16,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  productImageContainer: {
    marginRight: 16,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  finalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
  },
  productDetails: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
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