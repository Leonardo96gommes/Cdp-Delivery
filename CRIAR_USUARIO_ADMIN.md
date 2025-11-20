# 👤 Criar Usuário Admin no Firebase

Para acessar o painel admin, você precisa criar um usuário no Firebase Authentication.

## 📋 Passo a Passo

### 1. Ativar Authentication no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto: `nostrapizza-cea7a`
3. No menu lateral, clique em **Authentication**
4. Clique em **Começar** (se ainda não ativou)
5. Na aba **Sign-in method**, você verá uma lista de provedores

### 2. Ativar Email/Password

1. Na lista de provedores, encontre **Email/Password**
2. Clique nele
3. Ative a opção **Email/Password** (primeira opção)
4. Clique em **Salvar**

### 3. Criar Primeiro Usuário Admin

Você tem duas opções:

#### Opção 1: Criar pelo Firebase Console (Recomendado)

1. No Firebase Console, vá em **Authentication** > **Users**
2. Clique em **Adicionar usuário**
3. Preencha:
   - **Email**: seu email (ex: `admin@nostrapizza.com`)
   - **Senha**: uma senha segura
4. Clique em **Adicionar usuário**

#### Opção 2: Criar pela Interface do App

1. Acesse: `http://localhost:3000/login`
2. Você verá um link "Criar conta" (se implementado)
3. Ou use o código abaixo para criar um script de criação de usuário

### 4. Testar Login

1. Acesse: `http://localhost:3000/login`
2. Digite o email e senha criados
3. Clique em **Entrar**
4. Você será redirecionado para `/admin`

## 🔐 Segurança

### Regras Recomendadas do Firestore

Para maior segurança, atualize as regras do Firestore para exigir autenticação:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Categorias - leitura pública, escrita apenas para admin
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Produtos - leitura pública, escrita apenas para admin
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Pedidos - leitura/escrita para todos (clientes podem criar pedidos)
    match /orders/{orderId} {
      allow read, write: if true;
    }
    
    // Configurações - leitura pública, escrita apenas para admin
    match /settings/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🛠️ Script para Criar Usuário (Opcional)

Se quiser criar um script para criar usuários programaticamente, você pode usar:

```typescript
// scripts/create-admin-user.ts
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase/config';

async function createAdminUser() {
  const email = 'admin@nostrapizza.com';
  const password = 'senha-segura-123';

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('✅ Usuário criado com sucesso:', userCredential.user.email);
  } catch (error: any) {
    console.error('❌ Erro ao criar usuário:', error.message);
  }
}

createAdminUser();
```

## ✅ Checklist

- [ ] Authentication ativado no Firebase
- [ ] Email/Password habilitado como método de login
- [ ] Primeiro usuário admin criado
- [ ] Login testado com sucesso
- [ ] Regras do Firestore atualizadas (opcional, mas recomendado)

## 🆘 Problemas Comuns

### Erro: "auth/user-not-found"
- Verifique se o usuário foi criado no Firebase Console
- Confirme se o email está correto

### Erro: "auth/wrong-password"
- Verifique se a senha está correta
- Tente redefinir a senha no Firebase Console

### Erro: "auth/too-many-requests"
- Aguarde alguns minutos antes de tentar novamente
- Isso acontece após muitas tentativas de login falhadas

### Não consigo acessar /admin
- Verifique se está logado
- Tente fazer logout e login novamente
- Verifique o console do navegador para erros

## 📚 Próximos Passos

Após criar o usuário admin, você pode:

1. Criar múltiplos usuários admin
2. Implementar roles/permissões diferentes
3. Adicionar recuperação de senha
4. Implementar verificação de email

