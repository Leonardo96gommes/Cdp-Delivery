'use client';

import React from 'react';

interface CategoryChipProps {
  name: string;
  isSelected: boolean;
  onPress: () => void;
  color?: string;
}

export default function CategoryChip({ name, isSelected, onPress, color = '#FFC107' }: CategoryChipProps) {
  return (
    <button
      onClick={onPress}
      className={`px-5 py-2.5 rounded-full mr-2.5 font-semibold text-sm transition-colors ${
        isSelected 
          ? 'text-white' 
          : 'bg-gray-100 text-gray-600'
      }`}
      style={isSelected ? { backgroundColor: color } : {}}
    >
      {name}
    </button>
  );
}

