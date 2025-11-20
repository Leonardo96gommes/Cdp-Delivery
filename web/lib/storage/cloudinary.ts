'use client';

/**
 * Configuração do Cloudinary para upload de imagens
 * 
 * Plano Gratuito inclui:
 * - 25 GB de armazenamento
 * - 25 GB de largura de banda por mês
 * - Transformações de imagem ilimitadas
 * 
 * Cadastro: https://cloudinary.com/users/register_free
 */

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

export interface UploadResult {
  url: string;
  publicId: string;
  secureUrl: string;
}

/**
 * Faz upload de uma imagem para o Cloudinary usando API direta (sem SDK no cliente)
 * Para usar no cliente, precisamos usar fetch com upload_preset unsigned
 * @param file - Arquivo de imagem (File ou Blob)
 * @param folder - Pasta opcional para organizar (ex: 'products', 'categories')
 * @returns URL da imagem enviada
 */
export async function uploadImage(
  file: File | Blob,
  folder?: string
): Promise<UploadResult> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary não está configurado. Verifique as variáveis de ambiente.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  
  if (folder) {
    formData.append('folder', folder);
  }

  // Nota: eager_async não é permitido em uploads unsigned
  // As otimizações serão aplicadas pelo Upload Preset configurado no Cloudinary

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Erro ao fazer upload da imagem');
    }

    const data = await response.json();
    
    return {
      url: data.secure_url || data.url,
      publicId: data.public_id,
      secureUrl: data.secure_url,
    };
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    throw error;
  }
}

/**
 * Deleta uma imagem do Cloudinary
 * @param publicId - ID público da imagem no Cloudinary
 */
export async function deleteImage(publicId: string): Promise<void> {
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error('Cloudinary não está configurado.');
  }

  try {
    const response = await fetch(
      `/api/cloudinary/delete?publicId=${encodeURIComponent(publicId)}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao deletar imagem');
    }
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    throw error;
  }
}

/**
 * Gera URL otimizada da imagem
 * @param publicId - ID público da imagem
 * @param width - Largura desejada (opcional)
 * @param height - Altura desejada (opcional)
 * @param quality - Qualidade (1-100, padrão: auto)
 */
export function getOptimizedImageUrl(
  publicId: string,
  width?: number,
  height?: number,
  quality: number | 'auto' = 'auto'
): string {
  if (!CLOUDINARY_CLOUD_NAME) {
    return publicId; // Retorna URL original se não configurado
  }

  let url = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  
  const transformations: string[] = [];
  
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (quality === 'auto') {
    transformations.push('c_auto,f_auto,q_auto');
  } else {
    transformations.push(`q_${quality}`);
  }
  
  if (transformations.length > 0) {
    url += `/${transformations.join(',')}`;
  }
  
  url += `/${publicId}`;
  
  return url;
}

