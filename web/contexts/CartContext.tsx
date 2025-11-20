'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Product } from '@/lib/data';

export interface CartItem extends Product {
  quantity: number;
  finalPrice: number; // Preço final calculado com tamanhos e sabores
  variations?: {
    size?: string;
    flavor?: string; // Pode conter múltiplos sabores separados por " + "
    extras?: string[];
    edge?: string;
  };
}

// Função para calcular o preço final do produto
// O preço base sempre será o menor valor (0 quando tem variações)
// O preço final será a soma das variações selecionadas
const calculateProductPrice = (product: Product, variations?: CartItem['variations']): number => {
  // Se tem promoção, usar o preço promocional como base
  let basePrice = product.basePrice;
  if (product.isPromotion && product.promotionPrice) {
    basePrice = product.promotionPrice;
  }
  
  // Sempre começar com o preço base (ou promocional)
  let price = basePrice;
  
  // Se não tem variações, retorna apenas o preço base
  if ((!product.sizes || product.sizes.length === 0) && 
      (!product.flavors || product.flavors.length === 0) && 
      (!product.edges || product.edges.length === 0)) {
    return price;
  }
  
  // Adicionar preço do tamanho selecionado
  if (variations?.size && product.sizes) {
    const selectedSize = product.sizes.find(s => s.name === variations.size);
    if (selectedSize) {
      // Se o tamanho tem promoção, usar o preço promocional
      if (selectedSize.isPromotion && selectedSize.promotionPrice !== undefined) {
        price += selectedSize.promotionPrice;
      } else {
        price += selectedSize.price;
      }
    }
  } else if (product.sizes && product.sizes.length > 0) {
    // Se não houver tamanho selecionado, usar o maior preço (considerando promoções)
    const maxSizePrice = Math.max(...product.sizes.map(s => {
      if (s.isPromotion && s.promotionPrice !== undefined) {
        return s.promotionPrice;
      }
      return s.price;
    }));
    price += maxSizePrice;
  }
  
  // Adicionar preço dos sabores selecionados (usar o maior valor)
  if (variations?.flavor && product.flavors) {
    // Pode conter múltiplos sabores separados por " + "
    const flavorNames = variations.flavor.split(' + ');
    const selectedFlavorPrices = flavorNames
      .map(flavorName => {
        const flavor = product.flavors?.find(f => f.name === flavorName);
        return flavor ? flavor.price : 0;
      })
      .filter(price => price > 0);
    
    if (selectedFlavorPrices.length > 0) {
      // Usar o maior valor entre os sabores selecionados
      price += Math.max(...selectedFlavorPrices);
    }
  } else if (product.flavors && product.flavors.length > 0) {
    // Se não houver sabor selecionado, usar o maior preço
    const maxFlavorPrice = Math.max(...product.flavors.map(f => f.price));
    price += maxFlavorPrice;
  }
  
  // Adicionar preço da borda selecionada
  if (variations?.edge && product.edges) {
    const selectedEdge = product.edges.find(e => e.name === variations.edge);
    if (selectedEdge) {
      // Se a borda tem promoção, usar o preço promocional
      if (selectedEdge.isPromotion && selectedEdge.promotionPrice !== undefined) {
        price += selectedEdge.promotionPrice;
      } else {
        price += selectedEdge.price;
      }
    }
  } else if (product.edges && product.edges.length > 0) {
    // Se não houver borda selecionada, usar o maior preço (considerando promoções)
    const maxEdgePrice = Math.max(...product.edges.map(e => {
      if (e.isPromotion && e.promotionPrice !== undefined) {
        return e.promotionPrice;
      }
      return e.price;
    }));
    price += maxEdgePrice;
  }
  
  return price;
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, variations?: CartItem['variations']) => void;
  removeFromCart: (itemId: string, variations?: CartItem['variations']) => void;
  updateQuantity: (itemId: string, quantity: number, variations?: CartItem['variations']) => void;
  clearCart: () => void;
  getTotal: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity = 1, variations?: CartItem['variations']) => {
    const finalPrice = calculateProductPrice(product, variations);
    
    setCartItems(prev => {
      const existingItem = prev.find(
        item => item.id === product.id && JSON.stringify(item.variations) === JSON.stringify(variations)
      );

      if (existingItem) {
        return prev.map(item =>
          item.id === product.id && JSON.stringify(item.variations) === JSON.stringify(variations)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { ...product, quantity, finalPrice, variations }];
    });
  };

  const removeFromCart = (itemId: string, variations?: CartItem['variations']) => {
    setCartItems(prev => prev.filter(
      item => !(item.id === itemId && JSON.stringify(item.variations) === JSON.stringify(variations))
    ));
  };

  const updateQuantity = (itemId: string, quantity: number, variations?: CartItem['variations']) => {
    if (quantity <= 0) {
      removeFromCart(itemId, variations);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId && JSON.stringify(item.variations) === JSON.stringify(variations)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + (item.finalPrice * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

