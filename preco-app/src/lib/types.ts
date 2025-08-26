export type MarginMode = 'percent' | 'fixed';

export type Product = {
  id: string;
  name: string;
  baseCost: number; // custo do produto
  additionalCosts: number[]; // custos extras
  marginMode: MarginMode;
  marginValue: number; // % quando percent; valor quando fixed
  taxPercent: number; // percentual aplicado sobre o valor final
  imageUri?: string;
  createdAt: number;
  updatedAt: number;
};

export type Calculation = {
  id: string;
  productId?: string;
  name: string;
  date: number;
  baseCost: number;
  additionalTotal: number;
  marginValue: number; // valor absoluto de lucro
  marginPercent: number; // percentual de lucro sobre preço antes imposto
  preTaxPrice: number;
  taxAmount: number;
  finalPrice: number;
};

