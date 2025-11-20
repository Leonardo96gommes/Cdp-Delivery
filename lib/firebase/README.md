# Firebase Database - NostraPizza

Estrutura do banco de dados Firebase Firestore para o projeto NostraPizza.

## 📊 Estrutura do Banco de Dados

### Collections

#### 1. `categories` - Categorias de Produtos
```typescript
{
  id: string (auto)
  name: string
  color: string (hex)
  order: number (opcional)
  active: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

#### 2. `products` - Produtos
```typescript
{
  id: string (auto)
  name: string
  description: string
  price: number
  image: string (URL)
  categoryId: string (reference to categories)
  estimatedTime: number (opcional, minutos)
  rating: number (opcional, 0-5)
  active: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

#### 3. `orders` - Pedidos
```typescript
{
  id: string (auto)
  customerName: string
  customerPhone: string (opcional)
  address: string
  paymentMethod: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  status: 'Aprovado' | 'Em produção' | 'Pronto' | 'Saiu para entrega' | 'Cancelado'
  notes: string (opcional)
  createdAt: Timestamp
  updatedAt: Timestamp
}

OrderItem: {
  productId: string
  productName: string
  price: number
  quantity: number
  size: string (opcional)
  extras: string[] (opcional)
}
```

#### 4. `settings` - Configurações da Loja (Document único)
```typescript
{
  id: 'store_settings'
  storeName: string
  whatsappNumber: string
  openingTime: string (HH:mm)
  closingTime: string (HH:mm)
  logo: string (opcional, URL)
  banner: string (opcional, URL)
  themeColor: string (hex)
  isOpen: boolean
  deliveryFee: number
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

## 🔧 Configuração

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative o Firestore Database
3. Copie as credenciais do projeto
4. Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## 📝 Regras de Segurança do Firestore

Configure as regras no Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Categorias - leitura pública, escrita apenas para admin
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null; // Ajustar conforme sua autenticação
    }
    
    // Produtos - leitura pública, escrita apenas para admin
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Pedidos - leitura/escrita para todos (ajustar conforme necessário)
    match /orders/{orderId} {
      allow read, write: if true; // Em produção, adicionar autenticação
    }
    
    // Configurações - leitura pública, escrita apenas para admin
    match /settings/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🚀 Uso

```typescript
import { getProducts } from '@/lib/firebase/products';
import { createOrder } from '@/lib/firebase/orders';
import { getStoreSettings } from '@/lib/firebase/storeSettings';

// Buscar produtos
const products = await getProducts(true); // apenas ativos

// Criar pedido
const orderId = await createOrder({
  customerName: 'João Silva',
  address: 'Rua Exemplo, 123',
  paymentMethod: 'PIX',
  items: [...],
  subtotal: 50.00,
  deliveryFee: 5.00,
  total: 55.00,
  status: 'Aprovado',
});

// Buscar configurações
const settings = await getStoreSettings();
```

