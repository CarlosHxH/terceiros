# relatorios/filters.py
import django_filters
from django.db.models import Q
from datetime import datetime, timedelta
from .models import RelatorioPersonalizado
from funcionarios.models import Funcionario
from prestacoes.models import RegistroPrestacao
from ponto.models import RegistroPonto
from empresas.models import EmpresaTerceirizada


class FuncionarioFilter(django_filters.FilterSet):
    """Filtros para funcionários"""
    nome = django_filters.CharFilter(
        method='filter_nome',
        label='Nome do funcionário'
    )
    empresa = django_filters.CharFilter(
        field_name='empresa__nome_fantasia',
        lookup_expr='icontains',
        label='Nome da empresa'
    )
    cargo = django_filters.CharFilter(
        field_name='cargo__nome',
        lookup_expr='icontains',
        label='Cargo'
    )
    cpf = django_filters.CharFilter(
        field_name='usuario__cpf',
        lookup_expr='icontains',
        label='CPF'
    )
    data_admissao_inicio = django_filters.DateFilter(
        field_name='data_admissao',
        lookup_expr='gte',
        label='Data admissão (início)'
    )
    data_admissao_fim = django_filters.DateFilter(
        field_name='data_admissao',
        lookup_expr='lte',
        label='Data admissão (fim)'
    )
    ativo = django_filters.BooleanFilter(
        field_name='ativo',
        label='Funcionário ativo'
    )
    cidade = django_filters.CharFilter(
        field_name='empresa__cidade__nome',
        lookup_expr='icontains',
        label='Cidade'
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
    """Filtros para prestações"""
    funcionario_nome = django_filters.CharFilter(
        method='filter_funcionario_nome',
        label='Nome do funcionário'
    )
    empresa = django_filters.CharFilter(
        field_name='funcionario__empresa__nome_fantasia',
        lookup_expr='icontains',
        label='Nome da empresa'
    )
    data_inicio = django_filters.DateFilter(
        field_name='data',
        lookup_expr='gte',
        label='Data (início)'
    )
    data_fim = django_filters.DateFilter(
        field_name='data',
        lookup_expr='lte',
        label='Data (fim)'
    )
    validacao_gestor = django_filters.ChoiceFilter(
        choices=RegistroPrestacao.STATUS_VALIDACAO_CHOICES,
        label='Status de validação'
    )
    valor_min = django_filters.NumberFilter(
        field_name='valor',
        lookup_expr='gte',
        label='Valor mínimo'
    )
    valor_max = django_filters.NumberFilter(
        field_name='valor',
        lookup_expr='lte',
        label='Valor máximo'
    )
    local_prestacao = django_filters.CharFilter(
        field_name='local_prestacao__nome',
        lookup_expr='icontains',
        label='Local de prestação'
    )
    cidade = django_filters.CharFilter(
        field_name='local_prestacao__cidade__nome',
        lookup_expr='icontains',
        label='Cidade'
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


class RelatorioPersonalizadoFilter(django_filters.FilterSet):
    """Filtros para relatórios personalizados"""
    nome = django_filters.CharFilter(
        field_name='nome',
        lookup_expr='icontains',
        label='Nome do relatório'
    )
    publico = django_filters.BooleanFilter(
        field_name='publico',
        label='Relatório público'
    )
    data_criacao_inicio = django_filters.DateTimeFilter(
        field_name='created_at',
        lookup_expr='gte',
        label='Data criação (início)'
    )
    data_criacao_fim = django_filters.DateTimeFilter(
        field_name='created_at',
        lookup_expr='lte',
        label='Data criação (fim)'
    )

    class Meta:
        model = RelatorioPersonalizado
        fields = ['nome', 'publico']
