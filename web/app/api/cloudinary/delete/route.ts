import { NextRequest, NextResponse } from 'next/server';
import { deleteImageServer } from '@/lib/storage/cloudinary-server';

/**
 * API Route para deletar imagens do Cloudinary
 * 
 * Esta rota usa a SDK oficial do Cloudinary para deletar imagens
 * de forma segura no servidor.
 */

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json(
        { error: 'publicId é obrigatório' },
        { status: 400 }
      );
    }

    await deleteImageServer(publicId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar imagem' },
      { status: 500 }
    );
  }
}

