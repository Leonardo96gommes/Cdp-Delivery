# 🚀 Guia de Deploy na Vercel

Este guia mostra como fazer deploy do projeto NostraPizza na Vercel.

## ✅ Deploy Simples

Agora que o projeto está na raiz do repositório, o deploy na Vercel é muito simples!

### Passo a Passo:

1. **Acesse**: https://vercel.com/dashboard
2. **Clique em "Add New..."** > **"Project"**
3. **Importe seu repositório** do GitHub
   - Selecione o repositório `Cdp-Delivery` (ou seu repositório)
4. **Configure o projeto**:
   - **Framework Preset**: Next.js (deve ser detectado automaticamente)
   - **Root Directory**: Deixe **VAZIO** (o projeto está na raiz)
   - **Build Command**: Deixe padrão (`npm run build`)
   - **Output Directory**: Deixe padrão (`.next`)
5. **Configure as Variáveis de Ambiente** (veja seção abaixo)
6. **Clique em "Deploy"**

### ⚙️ Configuração Recomendada:

- **Framework Preset**: Next.js ✅
- **Root Directory**: (vazio) ✅
- **Build Command**: (deixar padrão)
- **Output Directory**: `.next` (padrão)
- **Install Command**: (deixar padrão)

## 📋 Variáveis de Ambiente

### Antes do Deploy:

Configure todas as variáveis de ambiente na Vercel:

1. **Acesse seu projeto** na Vercel
2. **Vá em Settings** > **Environment Variables**
3. **Adicione cada variável** uma por uma:

#### Firebase (Obrigatórias):
```
NEXT_PUBLIC_FIREBASE_API_KEY=sua-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=seu-app-id
```

#### Cloudinary (Opcionais):
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=seu-upload-preset
CLOUDINARY_API_KEY=sua-api-key
CLOUDINARY_API_SECRET=seu-api-secret
CLOUDINARY_URL=cloudinary://api-key:api-secret@cloud-name
```

4. **Marque todas para**: Production, Preview e Development
5. **Clique em "Save"** para cada variável
6. **Faça um novo deploy** para aplicar as mudanças

### Como Adicionar Variáveis de Ambiente na Vercel:

1. No painel do projeto, vá em **Settings** > **Environment Variables**
2. Clique em **"Add New"**
3. Preencha:
   - **Key**: Nome da variável (ex: `NEXT_PUBLIC_FIREBASE_API_KEY`)
   - **Value**: Valor da variável
   - **Environments**: Marque "Production", "Preview" e "Development"
4. Clique em **Save**
5. Repita para cada variável

## 🔧 Pós-Deploy

Após o deploy:

1. Acesse o URL gerado pela Vercel
2. Verifique se a página inicial carrega
3. Teste as rotas principais:
   - `/` - Página inicial
   - `/cart` - Carrinho
   - `/orders` - Pedidos
   - `/admin` - Painel admin
   - `/login` - Login

## 🐛 Troubleshooting

### Erro: "Build Failed"
- Verifique se todas as dependências estão no `package.json`
- Verifique se há erros de TypeScript no build
- Confira os logs de build na Vercel (clique no deployment)

### Erro: "Environment variable not found"
- Verifique se todas as variáveis de ambiente foram adicionadas
- Certifique-se de que as variáveis começam com `NEXT_PUBLIC_` quando necessário
- Faça um novo deploy após adicionar variáveis

### Erro: "Function not found" ou "404"
- Verifique se o Framework Preset está configurado como "Next.js"
- Verifique se o Root Directory está **VAZIO** (não preenchido)
- Confira se as rotas estão corretas no `app/`

### Páginas não encontradas (404)
- Verifique se o Framework Preset está correto
- Confira se os arquivos estão na pasta `app/`
- Verifique se há algum erro no build

## 📚 Recursos Adicionais

- [Documentação Vercel - Deploy Next.js](https://vercel.com/docs/frameworks/nextjs)
- [Documentação Vercel - Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Documentação Next.js - Deployment](https://nextjs.org/docs/deployment)

## ✨ Vantagens da Nova Estrutura

- ✅ **Deploy mais simples**: Não precisa configurar Root Directory
- ✅ **Menos erros**: Evita problemas de caminhos e configurações
- ✅ **Detecção automática**: A Vercel detecta Next.js automaticamente
- ✅ **Build mais rápido**: Menos overhead de configuração

---

**Nota**: Se você estava usando o projeto antes com a pasta `web/`, agora tudo está na raiz. Isso simplifica muito o deploy e evita problemas de configuração!
