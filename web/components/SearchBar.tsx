'use client';

import React from 'react';
import { IoSearch } from 'react-icons/io5';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChangeText, placeholder = 'Buscar produtos...' }: SearchBarProps) {
  return (
    <div className="flex items-center bg-gray-100 rounded-full px-4 py-3 mx-4 my-3">
      <IoSearch className="w-5 h-5 text-gray-500 mr-3" />
      <input
        type="text"
        className="flex-1 bg-transparent text-gray-800 outline-none"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
      />
    </div>
  );
}

