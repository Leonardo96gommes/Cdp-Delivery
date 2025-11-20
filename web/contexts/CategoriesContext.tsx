'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Category } from '@/lib/data';
import { categories as defaultCategories } from '@/lib/data';
import { 
  subscribeToCategories, 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  updateCategoriesOrder 
} from '@/lib/firebase/categories';

interface CategoriesContextType {
  categories: Category[];
  loading: boolean;
  updateCategories: (categories: Category[]) => Promise<void>;
  updateCategoryOrder: (categories: Category[]) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  editCategory: (id: string, category: Partial<Omit<Category, 'id'>>) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
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
  const [loading, setLoading] = useState(true);

  // Função para obter categorias excluídas do localStorage
  const getDeletedCategories = (): string[] => {
    if (typeof window === 'undefined') return [];
    try {
      const deleted = localStorage.getItem('nostrapizza_deleted_categories');
      return deleted ? JSON.parse(deleted) : [];
    } catch {
      return [];
    }
  };

  // Carregar categorias do Firebase ao inicializar
  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | null = null;

    // Primeiro, tentar carregar do Firebase
    const loadCategories = async () => {
      try {
        const firebaseCategories = await getCategories();
        if (firebaseCategories.length > 0 && isMounted) {
          // Garantir que todas as categorias tenham ordem
          const categoriesWithOrder = firebaseCategories.map((cat, index) => ({
            ...cat,
            order: cat.order ?? index,
          }));
          setCategories(categoriesWithOrder);
          setLoading(false);
        } else if (isMounted) {
          // Se não houver categorias no Firebase, usar as padrão localmente
          // mas filtrar as que foram excluídas
          const deletedIds = getDeletedCategories();
          const categoriesWithOrder = defaultCategories
            .filter(cat => !deletedIds.includes(cat.id))
            .map((cat, index) => ({
              ...cat,
              order: cat.order ?? index,
            }));
          setCategories(categoriesWithOrder);
          setLoading(false);
        }
      } catch (error) {
        console.error('Erro ao carregar categorias do Firebase:', error);
        if (isMounted) {
          // Em caso de erro, usar categorias padrão (filtrando as excluídas)
          const deletedIds = getDeletedCategories();
          const categoriesWithOrder = defaultCategories
            .filter(cat => !deletedIds.includes(cat.id))
            .map((cat, index) => ({
              ...cat,
              order: cat.order ?? index,
            }));
          setCategories(categoriesWithOrder);
          setLoading(false);
        }
      }
    };

    loadCategories();

    // Subscribir a mudanças em tempo real no Firebase
    // Usar um pequeno delay para evitar conflitos com o carregamento inicial
    const timer = setTimeout(() => {
      unsubscribe = subscribeToCategories((firebaseCategories) => {
        if (!isMounted) return;
        
        if (firebaseCategories.length > 0) {
          // Garantir que todas as categorias tenham ordem
          const categoriesWithOrder = firebaseCategories.map((cat, index) => ({
            ...cat,
            order: cat.order ?? index,
          }));
          setCategories(categoriesWithOrder);
          setLoading(false);
        } else {
          // Se não houver categorias no Firebase, usar as padrão (filtrando as excluídas)
          const deletedIds = getDeletedCategories();
          const categoriesWithOrder = defaultCategories
            .filter(cat => !deletedIds.includes(cat.id))
            .map((cat, index) => ({
              ...cat,
              order: cat.order ?? index,
            }));
          setCategories(categoriesWithOrder);
          setLoading(false);
        }
      });
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const updateCategories = async (newCategories: Category[]) => {
    try {
      // Atualizar ordem no Firebase
      const categoriesWithOrder = newCategories.map((cat, index) => ({
        ...cat,
        order: cat.order ?? index,
      }));
      await updateCategoriesOrder(categoriesWithOrder);
      // O listener em tempo real irá atualizar automaticamente
    } catch (error) {
      console.error('Erro ao atualizar categorias:', error);
      throw error;
    }
  };

  const updateCategoryOrder = async (newCategories: Category[]) => {
    try {
      const categoriesWithOrder = newCategories.map((cat, index) => ({
        ...cat,
        order: index,
      }));
      await updateCategoriesOrder(categoriesWithOrder);
      // O listener em tempo real irá atualizar automaticamente
    } catch (error) {
      console.error('Erro ao atualizar ordem das categorias:', error);
      throw error;
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      const categoryWithOrder = {
        ...category,
        order: category.order ?? categories.length,
      };
      const newId = await createCategory(categoryWithOrder);
      console.log('Categoria criada com ID:', newId);
      // O listener em tempo real irá atualizar automaticamente
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw error;
    }
  };

  const editCategory = async (id: string, category: Partial<Omit<Category, 'id'>>) => {
    try {
      console.log('Editando categoria:', id, category);
      await updateCategory(id, category);
      console.log('Categoria editada com sucesso');
      // O listener em tempo real irá atualizar automaticamente
    } catch (error) {
      console.error('Erro ao editar categoria:', error);
      throw error;
    }
  };

  const removeCategory = async (id: string) => {
    try {
      console.log('Removendo categoria do contexto:', id);
      
      // Verificar se é uma categoria padrão (IDs "1", "2", "3", "4", "5")
      const isDefaultCategory = defaultCategories.some(defCat => defCat.id === id);
      
      if (isDefaultCategory) {
        // Para categorias padrão, salvar no localStorage que foi excluída
        if (typeof window !== 'undefined') {
          try {
            const deleted = localStorage.getItem('nostrapizza_deleted_categories');
            const deletedIds: string[] = deleted ? JSON.parse(deleted) : [];
            if (!deletedIds.includes(id)) {
              deletedIds.push(id);
              localStorage.setItem('nostrapizza_deleted_categories', JSON.stringify(deletedIds));
            }
          } catch (error) {
            console.error('Erro ao salvar categoria excluída no localStorage:', error);
          }
        }
        // Remover do estado local
        setCategories(prev => prev.filter(cat => cat.id !== id));
        console.log('Categoria padrão removida do estado local e marcada como excluída');
      } else {
        // Para categorias do Firebase, tentar deletar do Firebase
        await deleteCategory(id);
        // O listener em tempo real irá atualizar automaticamente
        console.log('Categoria removida do Firebase. Aguardando atualização em tempo real...');
      }
    } catch (error) {
      console.error('Erro ao deletar categoria no contexto:', error);
      throw error;
    }
  };

  return (
    <CategoriesContext.Provider value={{ 
      categories, 
      loading,
      updateCategories, 
      updateCategoryOrder,
      addCategory,
      editCategory,
      removeCategory,
    }}>
      {children}
    </CategoriesContext.Provider>
  );
};

