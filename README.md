# NostraPizza - Web App (Next.js + Tailwind)

Versão web do aplicativo de cardápio delivery construída com Next.js 15 e Tailwind CSS.

## 🚀 Tecnologias

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **React Icons** - Ícones
- **Context API** - Gerenciamento de estado do carrinho

## 📁 Estrutura do Projeto

```
web/
├── app/                    # App Router do Next.js
│   ├── page.tsx           # Página inicial (Home)
│   ├── cart/              # Página do carrinho
│   ├── product/[id]/      # Página de detalhes do produto
│   ├── admin/             # Painel administrativo
│   ├── layout.tsx         # Layout principal
│   └── globals.css        # Estilos globais
├── components/            # Componentes reutilizáveis
│   ├── Header.tsx
│   ├── SearchBar.tsx
│   ├── CategoryChip.tsx
│   ├── ProductCard.tsx
│   ├── PromotionalBanner.tsx
│   ├── Rating.tsx
│   └── FloatingCart.tsx
├── contexts/              # Context API
│   └── CartContext.tsx
└── lib/                   # Utilitários e dados
    └── data.ts
```

## 🎨 Funcionalidades

### ✅ Implementado

- ✅ Tela Home com produtos, categorias e busca
- ✅ Página de detalhes do produto com variações
- ✅ Carrinho de compras completo
- ✅ Painel administrativo
- ✅ Design responsivo com Tailwind CSS
- ✅ Context API para gerenciamento de estado
- ✅ Integração com WhatsApp para pedidos

## 🚀 Como Executar

```bash
# Navegar para a pasta web
cd web

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar produção
npm start
```

O app estará disponível em: **http://localhost:3000**

## 📱 Páginas

- **/** - Home (lista de produtos)
- **/product/[id]** - Detalhes do produto
- **/cart** - Carrinho de compras
- **/admin** - Painel administrativo

## 🎯 Próximos Passos

- [ ] Integração com backend/API
- [ ] Autenticação de usuários
- [ ] Histórico de pedidos
- [ ] Sistema de avaliações
- [ ] Pagamento online
- [ ] PWA (Progressive Web App)

## 🔧 Configuração

### WhatsApp

Configure o número do WhatsApp no arquivo `web/app/cart/page.tsx`:

```typescript
const whatsappNumber = '5511999999999'; // Seu número aqui
```

### Imagens

As imagens estão configuradas para aceitar URLs do Unsplash. Para adicionar outros domínios, edite `web/next.config.ts`.

