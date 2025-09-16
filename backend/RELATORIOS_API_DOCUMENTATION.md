# 📊 API de Relatórios - Documentação Completa

## 🎯 **Visão Geral**

Esta documentação descreve a API de relatórios do sistema de terceiros, implementada com **Django Filter** para filtros avançados e endpoints específicos para dashboards. A API oferece dados prontos para uso no frontend, eliminando a necessidade de processamento complexo no cliente.

**⚠️ IMPORTANTE**: Esta app não possui modelos próprios. Ela serve apenas como namespace para endpoints filtrados que consomem dados diretamente dos modelos das outras apps do sistema.

## 🏗️ **Arquitetura da Solução**

### **Tecnologias Utilizadas**
- **Backend**: Django + Django REST Framework
- **Filtros**: Django Filter (django-filter)
- **Frontend**: Next.js + Tailwind CSS
- **Autenticação**: JWT (Simple JWT)

### **Estrutura dos Endpoints**
```
/api/relatorios/
├── funcionarios/          # Gestão de funcionários (dados de funcionarios.models)
├── prestacoes/           # Gestão de prestações (dados de prestacoes.models)
├── pontos/               # Gestão de registros de ponto (dados de ponto.models)
└── dashboard/            # Dados para dashboards (agregados de todas as apps)
```

---

## 🔧 **Configuração do Django Filter**

### **1. Instalação**
```bash
pip install django-filter
```

### **2. Configuração no settings.py**
```python
INSTALLED_APPS = [
    # ... outras apps
    'django_filters',
]

REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
}
```

---

## 📋 **Endpoints Disponíveis**

### **1. Funcionários** - `/api/relatorios/funcionarios/`

#### **Métodos Disponíveis**
- `GET /api/relatorios/funcionarios/` - Lista funcionários
- `GET /api/relatorios/funcionarios/{id}/` - Detalhes do funcionário
- `GET /api/relatorios/funcionarios/estatisticas/` - Estatísticas

#### **Filtros Disponíveis**
| Parâmetro | Tipo | Descrição | Exemplo |
|-----------|------|-----------|---------|
| `nome` | string | Nome do funcionário | `?nome=João` |
| `empresa` | string | Nome da empresa | `?empresa=ABC` |
| `cargo` | string | Nome do cargo | `?cargo=Analista` |
| `cpf` | string | CPF do funcionário | `?cpf=123.456.789-00` |
| `data_admissao_inicio` | date | Data admissão (início) | `?data_admissao_inicio=2024-01-01` |
| `data_admissao_fim` | date | Data admissão (fim) | `?data_admissao_fim=2024-12-31` |
| `ativo` | boolean | Funcionário ativo | `?ativo=true` |
| `cidade` | string | Cidade da empresa | `?cidade=Cuiabá` |

#### **Busca e Ordenação**
- **Busca**: `?search=João` (busca em nome, sobrenome e CPF)
- **Ordenação**: `?ordering=nome` ou `?ordering=-data_admissao`

#### **Exemplos de Uso**

```bash
# Buscar funcionários ativos da empresa ABC
GET /api/relatorios/funcionarios/?empresa=ABC&ativo=true

# Buscar funcionários admitidos em 2024
GET /api/relatorios/funcionarios/?data_admissao_inicio=2024-01-01&data_admissao_fim=2024-12-31

# Buscar por nome e ordenar por data de admissão
GET /api/relatorios/funcionarios/?nome=João&ordering=-data_admissao

# Estatísticas dos funcionários
GET /api/relatorios/funcionarios/estatisticas/
```

#### **Resposta da API**
```json
{
  "count": 25,
  "next": "http://localhost:8000/api/relatorios/funcionarios/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "nome_completo": "João Silva",
      "cpf": "123.456.789-00",
      "telefone": "(65) 99999-9999",
      "empresa": 1,
      "empresa_nome": "Empresa ABC",
      "cargo": 1,
      "cargo_nome": "Analista",
      "data_admissao": "2024-01-15",
      "data_demissao": null,
      "registro": "EMP001",
      "pix": "joao@email.com",
      "banco": "Banco do Brasil",
      "agencia": "1234",
      "conta": "56789-0",
      "ativo": true,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### **2. Prestações** - `/api/relatorios/prestacoes/`

#### **Métodos Disponíveis**
- `GET /api/relatorios/prestacoes/` - Lista prestações
- `GET /api/relatorios/prestacoes/{id}/` - Detalhes da prestação
- `GET /api/relatorios/prestacoes/estatisticas/` - Estatísticas

#### **Filtros Disponíveis**
| Parâmetro | Tipo | Descrição | Exemplo |
|-----------|------|-----------|---------|
| `funcionario_nome` | string | Nome do funcionário | `?funcionario_nome=João` |
| `empresa` | string | Nome da empresa | `?empresa=ABC` |
| `data_inicio` | date | Data (início) | `?data_inicio=2024-01-01` |
| `data_fim` | date | Data (fim) | `?data_fim=2024-01-31` |
| `validacao_gestor` | choice | Status de validação | `?validacao_gestor=aprovada` |
| `valor_min` | number | Valor mínimo | `?valor_min=100.00` |
| `valor_max` | number | Valor máximo | `?valor_max=1000.00` |
| `local_prestacao` | string | Local de prestação | `?local_prestacao=Escritório` |
| `cidade` | string | Cidade | `?cidade=Cuiabá` |

#### **Exemplos de Uso**

```bash
# Prestações aprovadas de janeiro de 2024
GET /api/relatorios/prestacoes/?data_inicio=2024-01-01&data_fim=2024-01-31&validacao_gestor=aprovada

# Prestações com valor entre R$ 500 e R$ 1000
GET /api/relatorios/prestacoes/?valor_min=500.00&valor_max=1000.00

# Prestações do funcionário João
GET /api/relatorios/prestacoes/?funcionario_nome=João

# Estatísticas das prestações
GET /api/relatorios/prestacoes/estatisticas/
```

#### **Resposta da API**
```json
{
  "count": 50,
  "next": "http://localhost:8000/api/relatorios/prestacoes/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "nome_completo": "João Silva",
      "cpf": "123.456.789-00",
      "empresa_nome": "Empresa ABC",
      "cargo_nome": "Analista",
      "data": "2024-01-15",
      "horario_chegada": "08:00:00",
      "horario_saida_almoco": "12:00:00",
      "horario_retorno_almoco": "13:00:00",
      "horario_saida": "17:00:00",
      "local_prestacao_nome": "Escritório Central",
      "cidade_nome": "Cuiabá",
      "valor": 150.00,
      "horas_trabalhadas": "8:00:00",
      "valor_por_hora": 18.75,
      "validacao_gestor": "aprovada",
      "observacoes": "Prestação realizada com sucesso",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### **3. Registros de Ponto** - `/api/relatorios/pontos/`

#### **Métodos Disponíveis**
- `GET /api/relatorios/pontos/` - Lista registros de ponto
- `GET /api/relatorios/pontos/{id}/` - Detalhes do registro
- `GET /api/relatorios/pontos/estatisticas/` - Estatísticas

#### **Filtros Disponíveis**
| Parâmetro | Tipo | Descrição | Exemplo |
|-----------|------|-----------|---------|
| `funcionario_nome` | string | Nome do funcionário | `?funcionario_nome=João` |
| `empresa` | string | Nome da empresa | `?empresa=ABC` |
| `data_inicio` | datetime | Data (início) | `?data_inicio=2024-01-01T00:00:00` |
| `data_fim` | datetime | Data (fim) | `?data_fim=2024-01-31T23:59:59` |

#### **Exemplos de Uso**

```bash
# Registros de ponto de janeiro de 2024
GET /api/relatorios/pontos/?data_inicio=2024-01-01T00:00:00&data_fim=2024-01-31T23:59:59

# Registros do funcionário João
GET /api/relatorios/pontos/?funcionario_nome=João

# Estatísticas dos registros
GET /api/relatorios/pontos/estatisticas/
```

---

### **4. Dashboard** - `/api/relatorios/dashboard/`

#### **Endpoints Disponíveis**

##### **4.1 Dashboard Geral** - `/api/relatorios/dashboard/geral/`
Retorna estatísticas gerais do sistema.

**Parâmetros de Filtro:**
- `empresa_id` (int): ID da empresa
- `data_inicio` (date): Data início
- `data_fim` (date): Data fim

**Exemplo de Uso:**
```bash
GET /api/relatorios/dashboard/geral/?empresa_id=1&data_inicio=2024-01-01&data_fim=2024-12-31
```

**Resposta:**
```json
{
  "funcionarios": {
    "ativos": 25,
    "inativos": 5,
    "total": 30
  },
  "prestacoes": {
    "aprovadas": 150,
    "pendentes": 10,
    "total": 160
  },
  "financeiro": {
    "valor_total_aprovado": 22500.00,
    "horas_trabalhadas": "1200:00:00"
  }
}
```

##### **4.2 Dados para Gráficos** - `/api/relatorios/dashboard/graficos/`
Retorna dados formatados para gráficos.

**Parâmetros:**
- `empresa_id` (int): ID da empresa
- `periodo` (int): Período em dias (padrão: 30)

**Exemplo de Uso:**
```bash
GET /api/relatorios/dashboard/graficos/?empresa_id=1&periodo=30
```

**Resposta:**
```json
{
  "status_prestacoes": [
    {"validacao_gestor": "aprovada", "total": 45},
    {"validacao_gestor": "pendente", "total": 5},
    {"validacao_gestor": "rejeitada", "total": 2}
  ],
  "prestacoes_por_dia": [
    {"dia": "2024-01-15", "total": 8, "valor_total": 1200.00},
    {"dia": "2024-01-16", "total": 12, "valor_total": 1800.00}
  ],
  "funcionarios_por_empresa": [
    {"empresa__nome_fantasia": "Empresa ABC", "total": 15},
    {"empresa__nome_fantasia": "Empresa XYZ", "total": 10}
  ],
  "valores_por_empresa": [
    {"funcionario__empresa__nome_fantasia": "Empresa ABC", "total_valor": 15000.00, "total_prestacoes": 100},
    {"funcionario__empresa__nome_fantasia": "Empresa XYZ", "total_valor": 7500.00, "total_prestacoes": 50}
  ]
}
```

##### **4.3 Relatório Financeiro** - `/api/relatorios/dashboard/financeiro/`
Relatório financeiro detalhado.

**Parâmetros:**
- `data_inicio` (date): Data início
- `data_fim` (date): Data fim
- `empresa_id` (int): ID da empresa

**Exemplo de Uso:**
```bash
GET /api/relatorios/dashboard/financeiro/?data_inicio=2024-01-01&data_fim=2024-01-31&empresa_id=1
```

**Resposta:**
```json
{
  "resumo": {
    "total_prestacoes": 150,
    "valor_total": 22500.00,
    "valor_medio": 150.00,
    "horas_totais": "1200:00:00"
  },
  "por_empresa": [
    {
      "funcionario__empresa__nome_fantasia": "Empresa ABC",
      "total_prestacoes": 100,
      "valor_total": 15000.00,
      "valor_medio": 150.00
    }
  ],
  "por_funcionario": [
    {
      "funcionario__usuario__first_name": "João",
      "funcionario__usuario__last_name": "Silva",
      "funcionario__empresa__nome_fantasia": "Empresa ABC",
      "total_prestacoes": 20,
      "valor_total": 3000.00,
      "valor_medio": 150.00
    }
  ]
}
```

---

## 🖥️ **Exemplos de Uso no Frontend (Next.js)**

### **1. Hook para Funcionários**

```typescript
// hooks/useFuncionarios.ts
import { useState, useEffect } from 'react';

interface FuncionarioFilters {
  nome?: string;
  empresa?: string;
  cargo?: string;
  ativo?: boolean;
  data_admissao_inicio?: string;
  data_admissao_fim?: string;
  search?: string;
  ordering?: string;
}

export const useFuncionarios = (filtros: FuncionarioFilters = {}) => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const buscarFuncionarios = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      // Adicionar filtros
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/relatorios/funcionarios/?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      setFuncionarios(data.results);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarFuncionarios();
  }, [JSON.stringify(filtros)]);

  return { funcionarios, loading, error, pagination, refetch: buscarFuncionarios };
};
```

### **2. Hook para Dashboard**

```typescript
// hooks/useDashboard.ts
import { useState, useEffect } from 'react';

interface DashboardFilters {
  empresa_id?: number;
  data_inicio?: string;
  data_fim?: string;
  periodo?: number;
}

export const useDashboard = (filtros: DashboardFilters = {}) => {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarDados = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/relatorios/dashboard/geral/?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      setDados(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarDados();
  }, [JSON.stringify(filtros)]);

  return { dados, loading, error, refetch: buscarDados };
};
```

### **3. Componente de Dashboard**

```tsx
// components/Dashboard.tsx
import { useDashboard } from '../hooks/useDashboard';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

const Dashboard = () => {
  const { dados, loading, error } = useDashboard({
    empresa_id: 1,
    data_inicio: '2024-01-01',
    data_fim: '2024-12-31'
  });

  if (loading) return <div className="flex justify-center p-8">Carregando...</div>;
  if (error) return <div className="text-red-500 p-4">Erro: {error}</div>;
  if (!dados) return <div className="text-gray-500 p-4">Nenhum dado encontrado</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Funcionários */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Funcionários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            {dados.funcionarios.ativos}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Ativos: {dados.funcionarios.ativos} | 
            Inativos: {dados.funcionarios.inativos}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Total: {dados.funcionarios.total}
          </p>
        </CardContent>
      </Card>

      {/* Prestações */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Prestações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">
            {dados.prestacoes.aprovadas}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Aprovadas: {dados.prestacoes.aprovadas} | 
            Pendentes: {dados.prestacoes.pendentes}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Total: {dados.prestacoes.total}
          </p>
        </CardContent>
      </Card>

      {/* Valor Total */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Valor Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-600">
            R$ {dados.financeiro.valor_total_aprovado.toLocaleString('pt-BR', {
              minimumFractionDigits: 2
            })}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Aprovado
          </p>
        </CardContent>
      </Card>

      {/* Horas Trabalhadas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Horas Trabalhadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-600">
            {dados.financeiro.horas_trabalhadas}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Total
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
```

### **4. Componente de Lista de Funcionários**

```tsx
// components/FuncionariosList.tsx
import { useState } from 'react';
import { useFuncionarios } from '../hooks/useFuncionarios';

const FuncionariosList = () => {
  const [filtros, setFiltros] = useState({
    ativo: true,
    search: '',
    ordering: 'nome_completo'
  });

  const { funcionarios, loading, error, pagination } = useFuncionarios(filtros);

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  if (loading) return <div className="flex justify-center p-8">Carregando...</div>;
  if (error) return <div className="text-red-500 p-4">Erro: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              value={filtros.search}
              onChange={(e) => handleFiltroChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nome, sobrenome ou CPF"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Empresa
            </label>
            <input
              type="text"
              value={filtros.empresa || ''}
              onChange={(e) => handleFiltroChange('empresa', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nome da empresa"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cargo
            </label>
            <input
              type="text"
              value={filtros.cargo || ''}
              onChange={(e) => handleFiltroChange('cargo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nome do cargo"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filtros.ativo}
              onChange={(e) => handleFiltroChange('ativo', e.target.value === 'true')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Funcionários */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">
            Funcionários ({pagination?.count || 0})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cargo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Admissão
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {funcionarios.map((funcionario) => (
                <tr key={funcionario.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {funcionario.nome_completo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {funcionario.cpf}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {funcionario.empresa_nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {funcionario.cargo_nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(funcionario.data_admissao).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      funcionario.ativo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {funcionario.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FuncionariosList;
```

### **5. Componente de Gráficos**

```tsx
// components/GraficosDashboard.tsx
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const GraficosDashboard = () => {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const buscarDados = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/relatorios/dashboard/graficos/?periodo=30', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setDados(data);
      } catch (error) {
        console.error('Erro ao buscar dados dos gráficos:', error);
      } finally {
        setLoading(false);
      }
    };

    buscarDados();
  }, []);

  if (loading) return <div className="flex justify-center p-8">Carregando gráficos...</div>;
  if (!dados) return <div className="text-gray-500 p-4">Nenhum dado encontrado</div>;

  const cores = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Status das Prestações */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Status das Prestações</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dados.status_prestacoes}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="total"
            >
              {dados.status_prestacoes.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Valores por Empresa */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Valores por Empresa</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dados.valores_por_empresa}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="funcionario__empresa__nome_fantasia" 
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']} 
            />
            <Bar dataKey="total_valor" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Prestações por Dia */}
      <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Prestações por Dia</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dados.prestacoes_por_dia}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraficosDashboard;
```

---

## 🚀 **Vantagens da Implementação com Django Filter**

### **1. Simplicidade**
- Filtros automáticos baseados nos campos do modelo
- Não precisa escrever lógica de filtro manual
- Interface consistente para todos os endpoints

### **2. Performance**
- Filtros otimizados no nível do banco de dados
- Queries eficientes com `select_related` e `prefetch_related`
- Paginação automática

### **3. Flexibilidade**
- Filtros de lookup avançados (`icontains`, `gte`, `lte`, etc.)
- Filtros customizados para casos específicos
- Busca e ordenação integradas

### **4. Manutenibilidade**
- Código limpo e organizado
- Fácil de adicionar novos filtros
- Documentação automática via DRF Spectacular

### **5. Segurança**
- Validação automática dos parâmetros
- Proteção contra SQL injection
- Controle de acesso por usuário

---

## 📝 **Resumo dos Endpoints**

| Endpoint | Método | Descrição | Filtros Principais | Fonte dos Dados |
|----------|--------|-----------|-------------------|-----------------|
| `/api/relatorios/funcionarios/` | GET | Lista funcionários | nome, empresa, cargo, ativo, data_admissao | `funcionarios.models.Funcionario` |
| `/api/relatorios/prestacoes/` | GET | Lista prestações | funcionario_nome, empresa, data, validacao_gestor, valor | `prestacoes.models.RegistroPrestacao` |
| `/api/relatorios/pontos/` | GET | Lista registros de ponto | funcionario_nome, empresa, data | `ponto.models.RegistroPonto` |
| `/api/relatorios/dashboard/geral/` | GET | Dashboard geral | empresa_id, data_inicio, data_fim | Agregados de todas as apps |
| `/api/relatorios/dashboard/graficos/` | GET | Dados para gráficos | empresa_id, periodo | Agregados de todas as apps |
| `/api/relatorios/dashboard/financeiro/` | GET | Relatório financeiro | data_inicio, data_fim, empresa_id | Agregados de todas as apps |

Esta implementação oferece uma solução completa e eficiente para relatórios e dashboards, utilizando Django Filter para facilitar o desenvolvimento e manutenção do código.




📊 Endpoints Finais:
Endpoint	Fonte dos Dados	Filtros Django Filter
/api/relatorios/funcionarios/	funcionarios.models.Funcionario	✅ nome, empresa, cargo, ativo, data_admissao, cpf, cidade
/api/relatorios/prestacoes/	prestacoes.models.RegistroPrestacao	✅ funcionario_nome, empresa, data, validacao_gestor, valor, local
/api/relatorios/pontos/	ponto.models.RegistroPonto	✅ funcionario_nome, empresa, data
/api/relatorios/dashboard/geral/	Agregados de todas as apps	✅ empresa_id, data_inicio, data_fim
/api/relatorios/dashboard/graficos/	Agregados de todas as apps	✅ empresa_id, periodo
/api/relatorios/dashboard/financeiro/	Agregados de todas as apps	✅ data_inicio, data_fim, empresa_id