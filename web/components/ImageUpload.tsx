'use client';

import React, { useState, useRef } from 'react';
import { uploadImage } from '@/lib/storage/cloudinary';
import { IoCloudUploadOutline, IoClose } from 'react-icons/io5';
import Image from 'next/image';

interface ImageUploadProps {
  currentImage?: string;
  onUploadComplete: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function ImageUpload({
  currentImage,
  onUploadComplete,
  folder = 'products',
  label = 'Upload de Imagem',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validações
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    if (file.size > MAX_FILE_SIZE) {
      setError('Arquivo muito grande. Máximo: 10 MB');
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Formato não permitido. Use JPG, PNG ou WebP');
      return;
    }

    setError(null);
    setUploading(true);

    // Criar preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const result = await uploadImage(file, folder);
      setPreview(result.url);
      onUploadComplete(result.url);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao fazer upload:', err);
      const errorMessage = err?.message || 'Erro ao fazer upload da imagem. Tente novamente.';
      
      // Mensagens específicas de erro
      if (errorMessage.includes('Upload preset')) {
        setError('Upload preset não encontrado. Crie o preset "nostrapizza_upload" no Cloudinary Dashboard.');
      } else if (errorMessage.includes('Invalid signature')) {
        setError('Erro de assinatura. Verifique se o preset está configurado como "Unsigned".');
      } else if (errorMessage.includes('File size too large')) {
        setError('Arquivo muito grande. Máximo: 10 MB');
      } else {
        setError(errorMessage);
      }
      
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUploadComplete('');
    setUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setPreview(urlInput);
      onUploadComplete(urlInput);
      setShowUrlInput(false);
      setError(null);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label}
      </label>

      {preview ? (
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
          >
            <IoClose className="w-5 h-5" />
          </button>
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-white text-sm font-semibold">Enviando...</div>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
            uploading
              ? 'border-yellow-400 bg-yellow-50'
              : 'border-gray-300 hover:border-yellow-400 hover:bg-gray-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
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
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}

      {/* Opção para inserir URL manualmente */}
      <div className="mt-2">
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-blue-500 hover:text-blue-600 underline"
        >
          {showUrlInput ? 'Cancelar' : 'Ou inserir URL da imagem'}
        </button>
        
        {showUrlInput && (
          <div className="mt-2 flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              className="flex-1 bg-gray-50 rounded-lg p-2 text-sm text-gray-800 border border-gray-200 focus:border-yellow-400 outline-none"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="bg-yellow-400 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-500 transition-colors"
            >
              Usar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

