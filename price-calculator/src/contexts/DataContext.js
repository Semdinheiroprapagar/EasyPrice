import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DataContext = createContext({});

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, calculationsData] = await Promise.all([
        AsyncStorage.getItem('@products'),
        AsyncStorage.getItem('@calculations'),
      ]);

      if (productsData) setProducts(JSON.parse(productsData));
      if (calculationsData) setCalculations(JSON.parse(calculationsData));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProduct = async (product) => {
    try {
      const newProduct = {
        ...product,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      
      const updatedProducts = [newProduct, ...products];
      setProducts(updatedProducts);
      await AsyncStorage.setItem('@products', JSON.stringify(updatedProducts));
      
      // Também salva no histórico de cálculos
      const calculation = {
        id: Date.now().toString(),
        productName: product.name,
        date: new Date().toISOString(),
        baseCost: product.cost,
        profit: product.profit,
        profitPercentage: product.profitPercentage,
        tax: product.tax,
        finalPrice: product.finalPrice,
        details: product,
      };
      
      const updatedCalculations = [calculation, ...calculations];
      setCalculations(updatedCalculations);
      await AsyncStorage.setItem('@calculations', JSON.stringify(updatedCalculations));
      
      return newProduct;
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  };

  const updateProduct = async (productId, updatedProduct) => {
    try {
      const updatedProducts = products.map(p =>
        p.id === productId ? { ...updatedProduct, id: productId, updatedAt: new Date().toISOString() } : p
      );
      setProducts(updatedProducts);
      await AsyncStorage.setItem('@products', JSON.stringify(updatedProducts));
      
      // Adiciona novo cálculo ao histórico
      const calculation = {
        id: Date.now().toString(),
        productName: updatedProduct.name,
        date: new Date().toISOString(),
        baseCost: updatedProduct.cost,
        profit: updatedProduct.profit,
        profitPercentage: updatedProduct.profitPercentage,
        tax: updatedProduct.tax,
        finalPrice: updatedProduct.finalPrice,
        details: updatedProduct,
      };
      
      const updatedCalculations = [calculation, ...calculations];
      setCalculations(updatedCalculations);
      await AsyncStorage.setItem('@calculations', JSON.stringify(updatedCalculations));
      
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      await AsyncStorage.setItem('@products', JSON.stringify(updatedProducts));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const getProduct = (productId) => {
    return products.find(p => p.id === productId);
  };

  const calculatePrice = (cost, additionalCosts, profitMargin, profitType, taxPercentage) => {
    const totalCost = parseFloat(cost || 0) + parseFloat(additionalCosts || 0);
    
    let profit = 0;
    let priceBeforeTax = 0;
    
    if (profitType === 'percentage') {
      profit = totalCost * (parseFloat(profitMargin || 0) / 100);
      priceBeforeTax = totalCost + profit;
    } else {
      profit = parseFloat(profitMargin || 0);
      priceBeforeTax = totalCost + profit;
    }
    
    // Cálculo do imposto sobre o valor final
    const finalPrice = priceBeforeTax / (1 - (parseFloat(taxPercentage || 0) / 100));
    const tax = finalPrice - priceBeforeTax;
    
    const profitPercentage = totalCost > 0 ? (profit / totalCost) * 100 : 0;
    
    return {
      baseCost: totalCost,
      profit,
      profitPercentage,
      priceBeforeTax,
      tax,
      finalPrice,
    };
  };

  return (
    <DataContext.Provider value={{
      products,
      calculations,
      loading,
      saveProduct,
      updateProduct,
      deleteProduct,
      getProduct,
      calculatePrice,
    }}>
      {children}
    </DataContext.Provider>
  );
};