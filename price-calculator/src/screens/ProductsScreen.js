import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import { useFocusEffect } from '@react-navigation/native';

export default function ProductsScreen({ navigation }) {
  const { theme } = useTheme();
  const { products, deleteProduct, loading } = useData();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      // Refresh data when screen is focused
    }, [])
  );

  const handleDelete = (productId, productName) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente excluir o produto "${productName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProduct(productId);
            } catch (error) {
              Alert.alert('Erro', 'Erro ao excluir produto');
            }
          },
        },
      ]
    );
  };

  const handleEdit = (productId) => {
    navigation.navigate('ProductForm', { productId });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const renderProduct = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: theme.card, ...theme.shadow }]}
      onPress={() => handleEdit(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.productContent}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.productImage} />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: theme.surface }]}>
            <Ionicons name="image-outline" size={24} color={theme.textSecondary} />
          </View>
        )}
        
        <View style={styles.productInfo}>
          <Text style={[styles.productName, { color: theme.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.productPrice, { color: theme.primary }]}>
            R$ {item.finalPrice.toFixed(2)}
          </Text>
          <Text style={[styles.productDetails, { color: theme.textSecondary }]}>
            Base: R$ {item.cost.toFixed(2)}
            {item.additionalCosts?.length > 0 && ` • ${item.additionalCosts.length} custos extras`}
          </Text>
          <Text style={[styles.productDate, { color: theme.textSecondary }]}>
            {formatDate(item.createdAt)}
          </Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEdit(item.id)}
          >
            <Ionicons name="pencil" size={20} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDelete(item.id, item.name)}
          >
            <Ionicons name="trash-outline" size={20} color={theme.error} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cube-outline" size={80} color={theme.textSecondary} />
      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        Nenhum produto cadastrado
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
        Adicione seu primeiro produto tocando no botão +
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Produtos Salvos</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('ProductForm')}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Product List */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          products.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  productCard: {
    marginBottom: 15,
    borderRadius: 15,
    padding: 15,
  },
  productContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  imagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
    marginLeft: 15,
  },
  productName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  productDetails: {
    fontSize: 13,
    marginBottom: 2,
  },
  productDate: {
    fontSize: 12,
  },
  actions: {
    flexDirection: 'column',
    gap: 10,
  },
  actionButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});