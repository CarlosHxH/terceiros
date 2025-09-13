# empresas/models.py
from django.db import models
from django.core.validators import RegexValidator
from usuarios.models import Usuario


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
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Gestor'
        verbose_name_plural = 'Gestores'
        ordering = ['empresa', 'usuario__first_name']

    def __str__(self):
        return f"{self.usuario.get_full_name()} - {self.empresa}"