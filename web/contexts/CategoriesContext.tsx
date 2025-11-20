'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Category } from '@/lib/data';
import { categories as defaultCategories } from '@/lib/data';

interface CategoriesContextType {
  categories: Category[];
  updateCategories: (categories: Category[]) => void;
  updateCategoryOrder: (categories: Category[]) => void;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within CategoriesProvider');
  }
  return context;
};

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);

  // Carregar categorias do localStorage ao inicializar
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedCategories = localStorage.getItem('nostrapizza_categories');
    if (savedCategories) {
      try {
        const parsed = JSON.parse(savedCategories);
        // Garantir que todas as categorias tenham ordem
        const categoriesWithOrder = parsed.map((cat: Category, index: number) => ({
          ...cat,
          order: cat.order ?? index,
        }));
        setCategories(categoriesWithOrder);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    } else {
      // Se não houver categorias salvas, usar as padrão com ordem
      const categoriesWithOrder = defaultCategories.map((cat, index) => ({
        ...cat,
        order: cat.order ?? index,
      }));
      setCategories(categoriesWithOrder);
      localStorage.setItem('nostrapizza_categories', JSON.stringify(categoriesWithOrder));
    }
  }, []);

  // Listener para sincronizar mudanças entre abas
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'nostrapizza_categories' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const categoriesWithOrder = parsed.map((cat: Category, index: number) => ({
            ...cat,
            order: cat.order ?? index,
          }));
          setCategories(categoriesWithOrder);
        } catch (error) {
          console.error('Erro ao sincronizar categorias:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Salvar categorias no localStorage sempre que houver mudanças
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('nostrapizza_categories', JSON.stringify(categories));
  }, [categories]);

  const updateCategories = (newCategories: Category[]) => {
    const categoriesWithOrder = newCategories.map((cat, index) => ({
      ...cat,
      order: cat.order ?? index,
    }));
    setCategories(categoriesWithOrder);
  };

  const updateCategoryOrder = (newCategories: Category[]) => {
    const categoriesWithOrder = newCategories.map((cat, index) => ({
      ...cat,
      order: index,
    }));
    setCategories(categoriesWithOrder);
  };

  return (
    <CategoriesContext.Provider value={{ categories, updateCategories, updateCategoryOrder }}>
      {children}
    </CategoriesContext.Provider>
  );
};

