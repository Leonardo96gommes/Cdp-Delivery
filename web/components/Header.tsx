'use client';

import React from 'react';
import Image from 'next/image';
import { useStoreSettings } from '@/contexts/StoreSettingsContext';

interface HeaderProps {
  storeName?: string;
  isOpen?: boolean;
}

export default function Header({ storeName: propStoreName, isOpen: propIsOpen }: HeaderProps) {
  const { settings, loading } = useStoreSettings();
  
  // Usar valores do Firebase se disponíveis, senão usar props ou valores padrão
  const storeName = settings?.storeName || propStoreName || 'NostraPizza';
  const isOpen = settings?.isOpen ?? propIsOpen ?? true;

  return (
    <header className="bg-white border-b border-gray-100 px-4 pt-12 pb-3">
      <div className="flex flex-col items-center justify-center text-center">
        {/* Logo da Loja */}
        {settings?.logo && (
          <div className="mb-3 relative h-24 w-24">
            <Image
              src={settings.logo}
              alt={storeName}
              fill
              className="object-cover rounded-full"
              priority
            />
          </div>
        )}
        <h1 className="text-xl font-bold text-gray-800 mb-1">{storeName}</h1>
        {!loading && (
          <div className="flex flex-col items-center gap-1 justify-center">
            <div className="flex items-center gap-2 justify-center">
              <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-600">{isOpen ? 'Aberto agora' : 'Fechado'}</span>
            </div>
            {!isOpen && settings?.openingTime && settings?.closingTime && (
              <span className="text-xs text-gray-500">
                Funcionamento: {settings.openingTime} às {settings.closingTime}
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

