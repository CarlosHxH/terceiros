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
        'usuarios.Usuario',
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
    validado_por = models.ForeignKey('usuarios.Usuario', on_delete=models.PROTECT)
    observacoes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Histórico de Validação'
        verbose_name_plural = 'Históricos de Validação'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.prestacao} - {self.status_anterior} → {self.status_novo}"
