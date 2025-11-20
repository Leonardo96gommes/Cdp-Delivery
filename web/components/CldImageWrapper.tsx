'use client';

import { CldImage } from 'next-cloudinary';

interface CldImageWrapperProps {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
  className?: string;
  crop?: {
    type?: string;
    source?: boolean;
  };
  quality?: 'auto' | number;
  fetchFormat?: 'auto' | 'webp' | 'jpg' | 'png';
  [key: string]: any; // Para permitir outras props do CldImage
}

/**
 * Wrapper para CldImage do next-cloudinary
 * Aplica otimizações automáticas por padrão
 */
export default function CldImageWrapper({
  src,
  width,
  height,
  alt = '',
  className = '',
  crop,
  quality = 'auto',
  fetchFormat = 'auto',
  ...props
}: CldImageWrapperProps) {
  // Se a imagem não é do Cloudinary (URL externa), usar Image normal
  if (src.startsWith('http') && !src.includes('cloudinary.com')) {
    // Para imagens externas, você pode usar next/image
    const Image = require('next/image').default;
    return (
      <Image
        src={src}
        width={width}
        height={height}
        alt={alt}
        className={className}
        {...props}
      />
    );
  }

  // Extrair public_id da URL do Cloudinary se necessário
  let publicId = src;
  if (src.includes('cloudinary.com')) {
    // Extrair public_id de uma URL completa do Cloudinary
    const match = src.match(/\/v\d+\/(.+)$/);
    if (match) {
      publicId = match[1].replace(/\.(jpg|jpeg|png|webp)$/i, '');
    }
  }

  return (
    <CldImage
      src={publicId}
      width={width}
      height={height}
      alt={alt}
      className={className}
      crop={crop || { type: 'auto', source: true }}
      quality={quality}
      format={fetchFormat}
      {...props}
    />
  );
}

