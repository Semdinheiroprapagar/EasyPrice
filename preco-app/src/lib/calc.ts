import { Calculation, MarginMode } from './types';

export function computePrice({
  name,
  baseCost,
  additionalCosts,
  marginMode,
  marginInput,
  taxPercent
}: {
  name: string;
  baseCost: number;
  additionalCosts: number[];
  marginMode: MarginMode;
  marginInput: number; // percent or fixed value
  taxPercent: number; // over final price
}): Omit<Calculation, 'id' | 'date'> {
  const additionalTotal = additionalCosts.reduce((s, v) => s + (Number(v) || 0), 0);
  const priceBase = baseCost + additionalTotal;

  const marginValue = marginMode === 'percent' ? (priceBase * (marginInput / 100)) : marginInput;
  const preTaxPrice = priceBase + marginValue;

  // tax percent is applied over final price: final = preTax + tax(final)
  // final = preTax * (1 + tax%) / (1 - 0)? No. If tax is on final, then final = preTax / (1 - t)
  const t = (taxPercent || 0) / 100;
  const finalPrice = t > 0 ? preTaxPrice / (1 - t) : preTaxPrice;
  const taxAmount = finalPrice - preTaxPrice;

  const marginPercent = preTaxPrice === 0 ? 0 : (marginValue / preTaxPrice) * 100;

  return {
    name,
    productId: undefined,
    baseCost,
    additionalTotal,
    marginValue,
    marginPercent,
    preTaxPrice,
    taxAmount,
    finalPrice
  };
}

