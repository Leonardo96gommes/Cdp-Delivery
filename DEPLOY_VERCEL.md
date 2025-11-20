# 🚀 Guia de Deploy na Vercel

Este guia mostra como configurar corretamente o projeto NostraPizza na Vercel.

## ⚠️ Problema: Erro NOT_FOUND

O erro `NOT_FOUND` acontece quando a Vercel não encontra o diretório raiz do projeto Next.js. Como o projeto está na pasta `web/`, é necessário configurar isso na Vercel.

## ✅ Solução 1: Configurar Root Directory no Painel da Vercel (Recomendado)

1. **Acesse o painel da Vercel**: https://vercel.com/dashboard
2. **Selecione seu projeto**
3. **Vá em Settings** (Configurações)
4. **No menu lateral, clique em "General"**
5. **Role até a seção "Root Directory"**
6. **Clique em "Edit"**
7. **Selecione ou digite**: `web`
8. **Clique em "Save"**
9. **Faça um novo deploy** (ou aguarde o deploy automático)

## ✅ Solução 2: Usar arquivo vercel.json (Já criado)

Um arquivo `vercel.json` já foi criado na raiz do projeto com as configurações básicas. Certifique-se de que está configurado assim:

```json
{
  "buildCommand": "cd web && npm install && npm run build",
  "outputDirectory": "web/.next",
  "framework": "nextjs"
}
```

**Importante**: Se você usar esta solução, ainda é recomendado configurar o "Root Directory" no painel da Vercel.

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

