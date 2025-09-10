# 🚀 Guia Completo para Testar API no Postman

## 📋 Configuração Inicial

### **1. URL Base**
```
http://127.0.0.1:8000
```

### **2. Headers Padrão**
```
Content-Type: application/json
```

## 🔐 Teste 1: Registrar Usuário (SEM TOKEN)

### **POST** `http://127.0.0.1:8000/api/auth/register/`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
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

**Resposta Esperada:**
```json
{
    "usuario": {
        "id": 2,
        "username": "teste123",
        "email": "teste@email.com",
        "first_name": "João",
        "last_name": "Silva",
        "cpf": "123.456.789-00",
        "telefone": "(65) 99999-9999",
        "is_active": true,
        "is_staff": false
    },
    "token": "abc123def456ghi789...",
    "message": "Usuário criado com sucesso!"
}
```

**⚠️ IMPORTANTE:** Copie o `token` da resposta!

## 🔑 Teste 2: Fazer Login (SEM TOKEN)

### **POST** `http://127.0.0.1:8000/api/auth/login/`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "username": "admin",
    "password": "admin"
}
```

**Resposta Esperada:**
```json
{
    "usuario": {
        "id": 1,
        "username": "admin",
        "email": "admin@admin.com",
        "first_name": "",
        "last_name": "",
        "cpf": "",
        "telefone": "",
        "is_active": true,
        "is_staff": true
    },
    "token": "xyz789abc123def456...",
    "message": "Login realizado com sucesso!"
}
```

## 👤 Teste 3: Ver Perfil (COM TOKEN)

### **GET** `http://127.0.0.1:8000/api/auth/me/`

**Headers:**
```
Content-Type: application/json
Authorization: Token SEU_TOKEN_AQUI
```

**Resposta Esperada:**
```json
{
    "id": 1,
    "username": "admin",
    "email": "admin@admin.com",
    "first_name": "",
    "last_name": "",
    "cpf": "",
    "telefone": "",
    "is_active": true,
    "is_staff": true,
    "date_joined": "2024-01-01T10:00:00Z"
}
```

## 📝 Teste 4: Listar Usuários (COM TOKEN)

### **GET** `http://127.0.0.1:8000/api/usuarios/`

**Headers:**
```
Content-Type: application/json
Authorization: Token SEU_TOKEN_AQUI
```

**Resposta Esperada:**
```json
{
    "count": 2,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1,
            "username": "admin",
            "email": "admin@admin.com",
            "first_name": "",
            "last_name": "",
            "cpf": "",
            "telefone": "",
            "is_active": true,
            "is_staff": true
        },
        {
            "id": 2,
            "username": "teste123",
            "email": "teste@email.com",
            "first_name": "João",
            "last_name": "Silva",
            "cpf": "123.456.789-00",
            "telefone": "(65) 99999-9999",
            "is_active": true,
            "is_staff": false
        }
    ]
}
```

## 🔄 Teste 5: Atualizar Perfil (COM TOKEN)

### **PUT** `http://127.0.0.1:8000/api/auth/me/`

**Headers:**
```
Content-Type: application/json
Authorization: Token SEU_TOKEN_AQUI
```

**Body (JSON):**
```json
{
    "first_name": "João Atualizado",
    "last_name": "Silva Santos",
    "telefone": "(65) 88888-8888"
}
```

## 🔒 Teste 6: Alterar Senha (COM TOKEN)

### **POST** `http://127.0.0.1:8000/api/auth/change-password/`

**Headers:**
```
Content-Type: application/json
Authorization: Token SEU_TOKEN_AQUI
```

**Body (JSON):**
```json
{
    "old_password": "senha123",
    "new_password": "novaSenha456",
    "new_password_confirm": "novaSenha456"
}
```

## 🚪 Teste 7: Logout (COM TOKEN)

### **POST** `http://127.0.0.1:8000/api/auth/logout/`

**Headers:**
```
Content-Type: application/json
Authorization: Token SEU_TOKEN_AQUI
```

## ⚠️ Problemas Comuns e Soluções

### **1. "Credenciais inválidas"**
- **Causa:** Usuário não existe ou senha errada
- **Solução:** Use o usuário `admin` com senha `admin` primeiro

### **2. "Authentication credentials were not provided"**
- **Causa:** Token não enviado no header
- **Solução:** Adicione `Authorization: Token SEU_TOKEN` no header

### **3. "You do not have permission to perform this action"**
- **Causa:** Usuário não tem permissão
- **Solução:** Use um usuário com `is_staff: true`

### **4. "Connection refused"**
- **Causa:** Servidor não está rodando
- **Solução:** Execute `python manage.py runserver 127.0.0.1:8000`

## 📱 Configuração no Postman

### **1. Criar Collection**
- Nome: "API Usuários"
- Base URL: `http://127.0.0.1:8000`

### **2. Configurar Variáveis**
- `base_url`: `http://127.0.0.1:8000`
- `token`: (será preenchido automaticamente)

### **3. Configurar Pre-request Script**
```javascript
// Para salvar token automaticamente
if (pm.response.code === 200 || pm.response.code === 201) {
    const response = pm.response.json();
    if (response.token) {
        pm.environment.set("token", response.token);
    }
}
```

### **4. Configurar Authorization**
- Type: `Bearer Token`
- Token: `{{token}}`

## 🎯 Ordem de Testes Recomendada

1. **Registrar usuário** → Copiar token
2. **Fazer login** → Copiar token
3. **Ver perfil** → Testar token
4. **Listar usuários** → Testar permissões
5. **Atualizar perfil** → Testar edição
6. **Alterar senha** → Testar segurança
7. **Logout** → Testar encerramento

## 🔧 Troubleshooting

### **Verificar se servidor está rodando:**
```bash
curl http://127.0.0.1:8000/api/usuarios/
```

### **Verificar logs do Django:**
```bash
python manage.py runserver 127.0.0.1:8000 --verbosity=2
```

### **Verificar usuários no banco:**
```bash
python manage.py shell -c "from usuarios.models import Usuario; print([(u.username, u.email) for u in Usuario.objects.all()])"
```

---

**🎉 Agora você pode testar toda a API no Postman!**
