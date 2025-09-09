# relatorios/models.py
from django.db import models


class RelatorioPersonalizado(models.Model):
    """Relatórios personalizados salvos pelos usuários"""
    nome = models.CharField(max_length=200)
    usuario = models.ForeignKey('usuarios.Usuario', on_delete=models.CASCADE, related_name='relatorios')
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