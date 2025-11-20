# 📸 Configuração do Cloudinary (Storage Gratuito)

Guia completo para configurar o Cloudinary como storage de imagens gratuito para o projeto NostraPizza.

## 🎯 Por que Cloudinary?

- ✅ **25 GB de armazenamento gratuito**
- ✅ **25 GB de largura de banda por mês**
- ✅ **Transformações de imagem automáticas** (redimensionamento, otimização)
- ✅ **CDN global** para imagens rápidas
- ✅ **Fácil integração** com Next.js via `next-cloudinary`
- ✅ **Sem necessidade de servidor backend** para uploads básicos

## 📦 Bibliotecas Instaladas

- `cloudinary` - SDK oficial do Cloudinary
- `next-cloudinary` - Integração otimizada com Next.js (recomendado)

## 🚀 Passo a Passo

### 1. Criar Conta no Cloudinary

1. Acesse: https://cloudinary.com/users/register_free
2. Preencha o formulário de cadastro:
   - Email
   - Nome
   - Senha
   - Nome da empresa (opcional)
3. Confirme seu email
4. Faça login no Dashboard

### 2. Obter Credenciais

Após fazer login, você verá o **Dashboard** com suas credenciais:

1. **Cloud Name**: Nome da sua conta (ex: `dmeqk8x9z`)
2. **API Key**: Chave de API (ex: `123456789012345`)
3. **API Secret**: Segredo da API (⚠️ **NÃO compartilhe publicamente**)

### 3. Criar Upload Preset

1. No Dashboard, vá em **Settings** (⚙️) > **Upload**
2. Role até a seção **Upload presets**
3. Clique em **Add upload preset**
4. Configure:
   - **Preset name**: `nostrapizza_upload` (ou qualquer nome)
   - **Signing mode**: **Unsigned** (para uploads do cliente)
   - **Folder**: `nostrapizza` (opcional, para organizar)
   - **Use filename**: ✅ Ativado
   - **Unique filename**: ✅ Ativado
   - **Overwrite**: ❌ Desativado
   - **Eager transformations**: Adicione `c_auto,f_auto,q_auto` (otimização automática)
5. Clique em **Save**

### 4. Configurar Variáveis de Ambiente

No arquivo `web/.env.local`, adicione:

```env
# Cloudinary - Storage de Imagens
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu-cloud-name-aqui
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=nostrapizza_upload

# Opcional: Para deletar imagens (requer API Secret no servidor)
CLOUDINARY_API_KEY=sua-api-key-aqui
CLOUDINARY_API_SECRET=seu-api-secret-aqui
```

⚠️ **IMPORTANTE**: 
- `NEXT_PUBLIC_*` são variáveis públicas (podem ser acessadas no cliente)
- `CLOUDINARY_API_SECRET` é privada (apenas no servidor)

### 5. Instalar Dependências (se necessário)

O Cloudinary funciona apenas com `fetch`, então não precisa de dependências extras. Mas se quiser usar a SDK oficial:

```bash
cd web
npm install cloudinary
```

## 📝 Exemplo de Uso

### Opção 1: Usando next-cloudinary (Recomendado)

#### Upload de Imagem

```typescript
import CustomCldUploadButton from '@/components/CldUploadButton';

function MyComponent() {
  const handleUploadComplete = (url: string) => {
    console.log('Imagem enviada:', url);
    // Use a URL para salvar no banco de dados
  };

  return (
    <CustomCldUploadButton
      onUploadComplete={handleUploadComplete}
      folder="products"
      label="Upload de Produto"
    />
  );
}
```

#### Exibir Imagem Otimizada

```typescript
import CldImageWrapper from '@/components/CldImageWrapper';

function ProductImage({ publicId }: { publicId: string }) {
  return (
    <CldImageWrapper
      src={publicId}
      width={500}
      height={500}
      alt="Produto"
      crop={{
        type: 'auto',
        source: true,
      }}
    />
  );
}
```

### Opção 2: Usando funções manuais

#### Upload de Imagem

```typescript
import { uploadImage } from '@/lib/storage/cloudinary';

const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const result = await uploadImage(file, 'products');
    console.log('Imagem enviada:', result.url);
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
  }
};
```

#### Obter URL Otimizada

```typescript
import { getOptimizedImageUrl } from '@/lib/storage/cloudinary';

const thumbnailUrl = getOptimizedImageUrl('products/pizza-123', 200, 200);
const desktopUrl = getOptimizedImageUrl('products/pizza-123', 800);
```

## 🎨 Transformações Automáticas

O Cloudinary aplica automaticamente:
- **c_auto**: Crop automático inteligente
- **f_auto**: Formato automático (WebP quando suportado)
- **q_auto**: Qualidade automática otimizada

## 📊 Limites do Plano Gratuito

- ✅ **25 GB** de armazenamento
- ✅ **25 GB** de largura de banda/mês
- ✅ **Transformações ilimitadas**
- ✅ **CDN global**
- ⚠️ Após exceder, pode haver cobrança ou limitação

## 🔐 Segurança

### Upload Preset Unsigned

O preset configurado como **Unsigned** permite uploads diretos do cliente sem autenticação. Isso é seguro porque:
- O preset limita o que pode ser enviado
- Você pode configurar tamanho máximo de arquivo
- Pode restringir formatos de imagem

### Para Produção

1. Configure limites no Upload Preset:
   - **Max file size**: 10 MB (ou conforme necessário)
   - **Allowed formats**: `jpg, png, webp`
   - **Max image width**: 2000px
   - **Max image height**: 2000px

2. Adicione validação no frontend:
```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

if (file.size > MAX_FILE_SIZE) {
  alert('Arquivo muito grande. Máximo: 10 MB');
  return;
}

if (!ALLOWED_TYPES.includes(file.type)) {
  alert('Formato não permitido. Use JPG, PNG ou WebP');
  return;
}
```

## 🆘 Troubleshooting

### Erro: "Upload preset not found"
- Verifique se o nome do preset está correto em `.env.local`
- Certifique-se de que o preset está configurado como **Unsigned**

### Erro: "Invalid API key"
- Verifique se as credenciais estão corretas
- Certifique-se de que está usando o Cloud Name correto

### Imagens não carregam
- Verifique se a URL está correta
- Verifique as regras de CORS no Cloudinary (Settings > Security)
- Certifique-se de que o domínio está permitido

## 📚 Documentação

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Upload Presets](https://cloudinary.com/documentation/upload_presets)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)

## 🔄 Alternativas Gratuitas

Se preferir outras opções:

1. **ImgBB** - API simples, sem cadastro complexo
2. **ImageKit** - Similar ao Cloudinary
3. **Supabase Storage** - Se já usar Supabase
4. **AWS S3** - Tier gratuito (12 meses)

---

✅ **Pronto!** Agora você tem um storage gratuito configurado para suas imagens!

