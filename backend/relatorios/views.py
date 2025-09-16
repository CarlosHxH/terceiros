"""
API de Relatórios - ViewSets com Django Filter

Este módulo contém todos os ViewSets para a API de relatórios.
Todos os endpoints requerem autenticação JWT.

AUTENTICAÇÃO:
- Todos os endpoints requerem token JWT válido
- Header: Authorization: Bearer <token>
- Token obtido via: POST /api/usuarios/login/

FILTROS:
- Django Filter integrado em todos os endpoints
- Filtros aparecem automaticamente no Swagger UI
- Suporte a busca e ordenação
- Documentação completa de cada filtro

ENDPOINTS DISPONÍVEIS:
- /api/relatorios/funcionarios/ - Funcionários com filtros
- /api/relatorios/prestacoes/ - Prestações com filtros  
- /api/relatorios/pontos/ - Registros de ponto com filtros
- /api/relatorios/dashboard/geral/ - Dashboard geral
- /api/relatorios/dashboard/graficos/ - Dados para gráficos
- /api/relatorios/dashboard/financeiro/ - Relatório financeiro
"""

from django.shortcuts import render
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count, Sum, Avg
from django.db.models.functions import TruncMonth, TruncDay
from datetime import datetime, timedelta
from .serializers import (
    FuncionarioSerializer, PrestacaoSerializer, PontoSerializer, 
    DashboardSerializer, GraficoSerializer, RelatorioFinanceiroSerializer
)
from .filters import (
    FuncionarioFilter, PrestacaoFilter, PontoFilter
)
from funcionarios.models import Funcionario
from prestacoes.models import RegistroPrestacao
from ponto.models import RegistroPonto
from empresas.models import EmpresaTerceirizada


class FuncionarioViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para funcionários com filtros avançados
    
    Este endpoint permite listar e filtrar funcionários das empresas terceirizadas.
    
    **Filtros disponíveis:**
    - `nome`: Busca por nome completo (primeiro nome ou sobrenome)
    - `empresa`: Busca por nome da empresa (busca parcial)
    - `cargo`: Busca por nome do cargo (busca parcial)
    - `cpf`: Busca por CPF (busca parcial)
    - `data_admissao_inicio`: Data de admissão a partir de (YYYY-MM-DD)
    - `data_admissao_fim`: Data de admissão até (YYYY-MM-DD)
    - `ativo`: Status do funcionário (true/false)
    - `cidade`: Cidade da empresa (busca parcial)
    
    **Busca e Ordenação:**
    - `search`: Busca em nome, sobrenome e CPF
    - `ordering`: Ordenação por data_admissao, usuario__first_name, created_at
    
    **Exemplos de uso:**
    - `/api/relatorios/funcionarios/?nome=João&ativo=true`
    - `/api/relatorios/funcionarios/?empresa=ABC&cargo=Analista`
    - `/api/relatorios/funcionarios/?data_admissao_inicio=2024-01-01&data_admissao_fim=2024-12-31`
    - `/api/relatorios/funcionarios/?search=123.456.789-00&ordering=-data_admissao`
    """
    queryset = Funcionario.objects.select_related('usuario', 'empresa', 'cargo')
    serializer_class = FuncionarioSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = FuncionarioFilter
    search_fields = ['usuario__first_name', 'usuario__last_name', 'usuario__cpf']
    ordering_fields = ['data_admissao', 'usuario__first_name', 'created_at']
    ordering = ['usuario__first_name']

    @action(detail=False, methods=['get'])
    def estatisticas(self, request):
        """
        Estatísticas dos funcionários
        
        Retorna estatísticas agregadas dos funcionários baseadas nos filtros aplicados.
        
        **Filtros aplicados:**
        Os mesmos filtros do endpoint principal são aplicados automaticamente.
        
        **Resposta:**
        - total: Total de funcionários
        - ativos: Funcionários ativos
        - inativos: Funcionários inativos
        - por_empresa: Top 10 empresas por quantidade de funcionários
        - por_cargo: Top 10 cargos por quantidade de funcionários
        """
        queryset = self.filter_queryset(self.get_queryset())
        
        stats = {
            'total': queryset.count(),
            'ativos': queryset.filter(ativo=True).count(),
            'inativos': queryset.filter(ativo=False).count(),
            'por_empresa': queryset.values('empresa__nome_fantasia').annotate(
                total=Count('id')
            ).order_by('-total')[:10],
            'por_cargo': queryset.values('cargo__nome').annotate(
                total=Count('id')
            ).order_by('-total')[:10]
        }
        
        return Response(stats)


class PrestacaoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para prestações com filtros avançados
    
    Este endpoint permite listar e filtrar prestações de serviços das empresas terceirizadas.
    
    **Filtros disponíveis:**
    - `funcionario_nome`: Busca por nome completo do funcionário
    - `empresa`: Busca por nome da empresa (busca parcial)
    - `data_inicio`: Data da prestação a partir de (YYYY-MM-DD)
    - `data_fim`: Data da prestação até (YYYY-MM-DD)
    - `validacao_gestor`: Status de validação (pendente, aprovada, rejeitada, em_revisao)
    - `valor_min`: Valor mínimo da prestação (formato: decimal)
    - `valor_max`: Valor máximo da prestação (formato: decimal)
    - `local_prestacao`: Local de prestação (busca parcial)
    - `cidade`: Cidade do local de prestação (busca parcial)
    
    **Busca e Ordenação:**
    - `search`: Busca em nome do funcionário
    - `ordering`: Ordenação por data, valor, created_at
    
    **Exemplos de uso:**
    - `/api/relatorios/prestacoes/?funcionario_nome=João&validacao_gestor=aprovada`
    - `/api/relatorios/prestacoes/?empresa=ABC&data_inicio=2024-01-01&data_fim=2024-01-31`
    - `/api/relatorios/prestacoes/?valor_min=100.00&valor_max=500.00&validacao_gestor=aprovada`
    - `/api/relatorios/prestacoes/?local_prestacao=Escritório&cidade=Cuiabá`
    """
    queryset = RegistroPrestacao.objects.select_related(
        'funcionario__usuario', 'funcionario__empresa', 'local_prestacao'
    )
    serializer_class = PrestacaoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = PrestacaoFilter
    search_fields = ['funcionario__usuario__first_name', 'funcionario__usuario__last_name']
    ordering_fields = ['data', 'valor', 'created_at']
    ordering = ['-data', '-horario_chegada']

    @action(detail=False, methods=['get'])
    def estatisticas(self, request):
        """Estatísticas das prestações"""
        queryset = self.filter_queryset(self.get_queryset())
        
        stats = {
            'total': queryset.count(),
            'aprovadas': queryset.filter(validacao_gestor='aprovada').count(),
            'pendentes': queryset.filter(validacao_gestor='pendente').count(),
            'rejeitadas': queryset.filter(validacao_gestor='rejeitada').count(),
            'valor_total': queryset.aggregate(total=Sum('valor'))['total'] or 0,
            'valor_medio': queryset.aggregate(medio=Avg('valor'))['medio'] or 0,
            'por_empresa': queryset.values('funcionario__empresa__nome_fantasia').annotate(
                total=Count('id'),
                valor_total=Sum('valor')
            ).order_by('-valor_total')[:10]
        }
        
        return Response(stats)


class PontoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para registros de ponto com filtros avançados
    
    Este endpoint permite listar e filtrar registros de ponto dos funcionários.
    
    **Filtros disponíveis:**
    - `funcionario_nome`: Busca por nome completo do funcionário
    - `empresa`: Busca por nome da empresa (busca parcial)
    - `data_inicio`: Data do registro a partir de (YYYY-MM-DDTHH:MM:SS)
    - `data_fim`: Data do registro até (YYYY-MM-DDTHH:MM:SS)
    
    **Busca e Ordenação:**
    - `search`: Busca em nome do funcionário
    - `ordering`: Ordenação por created_at
    
    **Exemplos de uso:**
    - `/api/relatorios/pontos/?funcionario_nome=João`
    - `/api/relatorios/pontos/?empresa=ABC&data_inicio=2024-01-01T00:00:00`
    - `/api/relatorios/pontos/?data_inicio=2024-01-01T00:00:00&data_fim=2024-01-31T23:59:59`
    """
    queryset = RegistroPonto.objects.select_related('funcionario__usuario', 'funcionario__empresa')
    serializer_class = PontoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = PontoFilter
    search_fields = ['funcionario__usuario__first_name', 'funcionario__usuario__last_name']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    @action(detail=False, methods=['get'])
    def estatisticas(self, request):
        """Estatísticas dos registros de ponto"""
        queryset = self.filter_queryset(self.get_queryset())
        
        stats = {
            'total': queryset.count(),
            'por_funcionario': queryset.values('funcionario__usuario__first_name').annotate(
                total=Count('id')
            ).order_by('-total')[:10],
            'por_empresa': queryset.values('funcionario__empresa__nome_fantasia').annotate(
                total=Count('id')
            ).order_by('-total')[:10]
        }
        
        return Response(stats)


class DashboardViewSet(viewsets.ViewSet):
    """
    ViewSet para dados do dashboard
    
    Este ViewSet fornece dados agregados para dashboards e relatórios.
    Todos os endpoints requerem autenticação JWT.
    """
    
    @action(detail=False, methods=['get'])
    def geral(self, request):
        """
        Dashboard geral com estatísticas principais
        
        Retorna estatísticas gerais do sistema baseadas nos filtros aplicados.
        
        **Filtros disponíveis:**
        - `empresa_id`: ID da empresa (integer)
        - `data_inicio`: Data início (YYYY-MM-DD)
        - `data_fim`: Data fim (YYYY-MM-DD)
        
        **Resposta:**
        - funcionarios: Estatísticas de funcionários (ativos, inativos, total)
        - prestacoes: Estatísticas de prestações (aprovadas, pendentes, total)
        - financeiro: Dados financeiros (valor total, horas trabalhadas)
        
        **Exemplos de uso:**
        - `/api/relatorios/dashboard/geral/`
        - `/api/relatorios/dashboard/geral/?empresa_id=1`
        - `/api/relatorios/dashboard/geral/?data_inicio=2024-01-01&data_fim=2024-12-31`
        """
        try:
            # Filtros opcionais via query params
            empresa_id = request.query_params.get('empresa_id')
            data_inicio = request.query_params.get('data_inicio')
            data_fim = request.query_params.get('data_fim')
            
            # Construir filtros
            filtros_funcionarios = {}
            filtros_prestacoes = {}
            
            if empresa_id:
                filtros_funcionarios['empresa_id'] = empresa_id
                filtros_prestacoes['funcionario__empresa_id'] = empresa_id
            
            if data_inicio:
                filtros_prestacoes['data__gte'] = data_inicio
            if data_fim:
                filtros_prestacoes['data__lte'] = data_fim
            
            # Estatísticas de funcionários
            funcionarios_ativos = Funcionario.objects.filter(ativo=True, **filtros_funcionarios).count()
            funcionarios_inativos = Funcionario.objects.filter(ativo=False, **filtros_funcionarios).count()
            
            # Estatísticas de prestações
            prestacoes_aprovadas = RegistroPrestacao.objects.filter(
                validacao_gestor='aprovada', **filtros_prestacoes
            ).count()
            
            prestacoes_pendentes = RegistroPrestacao.objects.filter(
                validacao_gestor='pendente', **filtros_prestacoes
            ).count()
            
            # Valores totais
            valor_total_aprovado = RegistroPrestacao.objects.filter(
                validacao_gestor='aprovada', **filtros_prestacoes
            ).aggregate(total=Sum('valor'))['total'] or 0
            
            # Horas totais trabalhadas
            horas_trabalhadas = RegistroPrestacao.objects.filter(
                validacao_gestor='aprovada', **filtros_prestacoes
            ).aggregate(
                total_horas=Sum('horas_trabalhadas')
            )['total_horas'] or 0
            
            dados = {
                'funcionarios': {
                    'ativos': funcionarios_ativos,
                    'inativos': funcionarios_inativos,
                    'total': funcionarios_ativos + funcionarios_inativos
                },
                'prestacoes': {
                    'aprovadas': prestacoes_aprovadas,
                    'pendentes': prestacoes_pendentes,
                    'total': prestacoes_aprovadas + prestacoes_pendentes
                },
                'financeiro': {
                    'valor_total_aprovado': float(valor_total_aprovado),
                    'horas_trabalhadas': str(horas_trabalhadas) if horas_trabalhadas else '0:00:00'
                }
            }
            
            serializer = DashboardSerializer(dados)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    def graficos(self, request):
        """
        Dados para gráficos do dashboard
        
        Retorna dados formatados para gráficos e visualizações.
        
        **Filtros disponíveis:**
        - `empresa_id`: ID da empresa (integer)
        - `periodo`: Período em dias (integer, padrão: 30)
        
        **Resposta:**
        - status_prestacoes: Prestações por status de validação
        - prestacoes_por_dia: Prestações agrupadas por dia
        - funcionarios_por_empresa: Funcionários agrupados por empresa
        - valores_por_empresa: Valores agrupados por empresa
        
        **Exemplos de uso:**
        - `/api/relatorios/dashboard/graficos/`
        - `/api/relatorios/dashboard/graficos/?empresa_id=1`
        - `/api/relatorios/dashboard/graficos/?periodo=60`
        """
        try:
            empresa_id = request.query_params.get('empresa_id')
            periodo = request.query_params.get('periodo', '30')  # dias
            
            # Filtros base
            filtros_prestacoes = {}
            if empresa_id:
                filtros_prestacoes['funcionario__empresa_id'] = empresa_id
            
            # Data limite baseada no período
            data_limite = datetime.now() - timedelta(days=int(periodo))
            filtros_prestacoes['data__gte'] = data_limite.date()
            
            # Gráfico de prestações por status
            status_prestacoes = RegistroPrestacao.objects.filter(
                **filtros_prestacoes
            ).values('validacao_gestor').annotate(
                total=Count('id')
            ).order_by('validacao_gestor')
            
            # Gráfico de prestações por dia
            prestacoes_por_dia = RegistroPrestacao.objects.filter(
                **filtros_prestacoes
            ).extra(
                select={'dia': 'DATE(data)'}
            ).values('dia').annotate(
                total=Count('id'),
                valor_total=Sum('valor')
            ).order_by('dia')
            
            # Gráfico de funcionários por empresa
            funcionarios_por_empresa = Funcionario.objects.filter(
                ativo=True
            ).values('empresa__nome_fantasia').annotate(
                total=Count('id')
            ).order_by('-total')[:10]
            
            # Gráfico de valores por empresa
            valores_por_empresa = RegistroPrestacao.objects.filter(
                validacao_gestor='aprovada',
                **filtros_prestacoes
            ).values('funcionario__empresa__nome_fantasia').annotate(
                total_valor=Sum('valor'),
                total_prestacoes=Count('id')
            ).order_by('-total_valor')[:10]
            
            dados = {
                'status_prestacoes': list(status_prestacoes),
                'prestacoes_por_dia': list(prestacoes_por_dia),
                'funcionarios_por_empresa': list(funcionarios_por_empresa),
                'valores_por_empresa': list(valores_por_empresa)
            }
            
            serializer = GraficoSerializer(dados)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    def financeiro(self, request):
        """
        Relatório financeiro detalhado
        
        Retorna relatório financeiro completo com dados agregados.
        
        **Filtros disponíveis:**
        - `data_inicio`: Data início (YYYY-MM-DD)
        - `data_fim`: Data fim (YYYY-MM-DD)
        - `empresa_id`: ID da empresa (integer)
        
        **Resposta:**
        - resumo: Dados agregados (total prestações, valor total, valor médio, horas totais)
        - por_empresa: Dados agrupados por empresa
        - por_funcionario: Dados agrupados por funcionário (top 20)
        
        **Exemplos de uso:**
        - `/api/relatorios/dashboard/financeiro/`
        - `/api/relatorios/dashboard/financeiro/?data_inicio=2024-01-01&data_fim=2024-01-31`
        - `/api/relatorios/dashboard/financeiro/?empresa_id=1&data_inicio=2024-01-01`
        """
        try:
            data_inicio = request.query_params.get('data_inicio')
            data_fim = request.query_params.get('data_fim')
            empresa_id = request.query_params.get('empresa_id')
            
            # Filtros
            filtros = {'validacao_gestor': 'aprovada'}
            if data_inicio:
                filtros['data__gte'] = data_inicio
            if data_fim:
                filtros['data__lte'] = data_fim
            if empresa_id:
                filtros['funcionario__empresa_id'] = empresa_id
            
            # Dados agregados
            dados_agregados = RegistroPrestacao.objects.filter(
                **filtros
            ).aggregate(
                total_prestacoes=Count('id'),
                valor_total=Sum('valor'),
                valor_medio=Avg('valor'),
                horas_totais=Sum('horas_trabalhadas')
            )
            
            # Dados por empresa
            por_empresa = RegistroPrestacao.objects.filter(
                **filtros
            ).values('funcionario__empresa__nome_fantasia').annotate(
                total_prestacoes=Count('id'),
                valor_total=Sum('valor'),
                valor_medio=Avg('valor')
            ).order_by('-valor_total')
            
            # Dados por funcionário
            por_funcionario = RegistroPrestacao.objects.filter(
                **filtros
            ).values(
                'funcionario__usuario__first_name',
                'funcionario__usuario__last_name',
                'funcionario__empresa__nome_fantasia'
            ).annotate(
                total_prestacoes=Count('id'),
                valor_total=Sum('valor'),
                valor_medio=Avg('valor')
            ).order_by('-valor_total')[:20]
            
            dados = {
                'resumo': {
                    'total_prestacoes': dados_agregados['total_prestacoes'] or 0,
                    'valor_total': float(dados_agregados['valor_total'] or 0),
                    'valor_medio': float(dados_agregados['valor_medio'] or 0),
                    'horas_totais': str(dados_agregados['horas_totais'] or 0)
                },
                'por_empresa': list(por_empresa),
                'por_funcionario': list(por_funcionario)
            }
            
            serializer = RelatorioFinanceiroSerializer(dados)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )