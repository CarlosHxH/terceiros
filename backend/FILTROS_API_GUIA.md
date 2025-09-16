# 🔍 Guia Completo de Filtros da API de Relatórios

## 📋 **Como Usar os Filtros no DRF Spectacular**

### **1. Acessando a Documentação Interativa**

1. **Inicie o servidor Django:**
   ```bash
   python manage.py runserver
   ```

2. **Acesse o Swagger UI:**
   - URL: `http://localhost:8000/api/docs/`
   - Ou ReDoc: `http://localhost:8000/api/redoc/`

3. **Navegue até os endpoints de relatórios:**
   - Expanda a seção "relatorios"
   - Clique em qualquer endpoint (ex: `GET /api/relatorios/funcionarios/`)

### **2. Como o Swagger Mostra os Filtros**

No Swagger UI, você verá:

#### **📊 Seção "Parameters"**
- Lista todos os filtros disponíveis
- Mostra o tipo de cada filtro (string, date, boolean, etc.)
- Exibe descrições e exemplos
- Permite testar os filtros diretamente na interface

#### **🔧 Seção "Try it out"**
- Botão para expandir e testar o endpoint
- Campos de entrada para cada filtro
- Botão "Execute" para testar com os filtros
- Resposta em tempo real

---

## 🎯 **Endpoints e Filtros Disponíveis**

### **1. Funcionários** - `/api/relatorios/funcionarios/`

#### **Filtros Disponíveis:**
| Filtro | Tipo | Descrição | Exemplo |
|--------|------|-----------|---------|
| `nome` | string | Nome completo do funcionário | `João` |
| `empresa` | string | Nome da empresa | `ABC` |
| `cargo` | string | Nome do cargo | `Analista` |
| `cpf` | string | CPF do funcionário | `123.456.789-00` |
| `data_admissao_inicio` | date | Data admissão (início) | `2024-01-01` |
| `data_admissao_fim` | date | Data admissão (fim) | `2024-12-31` |
| `ativo` | boolean | Status do funcionário | `true` |
| `cidade` | string | Cidade da empresa | `Cuiabá` |

#### **Busca e Ordenação:**
- **`search`**: Busca em nome, sobrenome e CPF
- **`ordering`**: Ordenação por `data_admissao`, `usuario__first_name`, `created_at`

#### **Exemplos de Uso:**
```bash
# Buscar funcionários ativos da empresa ABC
GET /api/relatorios/funcionarios/?empresa=ABC&ativo=true

# Buscar funcionários admitidos em 2024
GET /api/relatorios/funcionarios/?data_admissao_inicio=2024-01-01&data_admissao_fim=2024-12-31

# Buscar por nome e ordenar por data de admissão
GET /api/relatorios/funcionarios/?nome=João&ordering=-data_admissao

# Buscar por CPF
GET /api/relatorios/funcionarios/?search=123.456.789-00
```

---

### **2. Prestações** - `/api/relatorios/prestacoes/`

#### **Filtros Disponíveis:**
| Filtro | Tipo | Descrição | Exemplo |
|--------|------|-----------|---------|
| `funcionario_nome` | string | Nome do funcionário | `João` |
| `empresa` | string | Nome da empresa | `ABC` |
| `data_inicio` | date | Data (início) | `2024-01-01` |
| `data_fim` | date | Data (fim) | `2024-01-31` |
| `validacao_gestor` | choice | Status de validação | `aprovada` |
| `valor_min` | number | Valor mínimo | `100.00` |
| `valor_max` | number | Valor máximo | `1000.00` |
| `local_prestacao` | string | Local de prestação | `Escritório` |
| `cidade` | string | Cidade | `Cuiabá` |

#### **Exemplos de Uso:**
```bash
# Prestações aprovadas de janeiro de 2024
GET /api/relatorios/prestacoes/?data_inicio=2024-01-01&data_fim=2024-01-31&validacao_gestor=aprovada

# Prestações com valor entre R$ 500 e R$ 1000
GET /api/relatorios/prestacoes/?valor_min=500.00&valor_max=1000.00

# Prestações do funcionário João
GET /api/relatorios/prestacoes/?funcionario_nome=João
```

---

### **3. Registros de Ponto** - `/api/relatorios/pontos/`

#### **Filtros Disponíveis:**
| Filtro | Tipo | Descrição | Exemplo |
|--------|------|-----------|---------|
| `funcionario_nome` | string | Nome do funcionário | `João` |
| `empresa` | string | Nome da empresa | `ABC` |
| `data_inicio` | datetime | Data (início) | `2024-01-01T00:00:00` |
| `data_fim` | datetime | Data (fim) | `2024-01-31T23:59:59` |

#### **Exemplos de Uso:**
```bash
# Registros de ponto de janeiro de 2024
GET /api/relatorios/pontos/?data_inicio=2024-01-01T00:00:00&data_fim=2024-01-31T23:59:59

# Registros do funcionário João
GET /api/relatorios/pontos/?funcionario_nome=João
```

---

### **4. Dashboard** - `/api/relatorios/dashboard/`

#### **4.1 Dashboard Geral** - `/api/relatorios/dashboard/geral/`
| Filtro | Tipo | Descrição | Exemplo |
|--------|------|-----------|---------|
| `empresa_id` | integer | ID da empresa | `1` |
| `data_inicio` | date | Data início | `2024-01-01` |
| `data_fim` | date | Data fim | `2024-12-31` |

#### **4.2 Dados para Gráficos** - `/api/relatorios/dashboard/graficos/`
| Filtro | Tipo | Descrição | Exemplo |
|--------|------|-----------|---------|
| `empresa_id` | integer | ID da empresa | `1` |
| `periodo` | integer | Período em dias | `30` |

#### **4.3 Relatório Financeiro** - `/api/relatorios/dashboard/financeiro/`
| Filtro | Tipo | Descrição | Exemplo |
|--------|------|-----------|---------|
| `data_inicio` | date | Data início | `2024-01-01` |
| `data_fim` | date | Data fim | `2024-01-31` |
| `empresa_id` | integer | ID da empresa | `1` |

---

## 🚀 **Como Testar no Swagger UI**

### **Passo a Passo:**

1. **Acesse o Swagger UI:**
   ```
   http://localhost:8000/api/docs/
   ```

2. **Navegue até um endpoint:**
   - Clique em "relatorios" para expandir
   - Clique em "GET /api/relatorios/funcionarios/"

3. **Teste os filtros:**
   - Clique em "Try it out"
   - Preencha os campos de filtro desejados
   - Clique em "Execute"
   - Veja a resposta com os dados filtrados

4. **Copie a URL gerada:**
   - O Swagger mostra a URL completa com os filtros
   - Exemplo: `http://localhost:8000/api/relatorios/funcionarios/?nome=João&ativo=true`

---

## 💡 **Dicas de Uso**

### **1. Combinação de Filtros**
Você pode combinar múltiplos filtros:
```bash
GET /api/relatorios/funcionarios/?empresa=ABC&cargo=Analista&ativo=true&data_admissao_inicio=2024-01-01
```

### **2. Busca Global**
Use o parâmetro `search` para busca em múltiplos campos:
```bash
GET /api/relatorios/funcionarios/?search=João
```

### **3. Ordenação**
Use o parâmetro `ordering` para ordenar os resultados:
```bash
GET /api/relatorios/funcionarios/?ordering=-data_admissao
```

### **4. Paginação**
Todos os endpoints suportam paginação automática:
```bash
GET /api/relatorios/funcionarios/?page=2&page_size=10
```

---

## 🔧 **Troubleshooting**

### **Problemas Comuns:**

1. **Filtro não funciona:**
   - Verifique se o nome do filtro está correto
   - Confirme o tipo de dados (string, date, boolean, etc.)
   - Verifique se o valor está no formato correto

2. **Data não encontrada:**
   - Use o formato YYYY-MM-DD para datas
   - Para datetime, use YYYY-MM-DDTHH:MM:SS

3. **Filtro de busca não retorna resultados:**
   - A busca é case-insensitive
   - Use busca parcial (não precisa do nome completo)

4. **Erro de autenticação:**
   - Certifique-se de estar logado
   - Verifique se o token JWT está válido

---

## 📚 **Recursos Adicionais**

- **Documentação completa**: `RELATORIOS_API_DOCUMENTATION.md`
- **Swagger UI**: `http://localhost:8000/api/docs/`
- **ReDoc**: `http://localhost:8000/api/redoc/`
- **Schema JSON**: `http://localhost:8000/api/schema/`

Este guia deve ajudar você a usar todos os filtros disponíveis na API de relatórios de forma eficiente! 🚀
