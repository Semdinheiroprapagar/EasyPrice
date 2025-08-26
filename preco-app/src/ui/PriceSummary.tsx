import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export function PriceSummary({
  priceBase,
  marginValue,
  marginPercent,
  preTaxPrice,
  taxAmount,
  finalPrice
}: {
  priceBase: number;
  marginValue: number;
  marginPercent: number;
  preTaxPrice: number;
  taxAmount: number;
  finalPrice: number;
}) {
  const theme = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <Row label="Preço base" value={priceBase} />
      <Row label={`Lucro (${marginPercent.toFixed(1)}%)`} value={marginValue} />
      <Row label="Preço antes do imposto" value={preTaxPrice} />
      <Row label="Imposto" value={taxAmount} />
      <Row label="Preço final" value={finalPrice} bold />
    </View>
  );
}

function Row({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  const theme = useTheme();
  return (
    <View style={styles.rowBetween}>
      <Text style={{ color: theme.colors.textSecondary }}>{label}</Text>
      <Text style={{ color: theme.colors.text, fontWeight: bold ? '800' : '600' }}>R$ {value.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
});

