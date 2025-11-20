# 🔧 Como Criar o Upload Preset no Cloudinary

O erro de upload ocorre porque o **Upload Preset** ainda não foi criado no Cloudinary. Siga estes passos:

## 📋 Passo a Passo

### 1. Acesse o Cloudinary Console

Acesse: https://console.cloudinary.com/

### 2. Vá para Settings > Upload

1. Clique no ícone de **⚙️ Settings** no canto superior direito
2. No menu lateral esquerdo, clique em **Upload**
3. Role a página até encontrar a seção **Upload presets**

### 3. Adicione um Novo Upload Preset

1. Clique no botão **Add upload preset**
2. Preencha as informações:

#### Configurações Básicas:
- **Preset name**: `nostrapizza_upload` (exatamente esse nome)
- **Signing mode**: Selecione **Unsigned** (IMPORTANTE!)
- **Folder**: `nostrapizza` (opcional, para organizar)

#### Configurações de Arquivo:
- **Use filename**: ✅ Marque esta opção
- **Unique filename**: ✅ Marque esta opção
- **Overwrite**: ❌ Deixe desmarcado

#### Configurações de Transformação:
- **Eager transformations**: Adicione `c_auto,f_auto,q_auto`
  - Clique em **Add eager transformation**
  - Cole: `c_auto,f_auto,q_auto`
  
#### Limites (Opcional mas Recomendado):
- **Max file size**: `10485760` (10 MB em bytes)
- **Allowed formats**: `jpg,jpeg,png,webp`
- **Max image width**: `2000`
- **Max image height**: `2000`

### 4. Salvar

Clique no botão **Save** no topo da página.

### 5. Testar

Volte ao painel admin e tente fazer upload novamente.

## 🆘 Solução Alternativa (Se não der certo)

Se mesmo após criar o preset o erro persistir, você pode usar URLs diretas:

1. Faça upload da imagem manualmente no Cloudinary:
   - Vá em **Media Library** no console
   - Clique em **Upload**
   - Selecione a imagem
   - Copie a URL da imagem

2. No painel admin, cole a URL diretamente no campo de texto (se disponível)

## ✅ Checklist

- [ ] Acessei o Cloudinary Console
- [ ] Fui em Settings > Upload
- [ ] Criei um novo Upload Preset
- [ ] Nome: `nostrapizza_upload`
- [ ] Signing mode: **Unsigned**
- [ ] Salvei as configurações
- [ ] Testei o upload no painel admin

## 📸 Referências Visuais

O preset deve ficar assim:

```
Preset name: nostrapizza_upload
Signing mode: Unsigned ⚠️ (muito importante!)
Folder: nostrapizza
Use filename: ✅
Unique filename: ✅
Overwrite: ❌
```

---

**Importante:** O modo **Unsigned** é essencial para permitir uploads diretos do navegador sem autenticação do servidor.

