import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../src/theme';
import { Card } from '../../src/ui/Card';
import { getCalculations } from '../../src/lib/storage';
import { Calculation } from '../../src/lib/types';

export default function CalculoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const [calc, setCalc] = useState<Calculation | null>(null);

  useEffect(() => {
    (async () => {
      const list = await getCalculations();
      setCalc(list.find(c => c.id === id) || null);
    })();
  }, [id]);

  if (!calc) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: theme.colors.textSecondary }}>Carregando…</Text></View>;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Card>
        <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: '700' }}>{calc.name}</Text>
        <Text style={{ color: theme.colors.textSecondary, marginTop: 4 }}>{new Date(calc.date).toLocaleString()}</Text>
      </Card>

      <View style={{ height: 12 }} />
      <Card>
        <Row label="Preço base" value={calc.baseCost + calc.additionalTotal} />
        <Row label={`Lucro (${calc.marginPercent.toFixed(1)}%)`} value={calc.marginValue} />
        <Row label="Preço antes do imposto" value={calc.preTaxPrice} />
        <Row label="Imposto" value={calc.taxAmount} />
        <Row label="Preço final" value={calc.finalPrice} bold />
      </Card>
    </ScrollView>
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
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 }
});

