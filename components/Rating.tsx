'use client';

import React from 'react';
import { IoStar } from 'react-icons/io5';

interface RatingProps {
  rating?: number;
  showNumber?: boolean;
  size?: number;
}

export default function Rating({ rating = 4.8, showNumber = true, size = 14 }: RatingProps) {
  return (
    <div className="flex items-center gap-1">
      <IoStar className="text-yellow-400" size={size} />
      {showNumber && <span className="text-gray-800 font-semibold" style={{ fontSize: size }}>{rating}</span>}
    </div>
  );
}

