import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Card } from './Card';

export interface Calculation {
  id: string;
  productName: string;
  baseCost: number;
  profit: number;
  profitPercentage: number;
  tax: number;
  finalPrice: number;
  createdAt: Date;
}

interface CalculationCardProps {
  calculation: Calculation;
  onPress: (calculation: Calculation) => void;
}

export const CalculationCard: React.FC<CalculationCardProps> = ({
  calculation,
  onPress,
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
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <TouchableOpacity onPress={() => onPress(calculation)} activeOpacity={0.7}>
      <Card padding="md" margin="sm">
        <View style={styles.header}>
          <Text 
            style={[
              styles.productName,
              {
                color: currentTheme.colors.text,
                ...currentTheme.typography.textStyles.headline,
              }
            ]}
            numberOfLines={1}
          >
            {calculation.productName}
          </Text>
          <Text 
            style={[
              styles.date,
              {
                color: currentTheme.colors.textSecondary,
                ...currentTheme.typography.textStyles.caption1,
              }
            ]}
          >
            {formatDate(calculation.createdAt)}
          </Text>
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text 
              style={[
                styles.detailLabel,
                {
                  color: currentTheme.colors.textSecondary,
                  ...currentTheme.typography.textStyles.subhead,
                }
              ]}
            >
              Custo Base:
            </Text>
            <Text 
              style={[
                styles.detailValue,
                {
                  color: currentTheme.colors.text,
                  ...currentTheme.typography.textStyles.subhead,
                }
              ]}
            >
              {formatCurrency(calculation.baseCost)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text 
              style={[
                styles.detailLabel,
                {
                  color: currentTheme.colors.textSecondary,
                  ...currentTheme.typography.textStyles.subhead,
                }
              ]}
            >
              Lucro:
            </Text>
            <Text 
              style={[
                styles.detailValue,
                {
                  color: currentTheme.colors.accent,
                  ...currentTheme.typography.textStyles.subhead,
                }
              ]}
            >
              {formatCurrency(calculation.profit)} ({calculation.profitPercentage.toFixed(1)}%)
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text 
              style={[
                styles.detailLabel,
                {
                  color: currentTheme.colors.textSecondary,
                  ...currentTheme.typography.textStyles.subhead,
                }
              ]}
            >
              Imposto:
            </Text>
            <Text 
              style={[
                styles.detailValue,
                {
                  color: currentTheme.colors.warning,
                  ...currentTheme.typography.textStyles.subhead,
                }
              ]}
            >
              {formatCurrency(calculation.tax)}
            </Text>
          </View>

          <View style={[styles.detailRow, styles.finalPriceRow]}>
            <Text 
              style={[
                styles.finalPriceLabel,
                {
                  color: currentTheme.colors.text,
                  ...currentTheme.typography.textStyles.headline,
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
                  ...currentTheme.typography.textStyles.title3,
                }
              ]}
            >
              {formatCurrency(calculation.finalPrice)}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  productName: {
    flex: 1,
    marginRight: 8,
  },
  date: {
    flexShrink: 0,
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    flex: 1,
  },
  detailValue: {
    fontWeight: '500',
  },
  finalPriceRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
  },
  finalPriceLabel: {
    flex: 1,
  },
  finalPriceValue: {
    fontWeight: '600',
  },
});