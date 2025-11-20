# 🔥 Configuração do Firebase - NostraPizza

Guia completo para configurar o Firebase no projeto NostraPizza.

## 📋 Pré-requisitos

1. Conta no Google (para acessar o Firebase Console)
2. Node.js instalado
3. Projeto Firebase criado

## 🚀 Passo a Passo

### 1. Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto" ou "Create a project"
3. Preencha o nome do projeto (ex: `nostrapizza`)
4. Aceite os termos e continue
5. Desative o Google Analytics (ou mantenha ativado, conforme preferência)
6. Clique em "Criar projeto"

### 2. Ativar Firestore Database

1. No menu lateral, clique em **Firestore Database**
2. Clique em **Criar banco de dados**
3. Escolha o modo:
   - **Modo de produção**: Mais seguro, requer regras de segurança
   - **Modo de teste**: Permite leitura/escrita por 30 dias (ideal para desenvolvimento)
4. Escolha a localização do servidor (ex: `southamerica-east1` para Brasil)
5. Clique em **Ativar**

### 3. Obter Credenciais do Projeto

1. No menu lateral, clique no ícone de **⚙️ Configurações** > **Configurações do projeto**
2. Role até a seção **Seus aplicativos**
3. Clique no ícone **Web** (`</>`)
4. Registre o app com um nome (ex: `NostraPizza Web`)
5. Copie as credenciais que aparecem:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "nostrapizza.firebaseapp.com",
  projectId: "nostrapizza",
  storageBucket: "nostrapizza.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 4. Configurar Variáveis de Ambiente

1. Na pasta `web/`, crie um arquivo `.env.local`:

```bash
# Windows PowerShell
New-Item -Path ".env.local" -ItemType File

# Linux/Mac
touch .env.local
```

2. Adicione as credenciais no arquivo `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nostrapizza.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nostrapizza
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=nostrapizza.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

⚠️ **IMPORTANTE**: Substitua os valores pelos seus dados reais do Firebase!

### 5. Instalar Dependências

```bash
cd web
npm install
```

### 6. Configurar Regras de Segurança do Firestore

1. No Firebase Console, vá em **Firestore Database** > **Regras**
2. Cole as seguintes regras (ajuste conforme necessário):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Categorias - leitura pública, escrita apenas para admin autenticado
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Produtos - leitura pública, escrita apenas para admin autenticado
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Pedidos - leitura/escrita para todos (em produção, adicionar autenticação)
    match /orders/{orderId} {
      allow read, write: if true;
    }
    
    // Configurações - leitura pública, escrita apenas para admin autenticado
    match /settings/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Clique em **Publicar**

### 7. Criar Índices Compostos (Opcional, mas Recomendado)

Para melhorar a performance, crie índices compostos no Firestore:

1. No Firebase Console, vá em **Firestore Database** > **Índices**
2. Clique em **Criar índice**
3. Crie os seguintes índices:

**Índice 1:**
- Collection: `products`
- Campos:
  - `categoryId` (Ascendente)
  - `active` (Ascendente)
  - `createdAt` (Descendente)

**Índice 2:**
- Collection: `orders`
- Campos:
  - `status` (Ascendente)
  - `createdAt` (Descendente)

### 8. Testar a Conexão

Crie um arquivo de teste temporário para verificar se tudo está funcionando:

```typescript
// web/test-firebase.ts
import { db } from './lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

async function testConnection() {
  try {
    const categoriesRef = collection(db, 'categories');
    const snapshot = await getDocs(categoriesRef);
    console.log('✅ Conexão com Firebase estabelecida!');
    console.log('Categorias encontradas:', snapshot.size);
  } catch (error) {
    console.error('❌ Erro ao conectar:', error);
  }
}

testConnection();
```

## 📊 Estrutura do Banco de Dados

Após a configuração, o banco terá as seguintes collections:

- **`categories`** - Categorias de produtos
- **`products`** - Produtos do cardápio
- **`orders`** - Pedidos dos clientes
- **`settings`** - Configurações da loja (documento único)

## 🔐 Segurança

⚠️ **ATENÇÃO**: As regras de segurança fornecidas são básicas. Para produção:

1. Implemente autenticação de usuários
2. Adicione validação de dados nas regras
3. Limite acesso baseado em roles (admin, cliente)
4. Use Firebase Storage para imagens (não armazene URLs diretas)

## 📚 Próximos Passos

1. Integrar os serviços Firebase nos componentes existentes
2. Migrar dados do `localStorage` para o Firestore
3. Implementar sincronização em tempo real (opcional)
4. Adicionar autenticação de administradores

## 🆘 Troubleshooting

### Erro: "Firebase: Error (auth/configuration-not-found)"
- Verifique se todas as variáveis de ambiente estão corretas
- Certifique-se de que o arquivo `.env.local` está na pasta `web/`
- Reinicie o servidor de desenvolvimento após criar/editar `.env.local`

### Erro: "Missing or insufficient permissions"
- Verifique as regras de segurança do Firestore
- Certifique-se de que está usando o modo de teste ou que as regras permitem acesso

### Erro: "The query requires an index"
- Crie os índices compostos mencionados no passo 7
- Ou clique no link do erro que aparecerá no console do Firebase

## 📖 Documentação

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

