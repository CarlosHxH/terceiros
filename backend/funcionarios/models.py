# funcionarios/models.py
from django.db import models
from django.core.validators import RegexValidator
# Removendo importações diretas para evitar importação circular




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
    usuario = models.OneToOneField('USUARIOS.Usuario', on_delete=models.CASCADE, related_name='funcionario')
    empresa = models.ForeignKey('EMPRESAS.EmpresaTerceirizada', on_delete=models.PROTECT, related_name='funcionarios')
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