'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { IoCart } from 'react-icons/io5';

export default function FloatingCart() {
  const { getTotalItems, getTotal } = useCart();
  const itemCount = getTotalItems();
  const total = getTotal();

  if (itemCount === 0) return null;

  return (
    <Link
      href="/cart"
      className="fixed bottom-20 left-0 right-0 bg-white rounded-t-3xl shadow-lg z-40 pb-5"
    >
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex items-center flex-1">
          <IoCart className="w-6 h-6 text-yellow-400" />
          <div className="ml-3">
            <p className="text-sm text-gray-600">{itemCount} {itemCount === 1 ? 'item' : 'itens'}</p>
            <p className="text-lg font-bold text-gray-800">R$ {total.toFixed(2)}</p>
          </div>
        </div>
        <button className="bg-yellow-400 text-white px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors">
          Finalizar pedido
        </button>
      </div>
    </Link>
  );
}

