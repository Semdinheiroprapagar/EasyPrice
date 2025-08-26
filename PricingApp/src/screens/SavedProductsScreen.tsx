import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { ProductCard, Product } from '../components';
import { RootStackParamList } from '../navigation/AppNavigator';

type SavedProductsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const SavedProductsScreen: React.FC = () => {
  const { currentTheme } = useTheme();
  const { products, deleteProduct, isLoading } = useData();
  const navigation = useNavigation<SavedProductsScreenNavigationProp>();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // In a real app, you might refetch data from server here
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleEditProduct = (product: Product) => {
    navigation.navigate('ProductForm', { productId: product.id });
  };

  const handleDeleteProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    Alert.alert(
      'Excluir Produto',
      `Tem certeza que deseja excluir "${product.name}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProduct(productId);
              // Optional: Show success message
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o produto.');
            }
          },
        },
      ]
    );
  };

  const handleAddProduct = () => {
    navigation.navigate('ProductForm', {});
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onEdit={handleEditProduct}
      onDelete={handleDeleteProduct}
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
          name="cube-outline" 
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
        Nenhum produto cadastrado
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
        Comece adicionando seu primeiro produto para calcular preços de venda.
      </Text>
      
      <TouchableOpacity
        style={[
          styles.emptyButton,
          { 
            backgroundColor: currentTheme.colors.primary,
            ...currentTheme.shadows.md,
            shadowColor: currentTheme.colors.shadow,
          }
        ]}
        onPress={handleAddProduct}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
        <Text 
          style={[
            styles.emptyButtonText,
            { ...currentTheme.typography.textStyles.headline }
          ]}
        >
          Adicionar Produto
        </Text>
      </TouchableOpacity>
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
            Produtos
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
            {products.length} produto{products.length !== 1 ? 's' : ''} cadastrado{products.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.addButton,
            { 
              backgroundColor: currentTheme.colors.primary,
              ...currentTheme.shadows.md,
              shadowColor: currentTheme.colors.shadow,
            }
          ]}
          onPress={handleAddProduct}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

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
          Carregando produtos...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <FlatList
        data={products}
        renderItem={renderProduct}
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
        contentContainerStyle={products.length === 0 ? styles.emptyContainer : styles.listContainer}
      />
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
  addButton: {
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
    marginBottom: 32,
    lineHeight: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default SavedProductsScreen;