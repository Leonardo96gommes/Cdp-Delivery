'use client';

import React from 'react';

interface PromotionalBannerProps {
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  hasPromotions?: boolean;
}

export default function PromotionalBanner({ 
  title = '30% OFF', 
  subtitle = 'Somente hoje', 
  onPress,
  hasPromotions = false
}: PromotionalBannerProps) {
  return (
    <div 
      onClick={onPress}
      className="mx-4 my-3 rounded-2xl overflow-hidden min-h-[150px] cursor-pointer relative"
      style={{
        background: 'linear-gradient(to right, #FF9800, #FFC107)'
      }}
    >
      {/* Badge PROMO */}
      {hasPromotions && (
        <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10 animate-pulse">
          PROMO
        </div>
      )}
      
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

