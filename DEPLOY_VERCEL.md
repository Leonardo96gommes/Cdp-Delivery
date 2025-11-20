# 🚀 Guia de Deploy na Vercel

Este guia mostra como configurar corretamente o projeto NostraPizza na Vercel.

## ⚠️ Problema: Erro NOT_FOUND ou "No Next.js version detected"

O erro acontece quando a Vercel não encontra o `package.json` do Next.js porque o projeto está na pasta `web/`, mas a Vercel está procurando na raiz do repositório.

## ✅ Solução: Configurar Root Directory no Painel da Vercel

**Esta é a ÚNICA forma de resolver o problema!** Você DEVE configurar o Root Directory no painel da Vercel.

### 📸 Passo a Passo Detalhado:

#### Opção A: Se você JÁ TEM um projeto na Vercel

1. **Acesse**: https://vercel.com/dashboard
2. **Clique no seu projeto** (nome do projeto)
3. **Vá em "Settings"** (ícone de engrenagem ⚙️ no topo)
4. **No menu lateral esquerdo, clique em "General"**
5. **Role a página para baixo** até encontrar a seção **"Root Directory"**
6. **Clique no botão "Edit"** ao lado de "Root Directory"
7. **Selecione a pasta `web`**:
   - Clique no campo de texto
   - Digite: `web` (em minúsculas)
   - Ou navegue: clique em "Browse" e selecione a pasta `web`
8. **Clique em "Save"** (botão azul)
9. **IMPORTANTE**: Agora faça um **novo deploy**:
   - Vá em "Deployments" (no menu superior)
   - Clique nos **três pontinhos (...)** do último deployment
   - Selecione **"Redeploy"**
   - Ou simplesmente faça um novo commit/push (a Vercel detectará automaticamente)

#### Opção B: Se você ESTÁ CRIANDO um novo projeto

1. **Acesse**: https://vercel.com/dashboard
2. **Clique em "Add New..."** > **"Project"**
3. **Importe seu repositório** do GitHub
4. **ANTES de clicar em "Deploy"**, configure:
   - **Root Directory**: Clique em "Edit" e selecione/digite `web`
   - **Framework Preset**: Next.js (deve detectar automaticamente após configurar Root Directory)
5. **Configure as Environment Variables** (veja seção abaixo)
6. **Clique em "Deploy"**

### 🔍 Como Verificar se está Configurado Corretamente:

1. Vá em **Settings** > **General**
2. Verifique que **"Root Directory"** mostra: `web`
3. Verifique que **"Framework Preset"** mostra: `Next.js`
4. Se não estiver correto, clique em "Edit" e corrija

### ⚠️ IMPORTANTE

- **NÃO** remova essa configuração depois
- A Vercel usará a pasta `web/` como diretório raiz do projeto Next.js
- Todos os comandos (install, build, dev) serão executados dentro da pasta `web/`
- **Após configurar**, você DEVE fazer um novo deploy (não usará cache do deploy anterior)

### 🔄 Solução Alternativa (se o Root Directory não funcionar)

Um arquivo `package.json` foi criado na raiz do projeto como fallback. Isso pode ajudar a Vercel a detectar o projeto, mas **ainda é necessário configurar o Root Directory para `web`** no painel da Vercel.

**Importante**: Se você configurou o Root Directory mas ainda recebe o erro, tente:
1. Verificar se o Root Directory está realmente salvo (recarregue a página)
2. Fazer um **Redeploy** completo (não apenas um novo commit)
3. Limpar o cache do build (na Vercel, vá em Deployments > ... > Clear Build Cache)
4. Verificar se o `web/package.json` existe e contém `"next"` nas dependências

## 📋 Checklist de Deploy

### Antes do Deploy:

- [ ] **Variáveis de Ambiente Configuradas** na Vercel:
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`
  - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (opcional)
  - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (opcional)
  - `CLOUDINARY_API_KEY` (opcional)
  - `CLOUDINARY_API_SECRET` (opcional)
  - `CLOUDINARY_URL` (opcional)

- [ ] **Root Directory configurado** para `web`
- [ ] **Build Command**: Deixar padrão ou usar `npm install && npm run build`
- [ ] **Output Directory**: `.next`
- [ ] **Install Command**: `npm install`

### Como Adicionar Variáveis de Ambiente na Vercel:

1. Acesse seu projeto na Vercel
2. Vá em **Settings** > **Environment Variables**
3. Adicione cada variável uma por uma:
   - **Key**: Nome da variável (ex: `NEXT_PUBLIC_FIREBASE_API_KEY`)
   - **Value**: Valor da variável
   - **Environments**: Selecione "Production", "Preview" e "Development"
4. Clique em **Save**
5. Faça um novo deploy para aplicar as mudanças

## 🔧 Configuração Recomendada no Painel da Vercel

### Settings > General:

- **Root Directory**: `web`
- **Build Command**: (deixar vazio ou usar padrão)
- **Output Directory**: `.next`
- **Install Command**: (deixar vazio ou usar padrão)
- **Development Command**: (deixar vazio ou usar padrão)
- **Framework Preset**: Next.js

## 🐛 Troubleshooting

### Erro: "Build Failed"
- Verifique se todas as dependências estão no `package.json`
- Verifique se há erros de TypeScript no build
- Confira os logs de build na Vercel

### Erro: "Function not found" ou "404"
- Certifique-se de que o Root Directory está configurado para `web`
- Verifique se o build está gerando o diretório `.next`
- Confira se as rotas estão corretas no `app/`

### Erro: "Environment variable not found"
- Verifique se todas as variáveis de ambiente foram adicionadas
- Certifique-se de que as variáveis começam com `NEXT_PUBLIC_` quando necessário
- Faça um novo deploy após adicionar variáveis

### Páginas não encontradas (404)
- Verifique se o Root Directory está configurado corretamente
- Confira se os arquivos estão na pasta `web/app/`
- Verifique se há algum erro no build

## 📚 Recursos Adicionais

- [Documentação Vercel - Root Directory](https://vercel.com/docs/projects/overview/root-directory)
- [Documentação Vercel - Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Documentação Next.js - Deployment](https://nextjs.org/docs/deployment)

## ✨ Após o Deploy

Após configurar tudo corretamente:

1. Acesse o URL gerado pela Vercel
2. Verifique se a página inicial carrega
3. Teste as rotas principais:
   - `/` - Página inicial
   - `/cart` - Carrinho
   - `/orders` - Pedidos
   - `/admin` - Painel admin
   - `/login` - Login

Se ainda houver problemas, verifique os logs de build e runtime na Vercel.

