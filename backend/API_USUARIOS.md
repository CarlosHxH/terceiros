# 🔐 API de Usuários - JWT e Permissões

## 📋 Visão Geral

API de usuários com autenticação via JWT (access/refresh), permissões do Django e endpoints REST para integração com frontend.

## 🔒 Autenticação e Headers

- **Header para rotas protegidas:**
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```
- Para registrar, logar e renovar token não envie Authorization.

## 🚀 Endpoints

### 1) Autenticação (público, exceto onde indicado)

#### POST `/api/auth/register/`
Registrar novo usuário (retorna tokens)

Request:
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
Response:
```json
{
    "usuario": { /* dados do usuário */ },
    "tokens": { "access": "...", "refresh": "..." },
    "message": "Usuário criado com sucesso!"
}
```

#### POST `/api/auth/login/`
Fazer login com username OU email (retorna tokens)

Request (username):
```json
{ "username": "usuario123", "password": "senha123" }
```
Request (email):
```json
{ "email": "usuario@email.com", "password": "senha123" }
```
Response:
```json
{
    "usuario": { /* dados do usuário */ },
    "tokens": { "access": "...", "refresh": "..." },
    "message": "Login realizado com sucesso!"
}
```

#### POST `/api/auth/token/`
Obter tokens (JWT padrão customizado) – aceita username OU email

Request (username):
```json
{ "username": "usuario123", "password": "senha123" }
```
Request (email):
```json
{ "email": "usuario@email.com", "password": "senha123" }
```
Response:
```json
{ "access": "...", "refresh": "..." }
```

#### POST `/api/auth/refresh-token/`
Renovar access token usando refresh token (custom)

Request:
```json
{ "refresh": "<refresh_token>" }
```
Response:
```json
{ "access": "...", "message": "Token renovado com sucesso!" }
```

#### POST `/api/auth/token/refresh/`
Renovar access token (endpoint padrão SimpleJWT)

Request:
```json
{ "refresh": "<refresh_token>" }
```
Response:
```json
{ "access": "..." }
```

#### POST `/api/auth/token/verify/`
Verificar se um token é válido (padrão SimpleJWT)

Request:
```json
{ "token": "<access_ou_refresh_token>" }
```

### 2) Perfil do Usuário (protegido)

#### GET `/api/auth/me/`
Obter dados do usuário logado

Response:
```json
{ /* dados do usuário */ }
```

#### PUT `/api/auth/me/update/`
Atualizar dados do usuário logado (parcial)

Request (exemplo):
```json
{
    "first_name": "João Atualizado",
    "last_name": "Silva Santos",
    "telefone": "(65) 88888-8888"
}
```
Response:
```json
{
    "usuario": { /* dados atualizados */ },
    "message": "Perfil atualizado com sucesso!"
}
```

#### POST `/api/auth/change-password/`
Alterar senha

Request:
```json
{
    "old_password": "senha_atual",
    "new_password": "novaSenha456",
    "new_password_confirm": "novaSenha456"
}
```
Response:
```json
{ "message": "Senha alterada com sucesso!" }
```

#### POST `/api/auth/logout/`
Logout (com JWT é frontend-removendo tokens). Endpoint retorna mensagem.

Response:
```json
{ "message": "Logout realizado com sucesso!" }
```

### 3) Usuários (CRUD via ViewSet)

Base: `/api/usuarios/`

- GET `/api/usuarios/` – Listar usuários (protegido)
- GET `/api/usuarios/{id}/` – Detalhar usuário (protegido)
- POST `/api/usuarios/` – Criar usuário (usa `UsuarioCreateSerializer`) [no código atual está público]
- PUT `/api/usuarios/{id}/` – Atualizar usuário (protegido)
- PATCH `/api/usuarios/{id}/` – Atualização parcial (protegido)
- DELETE `/api/usuarios/{id}/` – Deletar usuário (apenas staff)

Observação: para registro com emissão de tokens prefira `/api/auth/register/`.

### 4) Administração (apenas staff)

#### POST `/api/usuarios/{id}/toggle_active/`
Ativar/Desativar usuário

Response:
```json
{ "message": "Usuário ativado/desativado com sucesso!", "is_active": true }
```

#### POST `/api/usuarios/{id}/toggle_staff/`
Promover/Remover staff

Response:
```json
{ "message": "Usuário promovido a staff/removido do staff com sucesso!", "is_staff": true }
```

### 5) Terceiros (CRUD via ViewSet)

Base: `/api/terceiros/` (protegido por JWT)

- GET `/api/terceiros/` – Listar terceiros
- GET `/api/terceiros/{id}/` – Detalhar terceiro
- POST `/api/terceiros/` – Criar terceiro
- PUT `/api/terceiros/{id}/` – Atualizar terceiro
- PATCH `/api/terceiros/{id}/` – Atualização parcial
- DELETE `/api/terceiros/{id}/` – Deletar terceiro

Headers:
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

Body (exemplo genérico; ver `TerceiroSerializer` para campos reais):
```json
{
    /* campos do terceiro */
}
```

### 6) Funcionários (CRUD via ViewSet)

Base: `/api/funcionarios/` (protegido por JWT)

- GET `/api/funcionarios/` – Listar funcionários
- GET `/api/funcionarios/{id}/` – Detalhar funcionário
- POST `/api/funcionarios/` – Criar funcionário
- PUT `/api/funcionarios/{id}/` – Atualizar funcionário
- PATCH `/api/funcionarios/{id}/` – Atualização parcial
- DELETE `/api/funcionarios/{id}/` – Deletar funcionário

Headers:
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

Body (exemplo genérico; ver `FuncionarioSerializer` para campos reais):
```json
{
    /* campos do funcionário */
}
```

## ❗ Erros Comuns

- Enviar `access` em `/auth/refresh-token/` → retornará "token_not_valid". Use o `refresh`.
- 404 em `/api/auth/loguin/` → rota correta é `/api/auth/login/`.

## 🧭 Dicas de Teste (Postman/Insomnia)

- Nas rotas públicas, deixe Authorization como "No Auth" e envie `Content-Type: application/json`.
- Nas rotas protegidas, use `Authorization: Bearer <access_token>`.

---

**🎯 Documentação pronta para uso com o backend atual (JWT).**
