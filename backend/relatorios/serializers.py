# relatorios/serializers.py
from rest_framework import serializers
from funcionarios.models import Funcionario
from prestacoes.models import RegistroPrestacao
from ponto.models import RegistroPonto
from empresas.models import EmpresaTerceirizada


class FuncionarioSerializer(serializers.ModelSerializer):
    nome_completo = serializers.ReadOnlyField()
    cpf = serializers.ReadOnlyField()
    telefone = serializers.ReadOnlyField()
    empresa_nome = serializers.CharField(source='empresa.nome_fantasia', read_only=True)
    cargo_nome = serializers.CharField(source='cargo.nome', read_only=True)
    
    class Meta:
        model = Funcionario
        fields = [
            'id', 'nome_completo', 'cpf', 'telefone', 'empresa', 'empresa_nome',
            'cargo', 'cargo_nome', 'data_admissao', 'data_demissao', 'registro',
            'pix', 'banco', 'agencia', 'conta', 'ativo', 'created_at'
        ]


class PrestacaoSerializer(serializers.ModelSerializer):
    nome_completo = serializers.ReadOnlyField()
    cpf = serializers.ReadOnlyField()
    empresa_nome = serializers.CharField(source='empresa_terceirizada.nome_fantasia', read_only=True)
    local_prestacao_nome = serializers.CharField(source='local_prestacao.nome', read_only=True)
    cidade_nome = serializers.CharField(source='cidade.nome', read_only=True)
    cargo_nome = serializers.CharField(source='cargo.nome', read_only=True)
    horas_trabalhadas = serializers.ReadOnlyField()
    valor_por_hora = serializers.ReadOnlyField()
    
    class Meta:
        model = RegistroPrestacao
        fields = [
            'id', 'nome_completo', 'cpf', 'empresa_nome', 'cargo_nome',
            'data', 'horario_chegada', 'horario_saida_almoco', 'horario_retorno_almoco',
            'horario_saida', 'local_prestacao_nome', 'cidade_nome', 'valor',
            'horas_trabalhadas', 'valor_por_hora', 'validacao_gestor',
            'observacoes', 'created_at'
        ]


class PontoSerializer(serializers.ModelSerializer):
    nome_funcionario = serializers.CharField(source='funcionario.nome_completo', read_only=True)
    empresa_nome = serializers.CharField(source='funcionario.empresa.nome_fantasia', read_only=True)
    foto_url = serializers.SerializerMethodField()
    
    class Meta:
        model = RegistroPonto
        fields = [
            'id', 'nome_funcionario', 'empresa_nome', 'foto_url',
            'ip', 'latitude', 'longitude', 'created_at'
        ]
    
    def get_foto_url(self, obj):
        if obj.foto:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.foto.url)
        return None


class DashboardSerializer(serializers.Serializer):
    """Serializer para dados do dashboard"""
    funcionarios = serializers.DictField()
    prestacoes = serializers.DictField()
    financeiro = serializers.DictField()


class GraficoSerializer(serializers.Serializer):
    """Serializer para dados de gráficos"""
    status_prestacoes = serializers.ListField()
    prestacoes_por_dia = serializers.ListField()
    funcionarios_por_empresa = serializers.ListField()
    valores_por_empresa = serializers.ListField()


class RelatorioFinanceiroSerializer(serializers.Serializer):
    """Serializer para relatório financeiro"""
    resumo = serializers.DictField()
    por_empresa = serializers.ListField()
    por_funcionario = serializers.ListField()