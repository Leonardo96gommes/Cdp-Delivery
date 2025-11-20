'use client';

import React from 'react';

interface PromotionalBannerProps {
  title?: string;
  subtitle?: string;
  onPress?: () => void;
}

export default function PromotionalBanner({ 
  title = '30% OFF', 
  subtitle = 'Somente hoje', 
  onPress 
}: PromotionalBannerProps) {
  return (
    <div 
      onClick={onPress}
      className="mx-4 my-3 rounded-2xl overflow-hidden min-h-[150px] cursor-pointer"
      style={{
        background: 'linear-gradient(to right, #FF9800, #FFC107)'
      }}
    >
      <div className="p-5 flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
        <p className="text-white text-opacity-90 mb-4">{subtitle}</p>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onPress?.();
          }}
          className="bg-white text-orange-500 px-6 py-3 rounded-full font-semibold self-start hover:bg-gray-50 transition-colors"
        >
          Ver Promoção
        </button>
      </div>
    </div>
  );
}

