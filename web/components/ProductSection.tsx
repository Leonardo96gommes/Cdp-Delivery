'use client';

import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/lib/data';

interface ProductSectionProps {
  title: string;
  color: string;
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export default function ProductSection({
  title,
  color,
  products,
  onAddToCart,
}: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <div className="mt-6 mb-8">
      {/* Título centralizado */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: color }}
        />
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
      
      {/* Grid de produtos centralizado */}
      <div className="flex justify-center">
        <div className="grid grid-cols-2 gap-x-2 gap-y-4 px-2 md:grid-cols-3 lg:grid-cols-4 md:gap-2 max-w-7xl w-full items-stretch">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => onAddToCart(product)}
              onClick={() => onAddToCart(product)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

