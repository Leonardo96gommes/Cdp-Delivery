/**
 * Configuração do Cloudinary para uso no servidor (API Routes)
 * 
 * Use esta versão apenas em API Routes ou Server Components
 * Para uploads no cliente, use a função uploadImage de cloudinary.ts
 */

import { v2 as cloudinary } from 'cloudinary';

// Configuração do Cloudinary
// A SDK do Cloudinary detecta automaticamente CLOUDINARY_URL se disponível
// Caso contrário, usa variáveis individuais
if (!process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
  });
}
// Se CLOUDINARY_URL estiver definida, a SDK a detecta automaticamente

export interface UploadResult {
  url: string;
  publicId: string;
  secureUrl: string;
}

/**
 * Faz upload de uma imagem para o Cloudinary (versão servidor)
 * @param filePath - Caminho do arquivo ou URL da imagem
 * @param options - Opções de upload (folder, public_id, etc)
 * @returns Resultado do upload
 */
export async function uploadImageServer(
  filePath: string,
  options?: {
    folder?: string;
    publicId?: string;
    transformation?: any;
  }
): Promise<UploadResult> {
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: options?.folder,
      public_id: options?.publicId,
      eager: options?.transformation || [
        { fetch_format: 'auto', quality: 'auto' }
      ],
      ...options,
    });

    return {
      url: uploadResult.secure_url || uploadResult.url,
      publicId: uploadResult.public_id,
      secureUrl: uploadResult.secure_url,
    };
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    throw error;
  }
}

/**
 * Deleta uma imagem do Cloudinary
 * @param publicId - ID público da imagem
 */
export async function deleteImageServer(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    throw error;
  }
}

/**
 * Gera URL otimizada da imagem
 * @param publicId - ID público da imagem
 * @param options - Opções de transformação
 */
export function getOptimizedImageUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    gravity?: string;
    quality?: string | number;
    fetchFormat?: string;
  }
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
  
  if (!cloudName) {
    return publicId; // Retorna URL original se não configurado
  }

  const transformOptions: any = {
    fetch_format: options?.fetchFormat || 'auto',
    quality: options?.quality || 'auto',
  };

  if (options?.width) transformOptions.width = options.width;
  if (options?.height) transformOptions.height = options.height;
  if (options?.crop) transformOptions.crop = options.crop;
  if (options?.gravity) transformOptions.gravity = options.gravity;

  return cloudinary.url(publicId, transformOptions);
}

/**
 * Transforma uma imagem existente
 * @param publicId - ID público da imagem
 * @param transformation - Objeto de transformação
 */
export function transformImage(
  publicId: string,
  transformation: {
    width?: number;
    height?: number;
    crop?: string;
    gravity?: string;
    quality?: string | number;
    fetchFormat?: string;
  }
): string {
  return cloudinary.url(publicId, {
    fetch_format: transformation.fetchFormat || 'auto',
    quality: transformation.quality || 'auto',
    width: transformation.width,
    height: transformation.height,
    crop: transformation.crop || 'auto',
    gravity: transformation.gravity || 'auto',
  });
}

export { cloudinary };

