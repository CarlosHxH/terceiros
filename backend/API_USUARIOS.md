# 🔐 API de Usuários - Sistema de Autenticação e Permissões

## 📋 Visão Geral

Sistema completo de gerenciamento de usuários com autenticação via token, permissões Django integradas e endpoints RESTful para integração com frontend.

## 🚀 Endpoints Disponíveis

### **1. Autenticação**

#### **POST** `/api/auth/register/`
**Registrar novo usuário**
```json
{
    "username": "usuario123",
    "email": "usuario@email.com",
    "first_name": "João",
    "last_name": "Silva",
    "cpf": "123.456.789-00",
    "telefone": "(65) 99999-9999",
    "password": "senha123",
    "password_confirm": "senha123"
}
```

**Resposta:**
```json
{
    "usuario": {
        "id": 1,
        "username": "usuario123",
        "email": "usuario@email.com",
        "first_name": "João",
        "last_name": "Silva",
        "cpf": "123.456.789-00",
        "telefone": "(65) 99999-9999",
        "is_active": true,
        "is_staff": false,
        "date_joined": "2024-01-01T10:00:00Z"
    },
    "token": "abc123def456...",
    "message": "Usuário criado com sucesso!"
}
```

#### **POST** `/api/auth/login/`
**Fazer login**
```json
{
    "username": "usuario123",
    "password": "senha123"
}
```

**Resposta:**
```json
{
    "usuario": { /* dados do usuário */ },
    "token": "abc123def456...",
    "message": "Login realizado com sucesso!"
}
```

#### **POST** `/api/auth/logout/`
**Fazer logout** (requer autenticação)
- **Headers:** `Authorization: Token abc123def456...`

### **2. Perfil do Usuário**

#### **GET** `/api/auth/me/`
**Obter dados do usuário logado** (requer autenticação)

#### **PUT** `/api/auth/me/`
**Atualizar perfil** (requer autenticação)
```json
{
    "first_name": "João Atualizado",
    "last_name": "Silva Santos",
    "telefone": "(65) 88888-8888"
}
```

#### **POST** `/api/auth/change-password/`
**Alterar senha** (requer autenticação)
```json
{
    "old_password": "senha123",
    "new_password": "novaSenha456",
    "new_password_confirm": "novaSenha456"
}
```

### **3. Gerenciamento de Usuários (CRUD)**

#### **GET** `/api/usuarios/`
**Listar usuários** (requer autenticação)
- **Headers:** `Authorization: Token abc123def456...`

#### **GET** `/api/usuarios/{id}/`
**Obter usuário específico** (requer autenticação)

#### **PUT** `/api/usuarios/{id}/`
**Atualizar usuário** (próprio usuário ou staff)

#### **DELETE** `/api/usuarios/{id}/`
**Deletar usuário** (apenas staff)

### **4. Administração (Apenas Staff)**

#### **POST** `/api/usuarios/{id}/toggle_active/`
**Ativar/Desativar usuário**

#### **POST** `/api/usuarios/{id}/toggle_staff/`
**Promover/Remover permissões de staff**

## 🔑 Sistema de Permissões

### **Níveis de Acesso:**

1. **Anônimo** (`AllowAny`):
   - Registrar usuário
   - Fazer login

2. **Usuário Autenticado** (`IsAuthenticated`):
   - Ver próprio perfil
   - Atualizar próprio perfil
   - Alterar própria senha
   - Fazer logout
   - Listar usuários

3. **Staff** (`IsAdminUser`):
   - Todas as permissões de usuário
   - Deletar usuários
   - Ativar/Desativar usuários
   - Promover/Remover staff

### **Validações Implementadas:**

- ✅ **CPF único** e formato válido
- ✅ **Email único**
- ✅ **Username único**
- ✅ **Validação de senhas** (comprimento, complexidade)
- ✅ **Confirmação de senha** na criação
- ✅ **Verificação de senha atual** na alteração

## 🛠️ Integração com Frontend

### **Headers Necessários:**
```javascript
const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Token ' + token
};
```

### **Exemplo de Uso (JavaScript/React):**

```javascript
// Registrar usuário
const registerUser = async (userData) => {
    const response = await fetch('/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    return response.json();
};

// Fazer login
const loginUser = async (credentials) => {
    const response = await fetch('/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    return response.json();
};

// Obter perfil (com token)
const getProfile = async (token) => {
    const response = await fetch('/api/auth/me/', {
        headers: { 'Authorization': `Token ${token}` }
    });
    return response.json();
};
```

## 🔧 Configurações do Django

### **Modelo de Usuário Customizado:**
- Estende `AbstractUser`
- Campos adicionais: `cpf`, `telefone`, `foto`
- Validações de CPF e email únicos

### **Autenticação:**
- **Token Authentication** para API
- **Session Authentication** para admin
- Tokens automáticos na criação/login

### **CORS Configurado:**
- Permite requisições do frontend
- Headers necessários para autenticação

## 📊 Admin Django

Acesse `/admin/` para gerenciar usuários com interface administrativa:
- Listagem com filtros e busca
- Criação/edição de usuários
- Gerenciamento de permissões
- Visualização de dados completos

## 🚨 Códigos de Status HTTP

- **200** - Sucesso
- **201** - Criado com sucesso
- **400** - Dados inválidos
- **401** - Não autenticado
- **403** - Sem permissão
- **404** - Usuário não encontrado

## ✅ Próximos Passos

1. **Testar todos os endpoints** com Postman/Insomnia
2. **Integrar com frontend** (Next.js/React)
3. **Implementar refresh token** (opcional)
4. **Adicionar validações extras** conforme necessário
5. **Configurar logs de auditoria** (opcional)

---

**🎯 Sistema pronto para integração com frontend!**
