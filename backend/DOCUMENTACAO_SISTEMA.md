# 📚 Documentação Completa do Sistema - APIs e Autenticação

## 📋 Índice

1. [Visão Geral do Sistema](#-visão-geral-do-sistema)
2. [Arquitetura e Módulos](#-arquitetura-e-módulos)
3. [Sistema de Autenticação](#-sistema-de-autenticação)
4. [APIs Disponíveis](#-apis-disponíveis)
5. [Validações e Segurança](#-validações-e-segurança)
6. [Sistema de Ponto](#-sistema-de-ponto)
7. [Configurações Técnicas](#-configurações-técnicas)
8. [Guia de Uso](#-guia-de-uso)
9. [Exemplos de Integração](#-exemplos-de-integração)
10. [Troubleshooting](#-troubleshooting)

---

## 🏗️ Visão Geral do Sistema

Sistema Django REST Framework completo para gestão de terceiros, funcionários e controle de ponto, com autenticação robusta via token e sistema de permissões granular.

### **Características Principais:**
- ✅ **Autenticação via Token** - Segura e escalável
- ✅ **Sistema de Permissões** - 3 níveis de acesso
- ✅ **Validações Completas** - CPF, email, senhas
- ✅ **API RESTful** - Padrões REST implementados
- ✅ **Sistema de Ponto Avançado** - Com GPS
- ✅ **CORS Configurado** - Pronto para frontend
- ✅ **Documentação Completa** - Guias para testes

---

## 🏗️ Arquitetura e Módulos

### **Estrutura do Projeto:**
```
backend/
├── core/                    # Configurações principais
├── usuarios/               # Sistema de autenticação
├── terceiros/             # Gestão de terceiros
├── funcionarios/          # Gestão de funcionários
├── ponto/                 # Sistema de registro de ponto
├── empresas/              # Gestão de empresas
├── localizacao/           # Dados de localização
├── prestacoes/            # Prestações de serviços
├── relatorios/            # Geração de relatórios
└── db.sqlite3            # Banco de dados SQLite
```

### **Módulos Principais:**

| Módulo | Descrição | Endpoint Base |
|--------|-----------|---------------|
| **usuarios** | Autenticação e gerenciamento de usuários | `/api/usuarios/` |
| **terceiros** | Gestão de terceiros | `/api/terceiros/` |
| **funcionarios** | Gestão de funcionários | `/api/funcionarios/` |
| **ponto** | Sistema de registro de ponto | `/api/ponto/` |
| **empresas** | Gestão de empresas | `/api/empresas/` |
| **localizacao** | Dados de localização | `/api/localizacao/` |
| **prestacoes** | Prestações de serviços | `/api/prestacoes/` |
| **relatorios** | Geração de relatórios | `/api/relatorios/` |

---

## 🔐 Sistema de Autenticação

### **1. Modelo de Usuário Customizado**

```python
class Usuario(AbstractUser):
    """Extensão do modelo User padrão do Django"""
    cpf = models.CharField(
        max_length=14,
        unique=True,
        validators=[RegexValidator(r'^\d{3}\.\d{3}\.\d{3}-\d{2}$', 'CPF deve estar no formato XXX.XXX.XXX-XX')]
    )
    telefone = models.CharField(max_length=15, blank=True)
    # campo de foto removido
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### **2. Tipos de Autenticação Configurados**

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',  # Para admin Django
        'rest_framework.authentication.TokenAuthentication',    # Para APIs REST
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}
```

### **3. Níveis de Permissão**

| Nível | Classe | Acesso |
|-------|--------|--------|
| **Anônimo** | `AllowAny` | Registro e login (público) |
| **Usuário** | `IsAuthenticated` | Próprio perfil e listagem |
| **Staff** | `IsAdminUser` | Gerenciamento completo |

---

## 🚀 APIs Disponíveis

### **Módulo Usuários (`/api/usuarios/` e `/api/auth/`)**

#### **🔑 Endpoints de Autenticação**

##### **POST** `/api/auth/register/`
**Registrar novo usuário** (público)

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
        "is_staff": false,
        "date_joined": "2024-01-01T10:00:00Z"
    },
    "token": "abc123def456...",
    "message": "Usuário criado com sucesso!"
}
```

##### **POST** `/api/auth/login/`
**Fazer login** (público)

**Request:**
```json
{
    "username": "usuario123",
    "password": "senha123"
}
```

**Response:**
```json
{
    "usuario": { /* dados do usuário */ },
    "token": "abc123def456...",
    "message": "Login realizado com sucesso!"
}
```

##### **POST** `/api/auth/logout/`
**Fazer logout** (requer autenticação)

**Headers:**
```http
Authorization: Token abc123def456...
Content-Type: application/json
```

#### **👤 Endpoints de Perfil**

##### **GET** `/api/auth/me/`
**Obter dados do usuário logado** (requer autenticação)

##### **PUT** `/api/auth/me/`
**Atualizar perfil** (requer autenticação)

**Request:**
```json
{
    "first_name": "João Atualizado",
    "last_name": "Silva Santos",
    "telefone": "(65) 88888-8888"
}
```

##### **POST** `/api/auth/change-password/`
**Alterar senha** (requer autenticação)

**Request:**
```json
{
    "old_password": "senha123",
    "new_password": "novaSenha456",
    "new_password_confirm": "novaSenha456"
}
```

#### **👥 Endpoints de Gerenciamento**

##### **GET** `/api/usuarios/`
**Listar usuários** (requer autenticação)

**Response:**
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
        }
    ]
}
```

##### **GET** `/api/usuarios/{id}/`
**Obter usuário específico** (requer autenticação)

##### **PUT** `/api/usuarios/{id}/`
**Atualizar usuário** (próprio usuário ou staff)

##### **DELETE** `/api/usuarios/{id}/`
**Deletar usuário** (apenas staff)

#### **🔧 Endpoints de Administração (Staff)**

##### **POST** `/api/usuarios/{id}/toggle_active/`
**Ativar/Desativar usuário**

##### **POST** `/api/usuarios/{id}/toggle_staff/`
**Promover/Remover permissões de staff**

---

## 🛡️ Validações e Segurança

### **Validações Implementadas:**

| Campo | Validação | Descrição |
|-------|-----------|-----------|
| **CPF** | Formato e unicidade | `XXX.XXX.XXX-XX` e único no sistema |
| **Email** | Formato e unicidade | Email válido e único no sistema |
| **Username** | Unicidade | Nome de usuário único |
| **Password** | Complexidade | Comprimento mínimo e validações Django |
| **Password Confirm** | Confirmação | Deve coincidir com a senha |
| **Old Password** | Verificação | Senha atual correta para alteração |

### **Controle de Acesso:**

- **Usuários comuns:** Podem editar apenas próprio perfil
- **Staff:** Podem gerenciar todos os usuários
- **Admin:** Acesso total ao sistema

### **Headers de Segurança:**

```http
Content-Type: application/json
Authorization: Token abc123def456...
```

---

## 📍 Sistema de Ponto

### **Modelo RegistroPonto:**

```python
class RegistroPonto(models.Model):
    """
    Registro de ponto dos funcionários.
    Responsável por armazenar a foto (comprovante), IP, latitude, longitude e o funcionário relacionado.
    Utilizado para validação de presença/autenticação do usuário no local.
    """
    foto = models.ImageField(upload_to='pontos/%Y/%m/', help_text="Foto do funcionário no momento do ponto")
    ip = models.CharField(max_length=100, help_text="IP do dispositivo no momento do registro")
    latitude = models.DecimalField(max_digits=10, decimal_places=8, help_text="Latitude do local do ponto")
    longitude = models.DecimalField(max_digits=11, decimal_places=8, help_text="Longitude do local do ponto")
    funcionario = models.ForeignKey('funcionarios.Funcionario', on_delete=models.PROTECT, related_name='pontos')
    created_at = models.DateTimeField(auto_now_add=True, help_text="Data e hora do registro do ponto")
    updated_at = models.DateTimeField(auto_now=True)
```

### **Funcionalidades do Sistema de Ponto:**

- ✅ **Registro com Foto** - Comprovante visual do funcionário
- ✅ **Captura de IP** - Identificação do dispositivo
- ✅ **Geolocalização** - Latitude e longitude via GPS
- ✅ **Vinculação com Funcionário** - Relacionamento direto
- ✅ **Organização por Data** - Armazenamento em pastas por ano/mês
- ✅ **Timestamps** - Data e hora automáticas

---

## ⚙️ Configurações Técnicas

### **Django REST Framework:**

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20
}
```

### **CORS Configurado:**

```python
CORS_ALLOW_ALL_ORIGINS = True
```

### **Aplicações Instaladas:**

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'terceiros',
    'usuarios',
    'empresas',
    'funcionarios',
    'localizacao',
    'prestacoes',
    'relatorios',
    'ponto',
]
```

### **Configurações de Banco:**

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

---

## 📖 Guia de Uso

### **1. Configuração Inicial**

```bash
# Instalar dependências
pip install -r requirements.txt

# Executar migrações
python manage.py migrate

# Criar superusuário
python manage.py createsuperuser

# Executar servidor
python manage.py runserver 127.0.0.1:8000
```

### **2. Testando com Postman**

#### **Configuração Base:**
- **URL Base:** `http://127.0.0.1:8000`
- **Headers Padrão:** `Content-Type: application/json`

#### **Ordem de Testes Recomendada:**

1. **Registrar usuário** → Copiar token
2. **Fazer login** → Copiar token
3. **Ver perfil** → Testar token
4. **Listar usuários** → Testar permissões
5. **Atualizar perfil** → Testar edição
6. **Alterar senha** → Testar segurança
7. **Logout** → Testar encerramento

### **3. Headers Necessários para Autenticação**

```http
Content-Type: application/json
Authorization: Token abc123def456...
```

---

## 💻 Exemplos de Integração

### **JavaScript/React:**

```javascript
// Configuração base
const API_BASE = 'http://127.0.0.1:8000/api';
const token = localStorage.getItem('token');

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`
};

// Registrar usuário
const registerUser = async (userData) => {
    const response = await fetch(`${API_BASE}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    return response.json();
};

// Fazer login
const loginUser = async (credentials) => {
    const response = await fetch(`${API_BASE}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    return response.json();
};

// Obter perfil
const getProfile = async () => {
    const response = await fetch(`${API_BASE}/auth/me/`, {
        headers: headers
    });
    return response.json();
};

// Listar usuários
const getUsers = async () => {
    const response = await fetch(`${API_BASE}/usuarios/`, {
        headers: headers
    });
    return response.json();
};

// Atualizar perfil
const updateProfile = async (userData) => {
    const response = await fetch(`${API_BASE}/auth/me/`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(userData)
    });
    return response.json();
};
```

### **Python/Requests:**

```python
import requests

# Configuração base
API_BASE = 'http://127.0.0.1:8000/api'
token = 'abc123def456...'

headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Token {token}'
}

# Registrar usuário
def register_user(user_data):
    response = requests.post(f'{API_BASE}/auth/register/', json=user_data)
    return response.json()

# Fazer login
def login_user(credentials):
    response = requests.post(f'{API_BASE}/auth/login/', json=credentials)
    return response.json()

# Obter perfil
def get_profile():
    response = requests.get(f'{API_BASE}/auth/me/', headers=headers)
    return response.json()

# Listar usuários
def get_users():
    response = requests.get(f'{API_BASE}/usuarios/', headers=headers)
    return response.json()
```

---

## 🔧 Troubleshooting

### **Problemas Comuns e Soluções:**

#### **1. "Credenciais inválidas"**
- **Causa:** Usuário não existe ou senha errada
- **Solução:** Use o usuário `admin` com senha `admin` primeiro

#### **2. "Authentication credentials were not provided"**
- **Causa:** Token não enviado no header
- **Solução:** Adicione `Authorization: Token SEU_TOKEN` no header

#### **3. "You do not have permission to perform this action"**
- **Causa:** Usuário não tem permissão
- **Solução:** Use um usuário com `is_staff: true`

#### **4. "Connection refused"**
- **Causa:** Servidor não está rodando
- **Solução:** Execute `python manage.py runserver 127.0.0.1:8000`

#### **5. "CPF deve estar no formato XXX.XXX.XXX-XX"**
- **Causa:** Formato de CPF inválido
- **Solução:** Use o formato correto: `123.456.789-00`

### **Comandos de Verificação:**

```bash
# Verificar se servidor está rodando
curl http://127.0.0.1:8000/api/usuarios/

# Verificar logs do Django
python manage.py runserver 127.0.0.1:8000 --verbosity=2

# Verificar usuários no banco
python manage.py shell -c "from usuarios.models import Usuario; print([(u.username, u.email) for u in Usuario.objects.all()])"
```

---

## 📊 Códigos de Status HTTP

| Código | Descrição | Quando Ocorre |
|--------|-----------|---------------|
| **200** | OK | Sucesso na operação |
| **201** | Created | Usuário criado com sucesso |
| **400** | Bad Request | Dados inválidos |
| **401** | Unauthorized | Não autenticado |
| **403** | Forbidden | Sem permissão |
| **404** | Not Found | Usuário não encontrado |
| **500** | Internal Server Error | Erro interno do servidor |

---

## 🎯 Próximos Passos

### **Melhorias Recomendadas:**

1. **Segurança:**
   - Implementar rate limiting
   - Adicionar logs de auditoria
   - Configurar HTTPS em produção
   - Implementar refresh token

2. **Funcionalidades:**
   - Recuperação de senha por email
   - Verificação de email na criação
   - Sistema de notificações

3. **Performance:**
   - Implementar cache para consultas frequentes
   - Otimizar queries com select_related/prefetch_related
   - Implementar paginação avançada

4. **Monitoramento:**
   - Adicionar métricas de uso
   - Implementar health checks
   - Configurar alertas

---

## 📞 Suporte

Para dúvidas ou problemas:

1. **Verifique a documentação** completa acima
2. **Consulte os logs** do Django
3. **Teste com Postman** usando o guia fornecido
4. **Verifique as permissões** do usuário

---

**🎉 Sistema pronto para produção e integração com frontend!**

*Documentação gerada automaticamente baseada na análise do código fonte.*
