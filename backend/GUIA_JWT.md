# 🔐 Guia Completo - Autenticação JWT

## 📋 Visão Geral

Sistema de autenticação implementado com **JWT (JSON Web Token)** para maior segurança e flexibilidade. O JWT permite autenticação stateless e é ideal para APIs REST.

## 🔒 Permissões e Acesso

- **Público (AllowAny):**
  - POST `/api/auth/register/`
  - POST `/api/auth/login/`
  - POST `/api/auth/refresh-token/`
  - POST `/api/auth/token/`
  - POST `/api/auth/token/refresh/`
  - POST `/api/auth/token/verify/`
- **Protegido (IsAuthenticated):**
  - GET `/api/auth/me/`
  - PUT `/api/auth/me/` (ou `/api/auth/me/update/` se disponível)
  - POST `/api/auth/change-password/`
  - POST `/api/auth/logout/`
  - Todas as rotas de `/api/usuarios/` (listar, detalhar, atualizar, deletar)

## 🚀 Endpoints JWT Disponíveis

### **1. Autenticação Básica**

#### **POST** `/api/auth/register/`
**Registrar novo usuário**
_Permissão: Público (AllowAny)_

**Request:**
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

**Response:**
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
        "is_staff": false
    },
    "tokens": {
        "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    },
    "message": "Usuário criado com sucesso!"
}
```

#### **POST** `/api/auth/login/`
**Fazer login**
_Permissão: Público (AllowAny)_

**Request (aceita username OU email):**
```json
{
    "username": "usuario123",
    "password": "senha123"
}
```
ou
```json
{
    "email": "usuario@email.com",
    "password": "senha123"
}
```

**Response:**
```json
{
    "usuario": { /* dados do usuário */ },
    "tokens": {
        "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    },
    "message": "Login realizado com sucesso!"
}
```

### **2. Gerenciamento de Tokens**

#### **POST** `/api/auth/refresh-token/`
**Renovar access token**
_Permissão: Público (AllowAny)_

**Request:**
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response:**
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "message": "Token renovado com sucesso!"
}
```

#### **POST** `/api/auth/token/`
**Obter tokens (endpoint JWT customizado: aceita username OU email)**
_Permissão: Público (AllowAny)_

**Request (username):**
```json
{
    "username": "usuario123",
    "password": "senha123"
}
```
**Request (email):**
```json
{
    "email": "usuario@email.com",
    "password": "senha123"
}
```

**Response:**
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### **POST** `/api/auth/token/refresh/`
**Renovar access token (endpoint padrão JWT)**
_Permissão: Público (AllowAny)_

#### **POST** `/api/auth/token/verify/`
**Verificar se token é válido**
_Permissão: Público (AllowAny)_

### **3. Perfil do Usuário**

#### **GET** `/api/auth/me/`
**Obter dados do usuário logado**
_Permissão: Protegido (IsAuthenticated)_

**Headers:**
```http
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

#### **PUT** `/api/auth/me/`
**Atualizar perfil**
_Permissão: Protegido (IsAuthenticated)_

#### **POST** `/api/auth/change-password/`
**Alterar senha**
_Permissão: Protegido (IsAuthenticated)_

## 🔑 Como Usar JWT

### **1. Headers de Autenticação**

```http
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
Content-Type: application/json
```

### **2. Fluxo de Autenticação**

1. **Registrar/Login** → Receber `access` e `refresh` tokens
2. **Usar access token** → Para todas as requisições autenticadas
3. **Token expira** → Usar `refresh token` para renovar
4. **Logout** → Remover tokens do frontend

### **3. Configurações dos Tokens**

- **Access Token:** Válido por **1 hora**
- **Refresh Token:** Válido por **7 dias**
- **Algoritmo:** HS256
- **Rotação:** Refresh tokens são rotacionados automaticamente

## 💻 Exemplos de Uso

### **JavaScript/React:**

```javascript
// Configuração base
const API_BASE = 'http://127.0.0.1:8000/api';

// Headers com JWT
const getHeaders = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
});

// Registrar usuário
const registerUser = async (userData) => {
    const response = await fetch(`${API_BASE}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    const data = await response.json();
    
    // Salvar tokens no localStorage
    localStorage.setItem('access_token', data.tokens.access);
    localStorage.setItem('refresh_token', data.tokens.refresh);
    
    return data;
};

// Fazer login
const loginUser = async (credentials) => {
    const response = await fetch(`${API_BASE}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    const data = await response.json();
    
    // Salvar tokens no localStorage
    localStorage.setItem('access_token', data.tokens.access);
    localStorage.setItem('refresh_token', data.tokens.refresh);
    
    return data;
};

// Renovar token
const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh_token');
    const response = await fetch(`${API_BASE}/auth/refresh-token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh })
    });
    const data = await response.json();
    
    // Atualizar access token
    localStorage.setItem('access_token', data.access);
    
    return data;
};

// Fazer requisição autenticada
const makeAuthenticatedRequest = async (url, options = {}) => {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(url, {
        ...options,
        headers: {
            ...getHeaders(token),
            ...options.headers
        }
    });
    
    // Se token expirou, tentar renovar
    if (response.status === 401) {
        await refreshToken();
        const newToken = localStorage.getItem('access_token');
        
        // Tentar novamente com novo token
        return fetch(url, {
            ...options,
            headers: {
                ...getHeaders(newToken),
                ...options.headers
            }
        });
    }
    
    return response;
};

// Obter perfil
const getProfile = async () => {
    const response = await makeAuthenticatedRequest(`${API_BASE}/auth/me/`);
    return response.json();
};

// Listar usuários
const getUsers = async () => {
    const response = await makeAuthenticatedRequest(`${API_BASE}/usuarios/`);
    return response.json();
};
```

### **Python/Requests:**

```python
import requests
import json

class JWTClient:
    def __init__(self, base_url='http://127.0.0.1:8000/api'):
        self.base_url = base_url
        self.access_token = None
        self.refresh_token = None
    
    def get_headers(self):
        headers = {'Content-Type': 'application/json'}
        if self.access_token:
            headers['Authorization'] = f'Bearer {self.access_token}'
        return headers
    
    def register(self, user_data):
        response = requests.post(
            f'{self.base_url}/auth/register/',
            json=user_data,
            headers=self.get_headers()
        )
        data = response.json()
        
        if response.status_code == 201:
            self.access_token = data['tokens']['access']
            self.refresh_token = data['tokens']['refresh']
        
        return data
    
    def login(self, username, password):
        response = requests.post(
            f'{self.base_url}/auth/login/',
            json={'username': username, 'password': password},
            headers=self.get_headers()
        )
        data = response.json()
        
        if response.status_code == 200:
            self.access_token = data['tokens']['access']
            self.refresh_token = data['tokens']['refresh']
        
        return data
    
    def refresh_access_token(self):
        response = requests.post(
            f'{self.base_url}/auth/refresh-token/',
            json={'refresh': self.refresh_token},
            headers=self.get_headers()
        )
        data = response.json()
        
        if response.status_code == 200:
            self.access_token = data['access']
        
        return data
    
    def get_profile(self):
        response = requests.get(
            f'{self.base_url}/auth/me/',
            headers=self.get_headers()
        )
        return response.json()
    
    def get_users(self):
        response = requests.get(
            f'{self.base_url}/usuarios/',
            headers=self.get_headers()
        )
        return response.json()

# Uso
client = JWTClient()

# Registrar
user_data = {
    "username": "teste123",
    "email": "teste@email.com",
    "first_name": "João",
    "last_name": "Silva",
    "cpf": "123.456.789-00",
    "password": "senha123",
    "password_confirm": "senha123"
}
result = client.register(user_data)

# Fazer login
result = client.login("teste123", "senha123")

# Obter perfil
profile = client.get_profile()

# Listar usuários
users = client.get_users()
```

## 🧪 Testando com Postman

### **1. Configuração Base**
- **URL Base:** `http://127.0.0.1:8000`
- **Headers Padrão:** `Content-Type: application/json`

### **Notas importantes (Postman)**
- Para `login`, `register` e `refresh-token`, não envie `Authorization`. Deixe a aba Authorization como "No Auth".
- Verifique se não há `Authorization` herdado de Collection/Pasta.
- Sempre envie `Content-Type: application/json` nos POSTs.
- Se o servidor não recarregou alterações, reinicie o runserver.

### **2. Teste de Registro**

**POST** `http://127.0.0.1:8000/api/auth/register/`

**Body:**
```json
{
    "username": "teste123",
    "email": "teste@email.com",
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
    "usuario": { /* dados do usuário */ },
    "tokens": {
        "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    },
    "message": "Usuário criado com sucesso!"
}
```

### **3. Teste de Login**

**POST** `http://127.0.0.1:8000/api/auth/login/`

**Body:**
```json
{
    "username": "teste123",
    "password": "senha123"
}
```

### **4. Teste de Perfil (com JWT)**

**GET** `http://127.0.0.1:8000/api/auth/me/`

**Headers:**
```http
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
Content-Type: application/json
```

### **5. Teste de Renovação de Token**

**POST** `http://127.0.0.1:8000/api/auth/refresh-token/`

**Body:**
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

## ⚠️ Vantagens do JWT

### **✅ Vantagens:**
- **Stateless** - Não precisa armazenar tokens no servidor
- **Escalável** - Funciona bem com múltiplos servidores
- **Seguro** - Tokens são assinados e verificados
- **Flexível** - Pode conter informações customizadas
- **Padrão** - Amplamente adotado na indústria

### **⚠️ Considerações:**
- **Não pode ser revogado** - Tokens são válidos até expirarem
- **Tamanho** - Maior que tokens simples
- **Segurança** - Precisa ser armazenado com segurança no frontend

## 🔧 Configurações Avançadas

### **Personalizar Tempo de Expiração:**

```python
# Em settings.py
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=2),    # 2 horas
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),   # 30 dias
    # ... outras configurações
}
```

### **Adicionar Claims Customizados:**

```python
# Em serializers.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Adicionar claims customizados
        token['username'] = user.username
        token['email'] = user.email
        token['is_staff'] = user.is_staff
        
        return token
```

## 🚨 Troubleshooting

### **1. "Token is invalid or expired"**
- **Causa:** Token expirado ou inválido
- **Solução:** Renovar token com refresh token

### **2. "Authentication credentials were not provided"**
- **Causa (rotas protegidas):** Header `Authorization` ausente ou inválido
- **Solução (rotas protegidas):** Adicionar `Authorization: Bearer <access_token>`
- **Causa (login/register/refresh):** `Authorization` herdado no Postman exigido indevidamente
- **Solução (login/register/refresh):** Remover `Authorization` (usar "No Auth") e garantir `Content-Type: application/json`

### **3. "Token has no associated user"**
- **Causa:** Usuário foi deletado ou token corrompido
- **Solução:** Fazer login novamente

---

**🎉 Sistema JWT implementado com sucesso!**

*Agora você tem autenticação JWT completa e segura para suas APIs.*
