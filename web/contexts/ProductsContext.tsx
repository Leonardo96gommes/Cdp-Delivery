'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/data';
import { products as defaultProducts } from '@/lib/data';

interface ProductsContextType {
  products: Product[];
  updateProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (productId: string, product: Product) => void;
  deleteProduct: (productId: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductsProvider');
  }
  return context;
};

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(defaultProducts);

  // Carregar produtos do localStorage ao inicializar
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedProducts = localStorage.getItem('nostrapizza_products');
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);
        setProducts(parsed);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        setProducts(defaultProducts);
        localStorage.setItem('nostrapizza_products', JSON.stringify(defaultProducts));
      }
    } else {
      // Se não houver produtos salvos, usar os padrão e salvar
      setProducts(defaultProducts);
      localStorage.setItem('nostrapizza_products', JSON.stringify(defaultProducts));
    }
  }, []);

  // Listener para sincronizar mudanças entre abas
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'nostrapizza_products' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setProducts(parsed);
        } catch (error) {
          console.error('Erro ao sincronizar produtos:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Salvar produtos no localStorage sempre que houver mudanças
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (products.length > 0) {
      localStorage.setItem('nostrapizza_products', JSON.stringify(products));
    }
  }, [products]);

  const updateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
  };

  const addProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  const updateProduct = (productId: string, product: Product) => {
    setProducts(products.map(p => p.id === productId ? product : p));
  };

  const deleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  return (
    <ProductsContext.Provider value={{ products, updateProducts, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductsContext.Provider>
  );
};

