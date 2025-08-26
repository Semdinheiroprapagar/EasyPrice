export interface AdditionalCost {
  id: string;
  description: string;
  value: number;
}

export interface Product {
  id: string;
  name: string;
  baseCost: number;
  taxPercentage: number;
  profitMargin: number;
  profitType: 'percentage' | 'fixed';
  additionalCosts: AdditionalCost[];
  image: string | null;
  createdAt: Date;
  finalPrice: number;
}

export interface Calculation {
  id: string;
  productName: string;
  baseCost: number;
  profitValue: number;
  profitPercentage: number;
  taxValue: number;
  finalPrice: number;
  calculatedAt: Date;
  additionalCosts: AdditionalCost[];
  taxPercentage: number;
  profitMargin: number;
  profitType: 'percentage' | 'fixed';
}