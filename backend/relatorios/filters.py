# relatorios/filters.py
import django_filters
from django.db.models import Q
from datetime import datetime, timedelta
from funcionarios.models import Funcionario
from prestacoes.models import RegistroPrestacao
from ponto.models import RegistroPonto
from empresas.models import EmpresaTerceirizada


class FuncionarioFilter(django_filters.FilterSet):
    """Filtros para funcionários
    
    Filtros disponíveis:
    - nome: Busca por nome completo do funcionário (busca em primeiro nome e sobrenome)
    - empresa: Busca por nome da empresa (busca parcial, case-insensitive)
    - cargo: Busca por nome do cargo (busca parcial, case-insensitive)
    - cpf: Busca por CPF (busca parcial)
    - data_admissao_inicio: Data de admissão a partir de (formato: YYYY-MM-DD)
    - data_admissao_fim: Data de admissão até (formato: YYYY-MM-DD)
    - ativo: Status do funcionário (true/false)
    - cidade: Cidade da empresa (busca parcial, case-insensitive)
    
    Exemplos de uso:
    - ?nome=João&ativo=true
    - ?empresa=ABC&cargo=Analista
    - ?data_admissao_inicio=2024-01-01&data_admissao_fim=2024-12-31
    - ?cidade=Cuiabá&ativo=true
    """
    nome = django_filters.CharFilter(
        method='filter_nome',
        label='Nome do funcionário',
        help_text='Busca por nome completo (primeiro nome ou sobrenome)'
    )
    empresa = django_filters.CharFilter(
        field_name='empresa__nome_fantasia',
        lookup_expr='icontains',
        label='Nome da empresa',
        help_text='Busca parcial no nome da empresa'
    )
    cargo = django_filters.CharFilter(
        field_name='cargo__nome',
        lookup_expr='icontains',
        label='Cargo',
        help_text='Busca parcial no nome do cargo'
    )
    cpf = django_filters.CharFilter(
        field_name='usuario__cpf',
        lookup_expr='icontains',
        label='CPF',
        help_text='Busca parcial no CPF'
    )
    data_admissao_inicio = django_filters.DateFilter(
        field_name='data_admissao',
        lookup_expr='gte',
        label='Data admissão (início)',
        help_text='Data de admissão a partir de (formato: YYYY-MM-DD)'
    )
    data_admissao_fim = django_filters.DateFilter(
        field_name='data_admissao',
        lookup_expr='lte',
        label='Data admissão (fim)',
        help_text='Data de admissão até (formato: YYYY-MM-DD)'
    )
    ativo = django_filters.BooleanFilter(
        field_name='ativo',
        label='Funcionário ativo',
        help_text='Status do funcionário (true/false)'
    )
    cidade = django_filters.CharFilter(
        field_name='empresa__cidade__nome',
        lookup_expr='icontains',
        label='Cidade',
        help_text='Cidade da empresa (busca parcial)'
    )

    class Meta:
        model = Funcionario
        fields = ['empresa', 'cargo', 'ativo']

    def filter_nome(self, queryset, name, value):
        """Filtro customizado para nome completo"""
        return queryset.filter(
            Q(usuario__first_name__icontains=value) |
            Q(usuario__last_name__icontains=value)
        )


class PrestacaoFilter(django_filters.FilterSet):
    """Filtros para prestações
    
    Filtros disponíveis:
    - funcionario_nome: Busca por nome do funcionário (busca em primeiro nome e sobrenome)
    - empresa: Busca por nome da empresa (busca parcial, case-insensitive)
    - data_inicio: Data da prestação a partir de (formato: YYYY-MM-DD)
    - data_fim: Data da prestação até (formato: YYYY-MM-DD)
    - validacao_gestor: Status de validação (pendente, aprovada, rejeitada, em_revisao)
    - valor_min: Valor mínimo da prestação (formato: decimal)
    - valor_max: Valor máximo da prestação (formato: decimal)
    - local_prestacao: Local de prestação (busca parcial, case-insensitive)
    - cidade: Cidade do local de prestação (busca parcial, case-insensitive)
    
    Exemplos de uso:
    - ?funcionario_nome=João&validacao_gestor=aprovada
    - ?empresa=ABC&data_inicio=2024-01-01&data_fim=2024-01-31
    - ?valor_min=100.00&valor_max=500.00&validacao_gestor=aprovada
    - ?local_prestacao=Escritório&cidade=Cuiabá
    """
    funcionario_nome = django_filters.CharFilter(
        method='filter_funcionario_nome',
        label='Nome do funcionário',
        help_text='Busca por nome completo do funcionário'
    )
    empresa = django_filters.CharFilter(
        field_name='funcionario__empresa__nome_fantasia',
        lookup_expr='icontains',
        label='Nome da empresa',
        help_text='Busca parcial no nome da empresa'
    )
    data_inicio = django_filters.DateFilter(
        field_name='data',
        lookup_expr='gte',
        label='Data (início)',
        help_text='Data da prestação a partir de (formato: YYYY-MM-DD)'
    )
    data_fim = django_filters.DateFilter(
        field_name='data',
        lookup_expr='lte',
        label='Data (fim)',
        help_text='Data da prestação até (formato: YYYY-MM-DD)'
    )
    validacao_gestor = django_filters.ChoiceFilter(
        choices=RegistroPrestacao.STATUS_VALIDACAO_CHOICES,
        label='Status de validação',
        help_text='Status de validação da prestação'
    )
    valor_min = django_filters.NumberFilter(
        field_name='valor',
        lookup_expr='gte',
        label='Valor mínimo',
        help_text='Valor mínimo da prestação (formato: decimal)'
    )
    valor_max = django_filters.NumberFilter(
        field_name='valor',
        lookup_expr='lte',
        label='Valor máximo',
        help_text='Valor máximo da prestação (formato: decimal)'
    )
    local_prestacao = django_filters.CharFilter(
        field_name='local_prestacao__nome',
        lookup_expr='icontains',
        label='Local de prestação',
        help_text='Busca parcial no local de prestação'
    )
    cidade = django_filters.CharFilter(
        field_name='local_prestacao__cidade__nome',
        lookup_expr='icontains',
        label='Cidade',
        help_text='Cidade do local de prestação (busca parcial)'
    )

    class Meta:
        model = RegistroPrestacao
        fields = ['validacao_gestor', 'data_inicio', 'data_fim']

    def filter_funcionario_nome(self, queryset, name, value):
        """Filtro customizado para nome do funcionário"""
        return queryset.filter(
            Q(funcionario__usuario__first_name__icontains=value) |
            Q(funcionario__usuario__last_name__icontains=value)
        )


class PontoFilter(django_filters.FilterSet):
    """Filtros para registros de ponto"""
    funcionario_nome = django_filters.CharFilter(
        method='filter_funcionario_nome',
        label='Nome do funcionário'
    )
    empresa = django_filters.CharFilter(
        field_name='funcionario__empresa__nome_fantasia',
        lookup_expr='icontains',
        label='Nome da empresa'
    )
    data_inicio = django_filters.DateTimeFilter(
        field_name='created_at',
        lookup_expr='date__gte',
        label='Data (início)'
    )
    data_fim = django_filters.DateTimeFilter(
        field_name='created_at',
        lookup_expr='date__lte',
        label='Data (fim)'
    )

    class Meta:
        model = RegistroPonto
        fields = ['funcionario']

    def filter_funcionario_nome(self, queryset, name, value):
        """Filtro customizado para nome do funcionário"""
        return queryset.filter(
            Q(funcionario__usuario__first_name__icontains=value) |
            Q(funcionario__usuario__last_name__icontains=value)
        )


# Filtros removidos - não precisamos mais do modelo RelatorioPersonalizado
