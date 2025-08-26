import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../src/theme';
import { Card } from '../../src/ui/Card';
import { ThemedTextField } from '../../src/ui/TextField';
import { PrimaryButton, SubtleButton } from '../../src/ui/Button';
import { computePrice } from '../../src/lib/calc';
import { addCalculation, saveProduct } from '../../src/lib/storage';
import { MarginMode, Product } from '../../src/lib/types';
import * as Haptics from 'expo-haptics';
import { PriceSummary } from '../../src/ui/PriceSummary';

export default function CadastroScreen() {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [baseCost, setBaseCost] = useState('');
  const [taxPercent, setTaxPercent] = useState('');
  const [marginMode, setMarginMode] = useState<MarginMode>('percent');
  const [marginInput, setMarginInput] = useState('20');
  const [extras, setExtras] = useState<string[]>([]);

  const numbersExtras = useMemo(() => extras.map(v => Number(v) || 0), [extras]);
  const calc = useMemo(() => computePrice({
    name: name || 'Cálculo',
    baseCost: Number(baseCost) || 0,
    additionalCosts: numbersExtras,
    marginMode,
    marginInput: Number(marginInput) || 0,
    taxPercent: Number(taxPercent) || 0
  }), [name, baseCost, numbersExtras, marginMode, marginInput, taxPercent]);

  function addExtra() {
    setExtras(prev => [...prev, '']);
  }

  function updateExtra(index: number, value: string) {
    setExtras(prev => prev.map((v, i) => i === index ? value : v));
  }

  async function onSave() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const product: Product = {
      id: Date.now().toString(),
      name: name || 'Produto',
      baseCost: Number(baseCost) || 0,
      additionalCosts: numbersExtras,
      marginMode,
      marginValue: Number(marginInput) || 0,
      taxPercent: Number(taxPercent) || 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    await saveProduct(product);
    await addCalculation({ id: Date.now().toString(), date: Date.now(), productId: product.id, ...calc });
    Alert.alert('Salvo', 'Produto salvo com sucesso.');
    setName(''); setBaseCost(''); setTaxPercent(''); setExtras([]); setMarginInput('20'); setMarginMode('percent');
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Card>
        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          <TouchableOpacity onPress={() => Alert.alert('Imagem', 'Placeholder de seleção de imagem')}>
            <View style={{ width: 100, height: 100, borderRadius: 24, backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: theme.colors.textSecondary }}>Imagem</Text>
            </View>
          </TouchableOpacity>
        </View>
        <ThemedTextField placeholder="Nome do Produto" value={name} onChangeText={setName} />
        <View style={{ height: 12 }} />
        <ThemedTextField placeholder="Custo do Produto" value={baseCost} onChangeText={setBaseCost} keyboardType="decimal-pad" />
        <View style={{ height: 12 }} />
        <ThemedTextField placeholder="Percentual de Imposto (%)" value={taxPercent} onChangeText={setTaxPercent} keyboardType="decimal-pad" />
        <View style={{ height: 12 }} />
        <SubtleButton label="Adicionar Custos Adicionais" onPress={addExtra} />
        {extras.map((v, i) => (
          <View key={i} style={{ marginTop: 8 }}>
            <ThemedTextField placeholder={`Custo adicional #${i + 1}`} value={v} onChangeText={val => updateExtra(i, val)} keyboardType="decimal-pad" />
          </View>
        ))}
        <View style={{ height: 12 }} />
        <View style={styles.row}> 
          <TouchableOpacity style={[styles.tag, { backgroundColor: marginMode === 'percent' ? theme.colors.accent : theme.colors.surface }]} onPress={() => setMarginMode('percent')}>
            <Text style={{ color: marginMode === 'percent' ? '#fff' : theme.colors.text }}>Margem %</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tag, { backgroundColor: marginMode === 'fixed' ? theme.colors.accent : theme.colors.surface }]} onPress={() => setMarginMode('fixed')}>
            <Text style={{ color: marginMode === 'fixed' ? '#fff' : theme.colors.text }}>Margem $</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 8 }} />
        <ThemedTextField placeholder={marginMode === 'percent' ? 'Margem (%)' : 'Margem (valor)'} value={marginInput} onChangeText={setMarginInput} keyboardType="decimal-pad" />
      </Card>

      <View style={{ height: 12 }} />
      <Card>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Preço Final</Text>
        <Text style={[styles.finalPrice, { color: theme.colors.accent }]}>R$ {calc.finalPrice.toFixed(2)}</Text>
      </Card>

      <View style={{ height: 12 }} />
      <Card>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Resumo do Cálculo</Text>
        <PriceSummary
          priceBase={calc.baseCost + calc.additionalTotal}
          marginValue={calc.marginValue}
          marginPercent={calc.marginPercent}
          preTaxPrice={calc.preTaxPrice}
          taxAmount={calc.taxAmount}
          finalPrice={calc.finalPrice}
        />
      </Card>

      <View style={{ height: 16 }} />
      <PrimaryButton label="Salvar Produto" onPress={onSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  tag: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  finalPrice: { fontSize: 28, fontWeight: '800' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }
});

