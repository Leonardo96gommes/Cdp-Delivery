'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '@/lib/data';

// Função para calcular o preço mínimo do produto (para exibição)
// O preço base sempre será o menor valor possível
const calculateMinPrice = (product: Product): number => {
  let basePrice = product.basePrice;
  
  // Se tem promoção, usar o preço promocional como base
  if (product.isPromotion && product.promotionPrice) {
    basePrice = product.promotionPrice;
  }
  
  // Se não tem variações, retorna apenas o preço base (ou promocional)
  if ((!product.sizes || product.sizes.length === 0) && 
      (!product.flavors || product.flavors.length === 0) && 
      (!product.edges || product.edges.length === 0)) {
    return basePrice;
  }
  
  // Se tem variações, o preço base é sempre 0 (menor valor)
  // e somamos apenas as menores variações (considerando promoções)
  const minSizePrice = product.sizes?.length ? Math.min(...product.sizes.map(s => {
    if (s.isPromotion && s.promotionPrice !== undefined) {
      return s.promotionPrice;
    }
    return s.price;
  })) : 0;
  const minFlavorPrice = product.flavors?.length ? Math.min(...product.flavors.map(f => f.price)) : 0;
  const minEdgePrice = product.edges?.length ? Math.min(...product.edges.map(e => {
    if (e.isPromotion && e.promotionPrice !== undefined) {
      return e.promotionPrice;
    }
    return e.price;
  })) : 0;
  
  // O preço base é sempre o menor valor (0 quando tem variações)
  // e o menor preço total será a soma das menores variações
  return minSizePrice + minFlavorPrice + minEdgePrice;
};

// Verificar se o produto tem variações de preço
const hasPriceVariations = (product: Product): boolean => {
  const hasSizes = product.sizes && product.sizes.length > 0;
  const hasFlavors = product.flavors && product.flavors.length > 0;
  const hasEdges = product.edges && product.edges.length > 0;
  return hasSizes || hasFlavors || hasEdges;
};

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
  isHorizontal?: boolean;
  onClick?: () => void;
}

export default function ProductCard({ product, onAddToCart, isHorizontal = false, onClick }: ProductCardProps) {
  if (isHorizontal) {
    return (
      <div 
        onClick={onClick}
        className="flex bg-white rounded-xl mx-4 mb-3 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative"
      >
        {product.isPromotion && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
            PROMOÇÃO
          </div>
        )}
        <Image
          src={product.image}
          alt={product.name}
          width={80}
          height={80}
          className="rounded-xl object-cover"
        />
        <div className="flex-1 ml-3 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-800 line-clamp-1">{product.name}</h3>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-col">
              {hasPriceVariations(product) && (
                <span className="text-xs text-gray-500">A partir de</span>
              )}
              <div className="flex items-center gap-2">
                {product.isPromotion && product.promotionPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    R$ {product.basePrice.toFixed(2)}
                  </span>
                )}
                <span className={`text-base font-bold ${product.isPromotion ? 'text-orange-500' : 'text-gray-800'}`}>
                  R$ {calculateMinPrice(product).toFixed(2)}
                </span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                onAddToCart?.();
              }}
              className="bg-yellow-400 text-white px-4 py-1.5 rounded-full font-semibold text-sm hover:bg-yellow-500 transition-colors"
            >
              Pedir
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl w-full shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer relative"
    >
      {product.isPromotion && (
        <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
          PROMOÇÃO
        </div>
      )}
      <Image
        src={product.image}
        alt={product.name}
        width={180}
        height={140}
        className="w-full h-[140px] md:h-[180px] object-cover"
      />
      <div className="p-2 md:p-3">
        <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col">
            {hasPriceVariations(product) && (
              <span className="text-xs text-gray-500">A partir de</span>
            )}
            <div className="flex items-center gap-2">
              {product.isPromotion && product.promotionPrice && (
                <span className="text-xs text-gray-400 line-through">
                  R$ {product.basePrice.toFixed(2)}
                </span>
              )}
              <span className={`text-base md:text-lg font-bold ${product.isPromotion ? 'text-orange-500' : 'text-gray-800'}`}>
                R$ {calculateMinPrice(product).toFixed(2)}
              </span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              onAddToCart?.();
            }}
            className="bg-yellow-400 text-white px-3 py-1.5 rounded-full font-semibold text-xs md:text-sm hover:bg-yellow-500 transition-colors w-full md:w-auto"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}

