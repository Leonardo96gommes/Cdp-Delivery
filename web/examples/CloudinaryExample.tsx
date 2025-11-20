'use client';

import CldImageWrapper from '@/components/CldImageWrapper';
import CustomCldUploadButton from '@/components/CldUploadButton';

/**
 * Exemplo de uso do next-cloudinary
 */
export default function CloudinaryExample() {
  const handleUploadComplete = (url: string) => {
    console.log('Imagem enviada:', url);
    // Use a URL para salvar no banco de dados
  };

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold">Exemplos de Cloudinary</h1>

      {/* Exemplo 1: Upload de Imagem */}
      <section>
        <h2 className="text-xl font-semibold mb-4">1. Upload de Imagem</h2>
        <CustomCldUploadButton
          onUploadComplete={handleUploadComplete}
          folder="products"
          label="Upload de Produto"
        />
      </section>

      {/* Exemplo 2: Exibir Imagem Otimizada */}
      <section>
        <h2 className="text-xl font-semibold mb-4">2. Imagem Otimizada</h2>
        <div className="space-y-4">
          {/* Imagem com auto-crop */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Auto-crop (500x500):</p>
            <CldImageWrapper
              src="cld-sample-5" // Use seu public_id aqui
              width={500}
              height={500}
              alt="Exemplo de imagem"
              crop={{
                type: 'auto',
                source: true,
              }}
            />
          </div>

          {/* Imagem com qualidade automática */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Qualidade automática:</p>
            <CldImageWrapper
              src="cld-sample-5"
              width={800}
              height={600}
              alt="Exemplo de imagem"
              quality="auto"
              fetchFormat="auto"
            />
          </div>
        </div>
      </section>

      {/* Exemplo 3: Usando CldImage diretamente */}
      <section>
        <h2 className="text-xl font-semibold mb-4">3. Uso Direto do CldImage</h2>
        <p className="text-sm text-gray-600 mb-2">
          Você também pode usar CldImage diretamente do next-cloudinary:
        </p>
        <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
          {`import { CldImage } from 'next-cloudinary';

<CldImage
  src="cld-sample-5"
  width="500"
  height="500"
  crop={{
    type: 'auto',
    source: true
  }}
/>`}
        </pre>
      </section>
    </div>
  );
}

