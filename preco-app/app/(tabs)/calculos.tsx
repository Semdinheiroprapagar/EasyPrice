import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../src/theme';
import { Card } from '../../src/ui/Card';
import { getCalculations } from '../../src/lib/storage';
import { Calculation } from '../../src/lib/types';
import { router } from 'expo-router';

export default function CalculosScreen() {
  const theme = useTheme();
  const [list, setList] = useState<Calculation[]>([]);

  async function load() {
    const l = await getCalculations();
    setList(l);
  }

  useEffect(() => { const unsub = setInterval(load, 800); return () => clearInterval(unsub); }, []);

  function renderItem({ item }: { item: Calculation }) {
    return (
      <TouchableOpacity onPress={() => router.push(`/calculo/${item.id}`)}>
        <Card style={{ marginHorizontal: 16, marginTop: 12 }}>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.text }}>{item.name}</Text>
              <Text style={{ marginTop: 4, color: theme.colors.textSecondary }}>{new Date(item.date).toLocaleString()}</Text>
            </View>
            <Text style={{ color: theme.colors.accent, fontWeight: '800', fontSize: 16 }}>R$ {item.finalPrice.toFixed(2)}</Text>
          </View>
          <View style={{ marginTop: 8, gap: 4 }}>
            <Row label="Custo Base" value={item.baseCost + item.additionalTotal} />
            <Row label={`Lucro (${item.marginPercent.toFixed(1)}%)`} value={item.marginValue} />
            <Row label="Imposto" value={item.taxAmount} />
          </View>
        </Card>
      </TouchableOpacity>
    );
  }

  return (
    <FlatList
      data={list}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ paddingVertical: 8 }}
      ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 48, color: theme.colors.textSecondary }}>Nenhum cálculo.</Text>}
    />
  );
}

function Row({ label, value }: { label: string; value: number }) {
  const theme = useTheme();
  return (
    <View style={styles.rowBetween}>
      <Text style={{ color: theme.colors.textSecondary }}>{label}</Text>
      <Text style={{ color: theme.colors.text, fontWeight: '600' }}>R$ {value.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
});

