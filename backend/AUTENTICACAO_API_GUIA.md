# 🔐 Guia de Autenticação - API de Relatórios

## 📋 **Autenticação Obrigatória**

**⚠️ IMPORTANTE**: Todos os endpoints de relatórios **REQUEREM autenticação JWT**.

### **🔑 Como Obter o Token**

#### **1. Login via API**
```bash
POST /api/usuarios/login/
Content-Type: application/json

{
  "username": "seu_usuario",
  "password": "sua_senha"
}
```

#### **2. Resposta do Login**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "seu_usuario",
    "email": "usuario@email.com"
  }
}
```

### **🚀 Como Usar o Token**

#### **1. Header de Autorização**
```bash
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

#### **2. Exemplo de Requisição**
```bash
curl -H "Authorization: Bearer SEU_TOKEN_AQUI" \
     http://localhost:8000/api/relatorios/funcionarios/
```

#### **3. No Swagger UI**
1. Clique no botão **"Authorize"** (🔒) no topo da página
2. Digite: `Bearer SEU_TOKEN_AQUI`
3. Clique em **"Authorize"**
4. Agora você pode testar todos os endpoints

---

## 📚 **Endpoints que Requerem Autenticação**

### **✅ Todos os Endpoints de Relatórios:**
- `GET /api/relatorios/funcionarios/` - Lista funcionários
- `GET /api/relatorios/funcionarios/{id}/` - Detalhes do funcionário
- `GET /api/relatorios/funcionarios/estatisticas/` - Estatísticas
- `GET /api/relatorios/prestacoes/` - Lista prestações
- `GET /api/relatorios/prestacoes/{id}/` - Detalhes da prestação
- `GET /api/relatorios/prestacoes/estatisticas/` - Estatísticas
- `GET /api/relatorios/pontos/` - Lista registros de ponto
- `GET /api/relatorios/pontos/{id}/` - Detalhes do registro
- `GET /api/relatorios/pontos/estatisticas/` - Estatísticas
- `GET /api/relatorios/dashboard/geral/` - Dashboard geral
- `GET /api/relatorios/dashboard/graficos/` - Dados para gráficos
- `GET /api/relatorios/dashboard/financeiro/` - Relatório financeiro

---

## 🔧 **Configuração da Autenticação**

### **No settings.py:**
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}
```

### **Token JWT Configuração:**
```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),  # 1 hora
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),     # 7 dias
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
}
```

---

## 🚨 **Respostas de Erro de Autenticação**

### **1. Token Inválido (401)**
```json
{
  "detail": "Given token not valid for any token type",
  "code": "token_not_valid",
  "messages": [
    {
      "token_class": "AccessToken",
      "token_type": "access",
      "message": "Token is invalid or expired"
    }
  ]
}
```

### **2. Token Ausente (401)**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### **3. Token Expirado (401)**
```json
{
  "detail": "Token is invalid or expired"
}
```

---

## 🔄 **Renovação de Token**

### **1. Usar Refresh Token**
```bash
POST /api/usuarios/token/refresh/
Content-Type: application/json

{
  "refresh": "SEU_REFRESH_TOKEN_AQUI"
}
```

### **2. Resposta**
```json
{
  "access": "NOVO_ACCESS_TOKEN_AQUI"
}
```

---

## 💡 **Dicas de Uso**

### **1. No Frontend (JavaScript)**
```javascript
// Armazenar token
localStorage.setItem('token', response.data.access);

// Usar em requisições
const token = localStorage.getItem('token');
fetch('/api/relatorios/funcionarios/', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### **2. No Postman**
1. Vá para a aba **Authorization**
2. Selecione **Bearer Token**
3. Cole o token no campo **Token**

### **3. No cURL**
```bash
curl -H "Authorization: Bearer SEU_TOKEN" \
     -H "Content-Type: application/json" \
     http://localhost:8000/api/relatorios/funcionarios/
```

---

## 🛠️ **Troubleshooting**

### **Problemas Comuns:**

1. **"Authentication credentials were not provided"**
   - Verifique se o header Authorization está presente
   - Confirme se o formato está correto: `Bearer TOKEN`

2. **"Token is invalid or expired"**
   - Token expirou (válido por 1 hora)
   - Use o refresh token para obter um novo
   - Faça login novamente

3. **"Given token not valid for any token type"**
   - Token malformado ou corrompido
   - Faça login novamente

4. **Erro 403 Forbidden**
   - Token válido mas usuário sem permissão
   - Verifique se o usuário tem acesso aos dados

---

## 📖 **Recursos Adicionais**

- **Swagger UI**: `http://localhost:8000/api/docs/`
- **ReDoc**: `http://localhost:8000/api/redoc/`
- **Documentação da API**: `RELATORIOS_API_DOCUMENTATION.md`
- **Guia de Filtros**: `FILTROS_API_GUIA.md`

---

## ✅ **Resumo**

1. **Sempre faça login primeiro** para obter o token
2. **Use o token em todas as requisições** via header Authorization
3. **Renove o token** quando expirar (1 hora)
4. **Teste no Swagger UI** usando o botão Authorize
5. **Mantenha o token seguro** e não o compartilhe

Agora você está pronto para usar todos os endpoints de relatórios com autenticação! 🚀
