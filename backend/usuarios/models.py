# usuarios/models.py
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
