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
