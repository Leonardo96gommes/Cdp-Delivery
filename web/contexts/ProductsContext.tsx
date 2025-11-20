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
  // Nota: O salvamento também é feito diretamente nas funções para garantir persistência imediata
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Só salvar se não for o carregamento inicial (evitar sobrescrever com defaultProducts)
    const savedProducts = localStorage.getItem('nostrapizza_products');
    if (savedProducts && products.length > 0) {
      try {
        const parsed = JSON.parse(savedProducts);
        // Só atualizar se os produtos realmente mudaram (evitar loop)
        const currentIds = products.map(p => p.id).sort().join(',');
        const savedIds = parsed.map((p: Product) => p.id).sort().join(',');
        if (currentIds !== savedIds || JSON.stringify(products) !== savedProducts) {
          localStorage.setItem('nostrapizza_products', JSON.stringify(products));
        }
      } catch (error) {
        // Se houver erro ao comparar, salvar de qualquer forma
        localStorage.setItem('nostrapizza_products', JSON.stringify(products));
      }
    } else if (products.length > 0) {
      localStorage.setItem('nostrapizza_products', JSON.stringify(products));
    }
  }, [products]);

  const updateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    // Salvar imediatamente
    if (typeof window !== 'undefined') {
      localStorage.setItem('nostrapizza_products', JSON.stringify(newProducts));
    }
  };

  const addProduct = (product: Product) => {
    setProducts(prev => {
      const updated = [...prev, product];
      // Salvar imediatamente
      if (typeof window !== 'undefined') {
        localStorage.setItem('nostrapizza_products', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updateProduct = (productId: string, product: Product) => {
    setProducts(prev => {
      const updated = prev.map(p => p.id === productId ? product : p);
      // Salvar imediatamente
      if (typeof window !== 'undefined') {
        localStorage.setItem('nostrapizza_products', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== productId);
      // Salvar imediatamente
      if (typeof window !== 'undefined') {
        localStorage.setItem('nostrapizza_products', JSON.stringify(updated));
      }
      return updated;
    });
  };

  return (
    <ProductsContext.Provider value={{ products, updateProducts, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductsContext.Provider>
  );
};

