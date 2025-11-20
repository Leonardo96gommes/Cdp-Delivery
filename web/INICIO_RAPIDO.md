# 🚀 Início Rápido - Configuração do Firebase

## ⚡ Passos Rápidos

### 1️⃣ Criar Projeto no Firebase
- Acesse: https://console.firebase.google.com/
- Clique em **"Adicionar projeto"**
- Nome: `nostrapizza`
- Ative o **Firestore Database** (modo de teste)

### 2️⃣ Obter Credenciais
- Configurações do projeto (⚙️) > **Configurações do projeto**
- Clique no ícone **Web** (`</>`)
- Registre o app e **copie as credenciais**

### 3️⃣ Criar Arquivo .env.local
Na pasta `web/`, crie o arquivo `.env.local`:

**Windows PowerShell:**
```powershell
cd web
New-Item -Path ".env.local" -ItemType File
```

**Depois, abra o arquivo e cole:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=cole-aqui-sua-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cole-aqui-seu-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cole-aqui-seu-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cole-aqui-seu-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=cole-aqui-seu-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=cole-aqui-seu-app-id
```

### 4️⃣ Configurar Regras do Firestore
No Firebase Console > Firestore Database > Regras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if true; // Em produção, adicionar autenticação
    }
    match /products/{productId} {
      allow read: if true;
      allow write: if true;
    }
    match /orders/{orderId} {
      allow read, write: if true;
    }
    match /settings/{document} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

Clique em **Publicar**.

### 5️⃣ Testar
```bash
cd web
npm run dev
```

Abra: http://localhost:3000

## 📖 Guia Completo
Veja o arquivo `CONFIGURAR_FIREBASE.md` para instruções detalhadas.

## ✅ Checklist
- [ ] Projeto criado no Firebase
- [ ] Firestore Database ativado
- [ ] Credenciais copiadas
- [ ] Arquivo `.env.local` criado e preenchido
- [ ] Regras do Firestore configuradas
- [ ] Servidor rodando sem erros

