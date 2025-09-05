# =============================================================================
# APP: CORE (Configurações básicas e usuários)
# =============================================================================

# core/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator


class Usuario(AbstractUser):
    """Extensão do modelo User padrão"""
    cpf = models.CharField(
        max_length=14,
        unique=True,
        validators=[RegexValidator(r'^\d{3}\.\d{3}\.\d{3}-\d{2}$', 'CPF deve estar no formato XXX.XXX.XXX-XX')]
    )
    telefone = models.CharField(max_length=15, blank=True)
    foto = models.ImageField(upload_to='usuarios/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'


# =============================================================================
# APP: LOCALIZACAO (Cidades e locais de prestação)
# =============================================================================

# localizacao/models.py
from django.db import models


class Estado(models.Model):
    """Estados do Brasil"""
    nome = models.CharField(max_length=100)
    sigla = models.CharField(max_length=2, unique=True)
    ativo = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Estado'
        verbose_name_plural = 'Estados'
        ordering = ['nome']

    def __str__(self):
        return f"{self.nome} ({self.sigla})"


class Cidade(models.Model):
    """Cidades onde são prestados os serviços"""
    nome = models.CharField(max_length=200)
    estado = models.ForeignKey(Estado, on_delete=models.PROTECT, related_name='cidades')
    codigo_ibge = models.CharField(max_length=10, unique=True, blank=True, null=True)
    ativa = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Cidade'
        verbose_name_plural = 'Cidades'
        ordering = ['estado__sigla', 'nome']
        unique_together = ['nome', 'estado']

    def __str__(self):
        return f"{self.nome}/{self.estado.sigla}"


class LocalPrestacao(models.Model):
    """Locais específicos onde os serviços são prestados"""
    nome = models.CharField(max_length=200)
    cidade = models.ForeignKey(Cidade, on_delete=models.PROTECT, related_name='locais')
    endereco = models.TextField()
    cep = models.CharField(max_length=10, blank=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=8, blank=True, null=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, blank=True, null=True)
    observacoes = models.TextField(blank=True)
    ativo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Local de Prestação'
        verbose_name_plural = 'Locais de Prestação'
        ordering = ['cidade', 'nome']

    def __str__(self):
        return f"{self.nome} - {self.cidade}"


# =============================================================================
# APP: EMPRESAS (Gestão de empresas terceirizadas)
# =============================================================================

# empresas/models.py
from django.db import models
from django.core.validators import RegexValidator
from core.models import Usuario


class EmpresaTerceirizada(models.Model):
    """Empresas que prestam serviços terceirizados"""
    razao_social = models.CharField(max_length=200)
    nome_fantasia = models.CharField(max_length=200, blank=True)
    cnpj = models.CharField(
        max_length=18,
        unique=True,
        validators=[RegexValidator(r'^\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}$', 'CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX')]
    )
    inscricao_estadual = models.CharField(max_length=20, blank=True)
    inscricao_municipal = models.CharField(max_length=20, blank=True)
    
    # Contato
    telefone = models.CharField(max_length=15, blank=True)
    email = models.EmailField(blank=True)
    site = models.URLField(blank=True)
    
    # Endereço
    endereco = models.TextField(blank=True)
    cidade = models.ForeignKey('localizacao.Cidade', on_delete=models.PROTECT, blank=True, null=True)
    
    # Status
    ativa = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Empresa Terceirizada'
        verbose_name_plural = 'Empresas Terceirizadas'
        ordering = ['razao_social']

    def __str__(self):
        return self.nome_fantasia or self.razao_social


class Gestor(models.Model):
    """Gestores das empresas terceirizadas"""
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='gestor')
    empresa = models.ForeignKey(EmpresaTerceirizada, on_delete=models.CASCADE, related_name='gestores')
    cargo = models.CharField(max_length=100)
    departamento = models.CharField(max_length=100, blank=True)
    email_corporativo = models.EmailField(blank=True)
    telefone_corporativo = models.CharField(max_length=15, blank=True)
    ativo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Gestor'
        verbose_name_plural = 'Gestores'
        ordering = ['empresa', 'usuario__first_name']

    def __str__(self):
        return f"{self.usuario.get_full_name()} - {self.empresa}"


# =============================================================================
# APP: FUNCIONARIOS (Gestão de funcionários terceirizados)
# =============================================================================

# funcionarios/models.py
from django.db import models
from django.core.validators import RegexValidator
from core.models import Usuario


class Cargo(models.Model):
    """Cargos dos funcionários"""
    nome = models.CharField(max_length=100, unique=True)
    descricao = models.TextField(blank=True)
    nivel = models.CharField(
        max_length=20,
        choices=[
            ('junior', 'Júnior'),
            ('pleno', 'Pleno'),
            ('senior', 'Sênior'),
            ('coordenador', 'Coordenador'),
            ('gerente', 'Gerente'),
        ],
        default='junior'
    )
    ativo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Cargo'
        verbose_name_plural = 'Cargos'
        ordering = ['nome']

    def __str__(self):
        return self.nome


class Funcionario(models.Model):
    """Funcionários das empresas terceirizadas"""
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='funcionario')
    empresa = models.ForeignKey('empresas.EmpresaTerceirizada', on_delete=models.PROTECT, related_name='funcionarios')
    cargo = models.ForeignKey(Cargo, on_delete=models.PROTECT, related_name='funcionarios')
    
    # Dados financeiros
    pix = models.CharField(max_length=100, blank=True, help_text="Chave PIX para pagamentos")
    banco = models.CharField(max_length=100, blank=True)
    agencia = models.CharField(max_length=10, blank=True)
    conta = models.CharField(max_length=20, blank=True)
    
    # Dados trabalhistas
    registro = models.CharField(max_length=20, unique=True, help_text="Registro interno da empresa")
    data_admissao = models.DateField()
    data_demissao = models.DateField(blank=True, null=True)
    
    # Status
    ativo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Funcionário'
        verbose_name_plural = 'Funcionários'
        ordering = ['empresa', 'usuario__first_name']

    def __str__(self):
        return f"{self.usuario.get_full_name()} - {self.empresa}"

    @property
    def nome_completo(self):
        return self.usuario.get_full_name()

    @property
    def cpf(self):
        return self.usuario.cpf

    @property
    def telefone(self):
        return self.usuario.telefone


# =============================================================================
# APP: PRESTACOES (Controle de prestação de serviços e ponto)
# =============================================================================

# prestacoes/models.py
from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal
import uuid


class RegistroPrestacao(models.Model):
    """Registro principal de prestação de serviço"""
    STATUS_VALIDACAO_CHOICES = [
        ('pendente', 'Pendente'),
        ('aprovada', 'Aprovada'),
        ('rejeitada', 'Rejeitada'),
        ('em_revisao', 'Em Revisão'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Relacionamentos principais
    funcionario = models.ForeignKey('funcionarios.Funcionario', on_delete=models.PROTECT, related_name='prestacoes')
    local_prestacao = models.ForeignKey('localizacao.LocalPrestacao', on_delete=models.PROTECT, related_name='prestacoes')
    gestor = models.ForeignKey('empresas.Gestor', on_delete=models.PROTECT, related_name='prestacoes_supervisionadas')
    
    # Data e horários
    data = models.DateField()
    horario_chegada = models.TimeField()
    horario_saida_almoco = models.TimeField(blank=True, null=True)
    horario_retorno_almoco = models.TimeField(blank=True, null=True)
    horario_saida = models.TimeField()
    
    # Validações
    validacao_local = models.BooleanField(default=False, help_text="Validação no local da prestação")
    validacao_gestor = models.CharField(
        max_length=15,
        choices=STATUS_VALIDACAO_CHOICES,
        default='pendente'
    )
    
    # Valor e observações
    valor = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Valor da prestação de serviço"
    )
    observacoes = models.TextField(blank=True)
    
    # Evidências
    foto_comprovante = models.ImageField(upload_to='prestacoes/%Y/%m/', blank=True, null=True)
    
    # Geolocalização (para validação de local)
    latitude_chegada = models.DecimalField(max_digits=10, decimal_places=8, blank=True, null=True)
    longitude_chegada = models.DecimalField(max_digits=11, decimal_places=8, blank=True, null=True)
    latitude_saida = models.DecimalField(max_digits=10, decimal_places=8, blank=True, null=True)
    longitude_saida = models.DecimalField(max_digits=11, decimal_places=8, blank=True, null=True)
    
    # Auditoria
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        'core.Usuario',
        on_delete=models.PROTECT,
        related_name='prestacoes_criadas',
        blank=True,
        null=True
    )

    class Meta:
        verbose_name = 'Registro de Prestação'
        verbose_name_plural = 'Registros de Prestação'
        ordering = ['-data', '-horario_chegada']
        indexes = [
            models.Index(fields=['funcionario', 'data']),
            models.Index(fields=['local_prestacao', 'data']),
            models.Index(fields=['gestor', 'validacao_gestor']),
            models.Index(fields=['data']),
        ]
        # Evitar registros duplicados no mesmo dia/funcionário/local
        unique_together = ['funcionario', 'data', 'local_prestacao']

    def __str__(self):
        return f"{self.funcionario.nome_completo} - {self.data} - {self.local_prestacao}"

    @property
    def empresa_terceirizada(self):
        return self.funcionario.empresa

    @property
    def cidade(self):
        return self.local_prestacao.cidade

    @property
    def nome_completo(self):
        return self.funcionario.nome_completo

    @property
    def cargo(self):
        return self.funcionario.cargo

    @property
    def cpf(self):
        return self.funcionario.cpf

    @property
    def telefone(self):
        return self.funcionario.telefone

    @property
    def pix(self):
        return self.funcionario.pix

    @property
    def foto(self):
        return self.funcionario.usuario.foto

    @property
    def horas_trabalhadas(self):
        """Calcula total de horas trabalhadas"""
        from datetime import datetime, timedelta
        
        if not all([self.horario_chegada, self.horario_saida]):
            return timedelta(0)
        
        # Converte para datetime para cálculos
        chegada = datetime.combine(self.data, self.horario_chegada)
        saida = datetime.combine(self.data, self.horario_saida)
        
        # Se saída é no dia seguinte
        if saida < chegada:
            saida += timedelta(days=1)
        
        total = saida - chegada
        
        # Subtrai horário de almoço se informado
        if all([self.horario_saida_almoco, self.horario_retorno_almoco]):
            saida_almoco = datetime.combine(self.data, self.horario_saida_almoco)
            retorno_almoco = datetime.combine(self.data, self.horario_retorno_almoco)
            
            if retorno_almoco > saida_almoco:
                almoco = retorno_almoco - saida_almoco
                total -= almoco
        
        return total

    @property
    def valor_por_hora(self):
        """Calcula valor por hora trabalhada"""
        horas = self.horas_trabalhadas
        if horas.total_seconds() > 0:
            horas_decimal = Decimal(str(horas.total_seconds() / 3600))
            return self.valor / horas_decimal
        return Decimal('0.00')

    def clean(self):
        from django.core.exceptions import ValidationError
        
        # Validação de horários
        if self.horario_saida <= self.horario_chegada:
            raise ValidationError('Horário de saída deve ser posterior ao de chegada.')
        
        if self.horario_saida_almoco and self.horario_retorno_almoco:
            if self.horario_retorno_almoco <= self.horario_saida_almoco:
                raise ValidationError('Horário de retorno do almoço deve ser posterior à saída.')
            if self.horario_saida_almoco <= self.horario_chegada:
                raise ValidationError('Saída para almoço deve ser posterior à chegada.')
            if self.horario_retorno_almoco >= self.horario_saida:
                raise ValidationError('Retorno do almoço deve ser anterior à saída.')


class HistoricoValidacao(models.Model):
    """Histórico de validações dos registros"""
    prestacao = models.ForeignKey(RegistroPrestacao, on_delete=models.CASCADE, related_name='historico_validacoes')
    status_anterior = models.CharField(max_length=15, choices=RegistroPrestacao.STATUS_VALIDACAO_CHOICES)
    status_novo = models.CharField(max_length=15, choices=RegistroPrestacao.STATUS_VALIDACAO_CHOICES)
    validado_por = models.ForeignKey('core.Usuario', on_delete=models.PROTECT)
    observacoes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Histórico de Validação'
        verbose_name_plural = 'Históricos de Validação'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.prestacao} - {self.status_anterior} → {self.status_novo}"


# =============================================================================
# APP: RELATORIOS (Views e modelos para relatórios)
# =============================================================================

# relatorios/models.py
from django.db import models


class RelatorioPersonalizado(models.Model):
    """Relatórios personalizados salvos pelos usuários"""
    nome = models.CharField(max_length=200)
    usuario = models.ForeignKey('core.Usuario', on_delete=models.CASCADE, related_name='relatorios')
    filtros = models.JSONField(help_text="Filtros aplicados ao relatório")
    campos_exibidos = models.JSONField(help_text="Campos a serem exibidos")
    descricao = models.TextField(blank=True)
    publico = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Relatório Personalizado'
        verbose_name_plural = 'Relatórios Personalizados'
        ordering = ['nome']

    def __str__(self):
        return self.nome