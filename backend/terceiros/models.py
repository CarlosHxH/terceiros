from django.db import models
from uuid import uuid4
# Create your models here.
class Terceiro(models.Model):
    nome = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    telefone = models.CharField(max_length=255)
    endereco = models.CharField(max_length=255)
    cidade = models.CharField(max_length=255)
    estado = models.CharField(max_length=255)
    cep = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nome