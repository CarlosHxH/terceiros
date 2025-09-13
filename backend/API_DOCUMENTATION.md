# 📚 Documentação da API - Sistema de Terceirizados

## 📋 Visão Geral

Este documento descreve todas as APIs disponíveis no sistema de gerenciamento de terceirizados. O sistema foi desenvolvido com Django REST Framework seguindo padrões consistentes de desenvolvimento.

## 🚀 Endpoints Disponíveis

### 🔐 **AUTENTICAÇÃO E USUÁRIOS**

#### Usuários
```
GET    /api/usuarios/                    # Listar usuários
POST   /api/usuarios/                    # Criar usuário
GET    /api/usuarios/{id}/               # Detalhar usuário
PUT    /api/usuarios/{id}/               # Atualizar usuário
DELETE /api/usuarios/{id}/               # Deletar usuário
```

### 👥 **FUNCIONÁRIOS**

#### Funcionários
```
GET    /api/funcionarios/                # Listar funcionários
POST   /api/funcionarios/                # Criar funcionário
GET    /api/funcionarios/{id}/           # Detalhar funcionário
PUT    /api/funcionarios/{id}/           # Atualizar funcionário
DELETE /api/funcionarios/{id}/           # Deletar funcionário
```

### 🏢 **EMPRESAS**

#### Empresas Terceirizadas
```
GET    /api/empresas/                    # Listar empresas
POST   /api/empresas/                    # Criar empresa
GET    /api/empresas/{id}/               # Detalhar empresa
PUT    /api/empresas/{id}/               # Atualizar empresa
DELETE /api/empresas/{id}/               # Deletar empresa
```

#### Gestores
```
GET    /api/gestores/                    # Listar gestores
POST   /api/gestores/                    # Criar gestor
GET    /api/gestores/{id}/               # Detalhar gestor
PUT    /api/gestores/{id}/               # Atualizar gestor
DELETE /api/gestores/{id}/               # Deletar gestor
```

### ⏰ **PONTO**

#### Registros de Ponto
```
GET    /api/pontos/                      # Listar registros de ponto
POST   /api/pontos/                      # Criar registro de ponto
GET    /api/pontos/{id}/                 # Detalhar registro
PUT    /api/pontos/{id}/                 # Atualizar registro
DELETE /api/pontos/{id}/                 # Deletar registro
```

### 💼 **PRESTAÇÕES DE SERVIÇO**

#### Registros de Prestação
```
GET    /api/prestacoes/                  # Listar prestações
POST   /api/prestacoes/                  # Criar prestação
GET    /api/prestacoes/{id}/             # Detalhar prestação
PUT    /api/prestacoes/{id}/             # Atualizar prestação
DELETE /api/prestacoes/{id}/             # Deletar prestação
```

#### Histórico de Validações
```
GET    /api/historico-validacoes/        # Listar histórico
POST   /api/historico-validacoes/        # Criar histórico
GET    /api/historico-validacoes/{id}/   # Detalhar histórico
PUT    /api/historico-validacoes/{id}/   # Atualizar histórico
DELETE /api/historico-validacoes/{id}/   # Deletar histórico
```

### 📍 **LOCALIZAÇÃO**

#### Estados
```
GET    /api/estados/                     # Listar estados
POST   /api/estados/                     # Criar estado
GET    /api/estados/{id}/                # Detalhar estado
PUT    /api/estados/{id}/                # Atualizar estado
DELETE /api/estados/{id}/                # Deletar estado
```

#### Cidades
```
GET    /api/cidades/                     # Listar cidades
POST   /api/cidades/                     # Criar cidade
GET    /api/cidades/{id}/                # Detalhar cidade
PUT    /api/cidades/{id}/                # Atualizar cidade
DELETE /api/cidades/{id}/                # Deletar cidade
```

#### Locais de Prestação
```
GET    /api/locais-prestacao/            # Listar locais
POST   /api/locais-prestacao/            # Criar local
GET    /api/locais-prestacao/{id}/       # Detalhar local
PUT    /api/locais-prestacao/{id}/       # Atualizar local
DELETE /api/locais-prestacao/{id}/       # Deletar local
```

### 📊 **RELATÓRIOS**

#### Relatórios Personalizados
```
GET    /api/relatorios/                  # Listar relatórios
POST   /api/relatorios/                  # Criar relatório
GET    /api/relatorios/{id}/             # Detalhar relatório
PUT    /api/relatorios/{id}/             # Atualizar relatório
DELETE /api/relatorios/{id}/             # Deletar relatório
```

## 📖 Documentação Interativa

### Swagger UI
Acesse a documentação interativa completa em:
```
http://127.0.0.1:8000/api/schema/swagger-ui/
```

### ReDoc
Documentação alternativa em formato ReDoc:
```
http://127.0.0.1:8000/api/schema/redoc/
```

### Schema JSON
Schema completo da API em formato JSON:
```
http://127.0.0.1:8000/api/schema/
```

## 🏗️ Arquitetura da API

### Padrões Implementados

1. **ViewSets**: Todas as APIs utilizam `ModelViewSet` do Django REST Framework
2. **Serializers**: Utilizando `ModelSerializer` com `fields = '__all__'`
3. **Routers**: Implementação com `DefaultRouter` para URLs automáticas
4. **CRUD Completo**: Todas as operações Create, Read, Update, Delete disponíveis
5. **Documentação**: Integração com drf-spectacular para documentação automática

### Estrutura de Arquivos

```
backend/
├── core/
│   └── urls.py                          # URLs principais
├── usuarios/
│   ├── models.py                        # Modelo Usuario
│   ├── serializers.py                   # Serializers
│   ├── views.py                         # ViewSets
│   └── urls.py                          # URLs da app
├── funcionarios/
│   ├── models.py                        # Modelos Funcionario, Cargo
│   ├── serializers.py                   # Serializers
│   ├── views.py                         # ViewSets
│   └── urls.py                          # URLs da app
├── empresas/
│   ├── models.py                        # Modelos EmpresaTerceirizada, Gestor
│   ├── serializers.py                   # Serializers
│   ├── views.py                         # ViewSets
│   └── urls.py                          # URLs da app
├── ponto/
│   ├── models.py                        # Modelo RegistroPonto
│   ├── serializers.py                   # Serializers
│   ├── views.py                         # ViewSets
│   └── urls.py                          # URLs da app
├── prestacoes/
│   ├── models.py                        # Modelos RegistroPrestacao, HistoricoValidacao
│   ├── serializers.py                   # Serializers
│   ├── views.py                         # ViewSets
│   └── urls.py                          # URLs da app
├── localizacao/
│   ├── models.py                        # Modelos Estado, Cidade, LocalPrestacao
│   ├── serializers.py                   # Serializers
│   ├── views.py                         # ViewSets
│   └── urls.py                          # URLs da app
└── relatorios/
    ├── models.py                        # Modelo RelatorioPersonalizado
    ├── serializers.py                   # Serializers
    ├── views.py                         # ViewSets
    └── urls.py                          # URLs da app
```

## 🔧 Configuração e Uso

### Pré-requisitos
- Python 3.12+
- Django 5.2.6
- Django REST Framework
- drf-spectacular (documentação)

### Executando o Servidor
```bash
# Ativar ambiente virtual
source venv/bin/activate

# Executar migrações
python manage.py migrate

# Iniciar servidor
python manage.py runserver
```

### Acessando a API
- **Base URL**: `http://127.0.0.1:8000/api/`
- **Admin**: `http://127.0.0.1:8000/admin/`
- **Documentação**: `http://127.0.0.1:8000/api/schema/swagger-ui/`

## 📝 Exemplos de Uso

### Criar uma Empresa
```bash
curl -X POST http://127.0.0.1:8000/api/empresas/ \
  -H "Content-Type: application/json" \
  -d '{
    "razao_social": "Empresa Exemplo LTDA",
    "nome_fantasia": "Exemplo Corp",
    "cnpj": "12.345.678/0001-90",
    "telefone": "(11) 99999-9999",
    "email": "contato@exemplo.com"
  }'
```

### Listar Funcionários
```bash
curl -X GET http://127.0.0.1:8000/api/funcionarios/
```

### Criar Registro de Ponto
```bash
curl -X POST http://127.0.0.1:8000/api/pontos/ \
  -H "Content-Type: application/json" \
  -d '{
    "funcionario": 1,
    "latitude": -23.5505,
    "longitude": -46.6333,
    "ip": "192.168.1.100"
  }'
```

## 🛡️ Segurança

- Todas as APIs utilizam autenticação JWT
- Validação de dados com serializers
- Campos de auditoria (`created_at`, `updated_at`) em todos os modelos
- Validações de integridade referencial

## 📊 Status dos Modelos

| Modelo | Campos de Auditoria | API | Admin |
|--------|-------------------|-----|-------|
| Usuario | ✅ | ✅ | ✅ |
| Funcionario | ✅ | ✅ | ✅ |
| Cargo | ✅ | ✅ | ✅ |
| EmpresaTerceirizada | ✅ | ✅ | ✅ |
| Gestor | ✅ | ✅ | ✅ |
| RegistroPonto | ✅ | ✅ | ❌ |
| RegistroPrestacao | ✅ | ✅ | ❌ |
| HistoricoValidacao | ✅ | ✅ | ❌ |
| Estado | ✅ | ✅ | ❌ |
| Cidade | ✅ | ✅ | ❌ |
| LocalPrestacao | ✅ | ✅ | ❌ |
| RelatorioPersonalizado | ✅ | ✅ | ❌ |

## 🔄 Versionamento

- **Versão Atual**: 1.0.0
- **Última Atualização**: Setembro 2025
- **Compatibilidade**: Django 5.2.6+

---

**Desenvolvido com ❤️ usando Django REST Framework**
