'use client';

import { CldUploadButton as CloudinaryUploadButton } from 'next-cloudinary';
import { useState } from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';

interface CustomCldUploadButtonProps {
  onUploadComplete: (result: any) => void;
  folder?: string;
  label?: string;
  className?: string;
}

/**
 * Componente de upload usando next-cloudinary
 * Mais simples e integrado com Next.js
 */
export default function CustomCldUploadButton({
  onUploadComplete,
  folder = 'products',
  label = 'Upload de Imagem',
  className = '',
}: CustomCldUploadButtonProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = (result: any) => {
    if (result?.info) {
      onUploadComplete(result.info.secure_url || result.info.url);
    }
    setUploading(false);
  };

  return (
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label}
      </label>
      
      <CloudinaryUploadButton
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onUpload={(result: any) => {
          setUploading(true);
          handleUpload(result);
        }}
        options={{
          folder,
          maxFileSize: 10000000, // 10 MB
          resourceType: 'image',
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        }}
        className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
          uploading
            ? 'border-yellow-400 bg-yellow-50'
            : 'border-gray-300 hover:border-yellow-400 hover:bg-gray-50'
        }`}
      >
        {uploading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Enviando imagem...</p>
          </div>
        ) : (
          <>
            <IoCloudUploadOutline className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              Clique para fazer upload
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG ou WebP (máx. 10 MB)
            </p>
          </>
        )}
      </CloudinaryUploadButton>
    </div>
  );
}

