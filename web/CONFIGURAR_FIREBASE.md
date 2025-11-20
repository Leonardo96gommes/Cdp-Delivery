# 🔥 Guia de Configuração do Firebase - NostraPizza

Siga este guia passo a passo para configurar o Firebase no seu projeto.

## 📋 Passo 1: Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em **"Adicionar projeto"** ou **"Create a project"**
3. Preencha:
   - **Nome do projeto**: `nostrapizza` (ou outro nome de sua preferência)
   - Clique em **Continuar**
4. **Google Analytics** (opcional):
   - Você pode desativar se não quiser usar
   - Ou manter ativado para estatísticas
5. Clique em **Criar projeto** e aguarde a criação

## 📋 Passo 2: Ativar Firestore Database

1. No menu lateral esquerdo, clique em **Firestore Database**
2. Clique em **Criar banco de dados**
3. Escolha o modo:
   - **Modo de teste** (recomendado para começar):
     - Permite leitura/escrita por 30 dias
     - Ideal para desenvolvimento
   - **Modo de produção**:
     - Mais seguro, mas requer configuração de regras
4. Escolha a **localização** do servidor:
   - Para Brasil: `southamerica-east1` (São Paulo)
   - Ou escolha a mais próxima de você
5. Clique em **Ativar**

## 📋 Passo 3: Obter Credenciais do Projeto

1. No menu lateral, clique no ícone **⚙️** (Configurações) > **Configurações do projeto**
2. Role até a seção **"Seus aplicativos"**
3. Clique no ícone **Web** (`</>`)
4. Registre o app:
   - **Nome do app**: `NostraPizza Web`
   - Marque a opção **"Também configure o Firebase Hosting"** (opcional)
   - Clique em **Registrar app**
5. **Copie as credenciais** que aparecem na tela:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "nostrapizza-xxxxx.firebaseapp.com",
  projectId: "nostrapizza-xxxxx",
  storageBucket: "nostrapizza-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

## 📋 Passo 4: Configurar Variáveis de Ambiente

1. Na pasta `web/`, crie um arquivo chamado `.env.local`

**Windows PowerShell:**
```powershell
New-Item -Path ".env.local" -ItemType File
```

**Windows CMD:**
```cmd
type nul > .env.local
```

**Linux/Mac:**
```bash
touch .env.local
```

2. Abra o arquivo `.env.local` e adicione suas credenciais:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nostrapizza-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nostrapizza-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=nostrapizza-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

⚠️ **IMPORTANTE**: 
- Substitua os valores pelos seus dados reais do Firebase
- Não compartilhe este arquivo (ele já está no .gitignore)
- Não adicione espaços antes ou depois do `=`

## 📋 Passo 5: Instalar Dependências

Se ainda não instalou o Firebase, execute:

```bash
cd web
npm install
```

## 📋 Passo 6: Configurar Regras de Segurança do Firestore

1. No Firebase Console, vá em **Firestore Database** > **Regras**
2. Cole as seguintes regras:

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

## 📋 Passo 7: Criar Índices Compostos (Opcional, mas Recomendado)

Para melhorar a performance, crie índices no Firestore:

1. No Firebase Console, vá em **Firestore Database** > **Índices**
2. Clique em **Criar índice**

**Índice 1 - Produtos por Categoria:**
- Collection ID: `products`
- Campos:
  - `categoryId` (Ascendente)
  - `active` (Ascendente)
  - `createdAt` (Descendente)

**Índice 2 - Pedidos por Status:**
- Collection ID: `orders`
- Campos:
  - `status` (Ascendente)
  - `createdAt` (Descendente)

## 📋 Passo 8: Testar a Conexão

Após configurar tudo, teste se está funcionando:

1. Reinicie o servidor de desenvolvimento:
```bash
cd web
npm run dev
```

2. Abra o navegador e acesse: `http://localhost:3000`

3. Verifique o console do navegador (F12) para ver se há erros

## ✅ Verificação Final

Se tudo estiver configurado corretamente:

- ✅ O Firebase está instalado
- ✅ O arquivo `.env.local` existe com as credenciais
- ✅ As regras do Firestore estão configuradas
- ✅ O servidor está rodando sem erros

## 🆘 Problemas Comuns

### Erro: "Firebase: Error (auth/configuration-not-found)"
- Verifique se todas as variáveis de ambiente estão corretas
- Certifique-se de que o arquivo `.env.local` está na pasta `web/`
- Reinicie o servidor após criar/editar `.env.local`

### Erro: "Missing or insufficient permissions"
- Verifique as regras de segurança do Firestore
- Certifique-se de que está usando o modo de teste ou que as regras permitem acesso

### Erro: "The query requires an index"
- Crie os índices compostos mencionados no Passo 7
- Ou clique no link do erro que aparecerá no console do Firebase

## 📚 Próximos Passos

Após configurar o Firebase, você pode:

1. Migrar dados do `localStorage` para o Firestore
2. Implementar sincronização em tempo real
3. Adicionar autenticação de administradores
4. Configurar Firebase Storage para imagens

## 📖 Documentação

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

