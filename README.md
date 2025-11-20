# 🍕 NostraPizza - Plataforma Completa de Delivery

> Sistema profissional de delivery online com painel administrativo, integração Firebase e Cloudinary

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.10-orange?logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Demonstração](#demonstração)
- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Uso](#uso)
- [Deploy](#deploy)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## 🎯 Sobre o Projeto

NostraPizza é uma plataforma completa para delivery de alimentos, desenvolvida com as mais modernas tecnologias web. O sistema oferece uma experiência fluida tanto para clientes quanto para administradores, com design responsivo e recursos avançados de gerenciamento.

### ✨ Diferenciais

- 🎨 **Design Moderno**: Interface limpa e intuitiva inspirada em Uber Eats e iFood
- 📱 **Totalmente Responsivo**: Funciona perfeitamente em mobile, tablet e desktop
- ⚡ **Performance Otimizada**: Next.js 16 com otimizações automáticas de imagem
- 🔥 **Tempo Real**: Sincronização instantânea com Firebase
- 🖼️ **Upload de Imagens**: Integração com Cloudinary para armazenamento otimizado
- 🛒 **Carrinho Inteligente**: Gerenciamento de variações e cálculo automático de preços
- 📊 **Dashboard Completo**: Estatísticas em tempo real e gerenciamento de pedidos

## 🎬 Demonstração

### Cliente
- **Home**: Catálogo de produtos com categorias e promoções
- **Carrinho**: Gestão completa de pedidos com variações
- **Pedidos**: Acompanhamento de pedidos em tempo real

### Admin
- **Dashboard**: Estatísticas de vendas e pedidos
- **Produtos**: CRUD completo com variações (tamanhos, sabores, bordas)
- **Categorias**: Gerenciamento com drag & drop para ordenação
- **Configurações**: Logo, banner, horários, e tema customizável

## 🚀 Tecnologias

### Core
- **[Next.js 16](https://nextjs.org/)** - Framework React com App Router
- **[React 19](https://react.dev/)** - Biblioteca UI
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS utilitário

### Backend & Database
- **[Firebase](https://firebase.google.com/)**
  - Firestore - Banco de dados NoSQL
  - Authentication - Autenticação de usuários
  - Realtime Sync - Sincronização em tempo real

### Storage & Media
- **[Cloudinary](https://cloudinary.com/)** - Gerenciamento de imagens
- **[next-cloudinary](https://next-cloudinary.dev/)** - Integração otimizada

### UI & UX
- **[React Icons](https://react-icons.github.io/react-icons/)** - Biblioteca de ícones
- **[@dnd-kit](https://dndkit.com/)** - Drag and drop para reordenação

## ✨ Funcionalidades

### 🛍️ Para Clientes

#### Navegação e Busca
- [x] Catálogo de produtos com imagens otimizadas
- [x] Busca por nome e descrição
- [x] Filtro por categorias
- [x] Seção dedicada para promoções
- [x] Banner promocional interativo

#### Produtos
- [x] Visualização detalhada com modal
- [x] Seleção de até 2 sabores (prevalece o maior valor)
- [x] Opções de tamanhos com descrições
- [x] Opções de bordas (crusts)
- [x] Sistema de promoções (produto, tamanho ou borda)
- [x] Cálculo automático de preço ("A partir de...")
- [x] Badge de promoção visual

#### Carrinho
- [x] Adicionar/remover produtos
- [x] Ajustar quantidades
- [x] Visualização de variações selecionadas
- [x] Cálculo automático de subtotal e taxa de entrega
- [x] Botão "Adicionar mais itens"
- [x] Envio de pedido via WhatsApp

#### Pedidos
- [x] Página dedicada de pedidos do cliente
- [x] Acompanhamento em tempo real do status
- [x] Histórico de pedidos
- [x] Detalhes completos de cada pedido

### 👨‍💼 Para Administradores

#### Dashboard
- [x] Estatísticas de hoje (pedidos e faturamento)
- [x] Estatísticas da semana
- [x] Estatísticas do mês
- [x] Produtos mais vendidos com receita
- [x] Toggle de status da loja (aberto/fechado)
- [x] Sincronização em tempo real

#### Gestão de Produtos
- [x] CRUD completo de produtos
- [x] Upload de imagens via Cloudinary
- [x] Gerenciamento de variações:
  - **Tamanhos**: Nome, preço, descrição, promoção
  - **Sabores**: Nome, preço, imagem, descrição
  - **Bordas**: Nome, preço, promoção
- [x] Ativar/desativar produtos
- [x] Sistema de promoções em múltiplos níveis
- [x] Preview visual de produtos

#### Gestão de Categorias
- [x] Criar, editar e deletar categorias
- [x] Drag & drop para reordenar
- [x] Cores personalizadas
- [x] Sincronização automática com a home

#### Gestão de Pedidos
- [x] Lista em tempo real de todos os pedidos
- [x] Atualização de status:
  - Aprovado
  - Em produção
  - Pronto
  - Saiu para entrega
  - Cancelado
- [x] Visualização detalhada de itens
- [x] Informações do cliente
- [x] Atualização refletida no app do cliente

#### Configurações
- [x] Nome da loja editável
- [x] Logo da loja (upload com Cloudinary)
  - Tamanho: 96x96px
  - Formato: circular
  - Suporte: PNG, JPG, WebP
- [x] Banner promocional
- [x] Número do WhatsApp
- [x] Horário de funcionamento
- [x] Tema de cores customizável
- [x] Todas as alterações sincronizadas em tempo real

#### Autenticação
- [x] Login com email/senha (Firebase Auth)
- [x] Proteção de rotas admin
- [x] Logout seguro
- [x] Redirecionamento automático

## 📦 Instalação

### Pré-requisitos

- **Node.js** 18.0 ou superior
- **npm** ou **yarn**
- Conta no [Firebase](https://firebase.google.com/)
- Conta no [Cloudinary](https://cloudinary.com/) (opcional)

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/Leonardo96gommes/Cdp-Delivery.git
cd Cdp-Delivery/web
```

### Passo 2: Instalar Dependências

```bash
npm install
```

### Passo 3: Configurar Variáveis de Ambiente

Crie o arquivo `.env.local` na pasta `web/`:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=sua-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=seu-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=seu-measurement-id

# Cloudinary Configuration (Opcional)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=seu-upload-preset
CLOUDINARY_API_KEY=sua-api-key
CLOUDINARY_API_SECRET=seu-api-secret
CLOUDINARY_URL=cloudinary://api-key:api-secret@cloud-name
```

### Passo 4: Executar em Desenvolvimento

```bash
npm run dev
```

Acesse: **http://localhost:3000**

## ⚙️ Configuração

### 1. Firebase

Siga o guia completo: [`CONFIGURAR_FIREBASE.md`](web/CONFIGURAR_FIREBASE.md)

**Resumo:**
1. Criar projeto no Firebase Console
2. Ativar Firestore Database
3. Ativar Authentication (Email/Password)
4. Copiar credenciais para `.env.local`
5. Configurar regras de segurança
6. Criar primeiro usuário admin

### 2. Cloudinary (Opcional)

Siga o guia: [`STORAGE_CLOUDINARY.md`](web/STORAGE_CLOUDINARY.md)

**Resumo:**
1. Criar conta gratuita no Cloudinary
2. Obter Cloud Name e credenciais
3. Criar Upload Preset (modo Unsigned)
4. Adicionar credenciais ao `.env.local`

### 3. Criar Usuário Admin

Siga: [`CRIAR_USUARIO_ADMIN.md`](web/CRIAR_USUARIO_ADMIN.md)

1. Ir ao Firebase Console > Authentication
2. Add user com email/senha
3. Usar essas credenciais em `/login`

## 📁 Estrutura do Projeto

```
web/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # 🏠 Home (catálogo)
│   ├── cart/                    # 🛒 Carrinho
│   │   └── page.tsx
│   ├── orders/                  # 📦 Pedidos do cliente
│   │   └── page.tsx
│   ├── admin/                   # 👨‍💼 Painel Admin
│   │   ├── layout.tsx          # Proteção de rota
│   │   └── page.tsx            # Dashboard
│   ├── login/                   # 🔐 Login Admin
│   │   └── page.tsx
│   ├── api/                     # ⚡ API Routes
│   │   └── cloudinary/
│   │       └── delete/
│   │           └── route.ts    # Delete de imagens
│   ├── layout.tsx              # Layout principal
│   └── globals.css             # Estilos globais
│
├── components/                   # 🧩 Componentes Reutilizáveis
│   ├── Header.tsx              # Cabeçalho com logo
│   ├── SearchBar.tsx           # Busca de produtos
│   ├── CategoryChip.tsx        # Chips de categoria
│   ├── ProductCard.tsx         # Card de produto
│   ├── ProductModal.tsx        # Modal de variações
│   ├── FloatingCart.tsx        # Carrinho flutuante
│   ├── BottomNavigation.tsx    # Navegação inferior
│   ├── ImageUpload.tsx         # Upload de imagens
│   ├── CldImageWrapper.tsx     # Wrapper Cloudinary
│   └── ...
│
├── contexts/                     # 🔄 Context API
│   ├── CartContext.tsx         # Estado do carrinho
│   ├── OrdersContext.tsx       # Pedidos e estatísticas
│   ├── ProductsContext.tsx     # Produtos
│   ├── CategoriesContext.tsx   # Categorias
│   ├── StoreSettingsContext.tsx # Configurações
│   └── AuthContext.tsx         # Autenticação
│
├── lib/                          # 📚 Bibliotecas e Utilidades
│   ├── data.ts                 # Interfaces TypeScript
│   ├── firebase/               # Serviços Firebase
│   │   ├── config.ts          # Configuração
│   │   ├── products.ts        # CRUD Produtos
│   │   ├── categories.ts      # CRUD Categorias
│   │   ├── orders.ts          # CRUD Pedidos
│   │   └── storeSettings.ts   # Configurações da loja
│   └── storage/                # Upload de imagens
│       ├── cloudinary.ts      # Cliente
│       └── cloudinary-server.ts # Servidor
│
├── public/                       # 🎨 Arquivos Estáticos
├── .env.local                   # 🔐 Variáveis de Ambiente
├── next.config.ts              # ⚙️ Configuração Next.js
├── tailwind.config.ts          # 🎨 Configuração Tailwind
└── tsconfig.json               # 📘 Configuração TypeScript
```

## 🎮 Uso

### Para Clientes

1. **Navegar pelos produtos**
   - Explore categorias
   - Use a busca
   - Confira as promoções

2. **Adicionar ao carrinho**
   - Clique em um produto
   - Selecione variações (tamanhos, sabores, bordas)
   - Ajuste quantidades
   - Clique em "Adicionar ao carrinho"

3. **Finalizar pedido**
   - Vá para o carrinho
   - Preencha dados (nome, endereço, pagamento)
   - Clique em "Enviar pedido no WhatsApp"
   - Complete no WhatsApp

4. **Acompanhar pedido**
   - Clique no ícone "Pedidos" na navegação
   - Veja o status em tempo real

### Para Administradores

1. **Acessar o admin**
   - Vá para `/login`
   - Entre com email/senha
   - Será redirecionado para `/admin`

2. **Gerenciar produtos**
   - Aba "Produtos"
   - Criar/editar/deletar
   - Upload de imagens
   - Configurar variações e promoções

3. **Gerenciar categorias**
   - Aba "Categorias"
   - Criar/editar/deletar
   - Arrastar para reordenar

4. **Acompanhar pedidos**
   - Dashboard principal
   - Atualizar status
   - Ver detalhes

5. **Configurar loja**
   - Aba "Configurações"
   - Upload de logo
   - Definir horários
   - Escolher tema

## 🚀 Deploy

### Vercel (Recomendado)

1. **Push para GitHub** (já feito ✅)

2. **Conectar no Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Importe o repositório
   - Configure variáveis de ambiente
   - Deploy automático

3. **Configurar domínio**
   - Adicione domínio personalizado
   - Configure DNS

### Outras Opções

- **Netlify**: Similar ao Vercel
- **Railway**: Com suporte a Docker
- **AWS Amplify**: Integração AWS
- **Google Cloud Run**: Containerizado

## 🛠️ Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Rodar produção localmente
npm start

# Linting
npm run lint
```

### Estrutura de Dados

Veja as interfaces completas em:
- [`lib/data.ts`](web/lib/data.ts) - Interfaces TypeScript
- [`lib/firebase/README.md`](web/lib/firebase/README.md) - Estrutura Firestore

## 📝 Documentação Adicional

- [`CONFIGURAR_FIREBASE.md`](web/CONFIGURAR_FIREBASE.md) - Setup Firebase completo
- [`STORAGE_CLOUDINARY.md`](web/STORAGE_CLOUDINARY.md) - Setup Cloudinary
- [`CRIAR_USUARIO_ADMIN.md`](web/CRIAR_USUARIO_ADMIN.md) - Criar admin
- [`CRIAR_UPLOAD_PRESET.md`](web/CRIAR_UPLOAD_PRESET.md) - Cloudinary preset
- [`INICIO_RAPIDO.md`](web/INICIO_RAPIDO.md) - Guia rápido

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fork o projeto
2. Criar uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Leonardo Gomes**

- GitHub: [@Leonardo96gommes](https://github.com/Leonardo96gommes)

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework incrível
- [Firebase](https://firebase.google.com/) - Backend simplificado
- [Cloudinary](https://cloudinary.com/) - Gerenciamento de mídia
- [Tailwind CSS](https://tailwindcss.com/) - Estilização produtiva
- [React Icons](https://react-icons.github.io/) - Ícones lindos
- Comunidade open-source

---

<div align="center">

**⭐ Se este projeto te ajudou, considere dar uma estrela!**

Feito com ❤️ e ☕ por Leonardo Gomes

</div>
