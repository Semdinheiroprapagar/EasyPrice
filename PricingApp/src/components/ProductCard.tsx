import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Card } from './Card';

export interface Product {
  id: string;
  name: string;
  baseCost: number;
  additionalCosts: number[];
  taxPercentage: number;
  profitMargin: number;
  profitType: 'percentage' | 'fixed';
  finalPrice: number;
  imageUri?: string;
  createdAt: Date;
}

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  const { currentTheme } = useTheme();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  return (
    <Card padding="md" margin="sm">
      <View style={styles.container}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          {product.imageUri ? (
            <Image source={{ uri: product.imageUri }} style={styles.productImage} />
          ) : (
            <View 
              style={[
                styles.placeholderImage,
                { backgroundColor: currentTheme.colors.surface }
              ]}
            >
              <Ionicons 
                name="image-outline" 
                size={24} 
                color={currentTheme.colors.textTertiary} 
              />
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text 
            style={[
              styles.productName,
              {
                color: currentTheme.colors.text,
                ...currentTheme.typography.textStyles.headline,
              }
            ]}
            numberOfLines={2}
          >
            {product.name}
          </Text>

          <Text 
            style={[
              styles.finalPrice,
              {
                color: currentTheme.colors.primary,
                ...currentTheme.typography.textStyles.title3,
              }
            ]}
          >
            {formatCurrency(product.finalPrice)}
          </Text>

          <View style={styles.details}>
            <Text 
              style={[
                styles.detailText,
                {
                  color: currentTheme.colors.textSecondary,
                  ...currentTheme.typography.textStyles.caption1,
                }
              ]}
            >
              Base: {formatCurrency(product.baseCost)}
            </Text>
            <Text 
              style={[
                styles.detailText,
                {
                  color: currentTheme.colors.textSecondary,
                  ...currentTheme.typography.textStyles.caption1,
                }
              ]}
            >
              • {product.additionalCosts.length} custos extras
            </Text>
            <Text 
              style={[
                styles.detailText,
                {
                  color: currentTheme.colors.textSecondary,
                  ...currentTheme.typography.textStyles.caption1,
                }
              ]}
            >
              • {formatDate(product.createdAt)}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: currentTheme.colors.primarySoft }
            ]}
            onPress={() => onEdit(product)}
          >
            <Ionicons 
              name="pencil" 
              size={18} 
              color={currentTheme.colors.primary} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: currentTheme.colors.error + '20' }
            ]}
            onPress={() => onDelete(product.id)}
          >
            <Ionicons 
              name="trash-outline" 
              size={18} 
              color={currentTheme.colors.error} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    marginBottom: 4,
  },
  finalPrice: {
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailText: {
    marginRight: 8,
  },
  actions: {
    flexDirection: 'column',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});