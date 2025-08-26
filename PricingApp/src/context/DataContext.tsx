import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, Calculation } from '../components';

interface DataContextType {
  products: Product[];
  calculations: Calculation[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCalculation: (calculation: Omit<Calculation, 'id' | 'createdAt'>) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const PRODUCTS_KEY = '@PricingApp:products';
  const CALCULATIONS_KEY = '@PricingApp:calculations';

  // Load data on app start
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      const [productsData, calculationsData] = await Promise.all([
        AsyncStorage.getItem(PRODUCTS_KEY),
        AsyncStorage.getItem(CALCULATIONS_KEY),
      ]);

      if (productsData) {
        const parsedProducts = JSON.parse(productsData).map((product: any) => ({
          ...product,
          createdAt: new Date(product.createdAt),
        }));
        setProducts(parsedProducts);
      }

      if (calculationsData) {
        const parsedCalculations = JSON.parse(calculationsData).map((calculation: any) => ({
          ...calculation,
          createdAt: new Date(calculation.createdAt),
        }));
        setCalculations(parsedCalculations);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProducts = async (newProducts: Product[]) => {
    try {
      await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(newProducts));
    } catch (error) {
      console.error('Error saving products:', error);
    }
  };

  const saveCalculations = async (newCalculations: Calculation[]) => {
    try {
      await AsyncStorage.setItem(CALCULATIONS_KEY, JSON.stringify(newCalculations));
    } catch (error) {
      console.error('Error saving calculations:', error);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    const updatedProducts = [newProduct, ...products];
    setProducts(updatedProducts);
    await saveProducts(updatedProducts);

    // Also add to calculations history
    await addCalculation({
      productName: newProduct.name,
      baseCost: newProduct.baseCost,
      profit: newProduct.profitType === 'percentage' 
        ? (newProduct.baseCost + newProduct.additionalCosts.reduce((sum, cost) => sum + cost, 0)) * (newProduct.profitMargin / 100)
        : newProduct.profitMargin,
      profitPercentage: newProduct.profitType === 'percentage' 
        ? newProduct.profitMargin
        : (newProduct.profitMargin / (newProduct.baseCost + newProduct.additionalCosts.reduce((sum, cost) => sum + cost, 0))) * 100,
      tax: newProduct.finalPrice * (newProduct.taxPercentage / 100),
      finalPrice: newProduct.finalPrice,
    });
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    const updatedProducts = products.map(product =>
      product.id === id ? { ...product, ...productData } : product
    );
    setProducts(updatedProducts);
    await saveProducts(updatedProducts);
  };

  const deleteProduct = async (id: string) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    await saveProducts(updatedProducts);
  };

  const addCalculation = async (calculationData: Omit<Calculation, 'id' | 'createdAt'>) => {
    const newCalculation: Calculation = {
      ...calculationData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    const updatedCalculations = [newCalculation, ...calculations];
    setCalculations(updatedCalculations);
    await saveCalculations(updatedCalculations);
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find(product => product.id === id);
  };

  return (
    <DataContext.Provider
      value={{
        products,
        calculations,
        addProduct,
        updateProduct,
        deleteProduct,
        addCalculation,
        getProductById,
        isLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};