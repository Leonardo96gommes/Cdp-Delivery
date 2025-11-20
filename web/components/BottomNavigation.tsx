'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoHome, IoCart, IoReceipt } from 'react-icons/io5';
import { useCart } from '@/contexts/CartContext';

export default function BottomNavigation() {
  const pathname = usePathname();
  const { getTotalItems } = useCart();
  const itemCount = getTotalItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-colors relative ${
            pathname === '/' ? 'text-yellow-400' : 'text-gray-500'
          }`}
        >
          <IoHome className="w-6 h-6 mb-1" />
          <span className="text-xs font-semibold">Home</span>
        </Link>
        
        <Link
          href="/cart"
          className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-colors relative ${
            pathname === '/cart' ? 'text-yellow-400' : 'text-gray-500'
          }`}
        >
          <div className="relative">
            <IoCart className="w-6 h-6 mb-1" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </div>
          <span className="text-xs font-semibold">Carrinho</span>
        </Link>
        
        <Link
          href="/orders"
          className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-colors relative ${
            pathname === '/orders' ? 'text-yellow-400' : 'text-gray-500'
          }`}
        >
          <IoReceipt className="w-6 h-6 mb-1" />
          <span className="text-xs font-semibold">Pedidos</span>
        </Link>
      </div>
    </nav>
  );
}

