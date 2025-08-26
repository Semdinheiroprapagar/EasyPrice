import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, LayoutAnimation, UIManager, Platform } from 'react-native';
import { useTheme } from '../../src/theme';
import { Card } from '../../src/ui/Card';
import { getProducts, deleteProduct } from '../../src/lib/storage';
import { Product } from '../../src/lib/types';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { computePrice } from '../../src/lib/calc';

export default function ProdutosScreen() {
  const theme = useTheme();
  const [products, setProducts] = useState<Product[]>([]);

  async function load() {
    const list = await getProducts();
    setProducts(list);
  }

  useEffect(() => { const unsub = setInterval(load, 800); return () => clearInterval(unsub); }, []);

  async function onDelete(id: string) {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    await deleteProduct(id);
    await load();
  }

  function renderItem({ item }: { item: Product }) {
    const priceBase = item.baseCost + item.additionalCosts.reduce((s, v) => s + v, 0);
    const c = computePrice({ name: item.name, baseCost: item.baseCost, additionalCosts: item.additionalCosts, marginMode: item.marginMode, marginInput: item.marginValue, taxPercent: item.taxPercent });
    return (
      <Card style={{ marginHorizontal: 16, marginTop: 12 }}>
        <View style={styles.rowBetween}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.text }}>{item.name}</Text>
            <Text style={{ marginTop: 4, color: theme.colors.textSecondary }}>Preço base: R$ {priceBase.toFixed(2)} · Extras: {item.additionalCosts.length} · {new Date(item.createdAt).toLocaleDateString()}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: theme.colors.accent, fontWeight: '800', fontSize: 16 }}>R$ {c.finalPrice.toFixed(2)}</Text>
          </View>
        </View>
        <View style={[styles.rowBetween, { marginTop: 10 }]}>
          <View />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity onPress={() => Alert.alert('Editar', 'Placeholder de edição')}>
              <Ionicons name="pencil" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(item.id)}>
              <Ionicons name="trash" size={20} color={theme.colors.danger} />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ paddingVertical: 8 }}
      ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 48, color: theme.colors.textSecondary }}>Nenhum produto salvo.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
});

