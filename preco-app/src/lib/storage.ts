import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, Calculation } from './types';

const KEYS = {
  products: 'preco.products',
  calculations: 'preco.calculations'
};

export async function getProducts(): Promise<Product[]> {
  const raw = await AsyncStorage.getItem(KEYS.products);
  return raw ? JSON.parse(raw) : [];
}

export async function saveProduct(product: Product): Promise<void> {
  const list = await getProducts();
  const idx = list.findIndex(p => p.id === product.id);
  if (idx >= 0) list[idx] = product; else list.unshift(product);
  await AsyncStorage.setItem(KEYS.products, JSON.stringify(list));
}

export async function deleteProduct(id: string): Promise<void> {
  const list = await getProducts();
  const next = list.filter(p => p.id !== id);
  await AsyncStorage.setItem(KEYS.products, JSON.stringify(next));
}

export async function getCalculations(): Promise<Calculation[]> {
  const raw = await AsyncStorage.getItem(KEYS.calculations);
  return raw ? JSON.parse(raw) : [];
}

export async function addCalculation(calc: Calculation): Promise<void> {
  const list = await getCalculations();
  list.unshift(calc);
  await AsyncStorage.setItem(KEYS.calculations, JSON.stringify(list));
}

