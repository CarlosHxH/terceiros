from django.contrib import admin
from rest_framework.serializers import ModelSerializer

# Register your models here.
from .models import Terceiro
from .serialazer import TerceiroSerializer


class TerceiroAdmin(admin.ModelAdmin):
    list_display = ('nome', 'email', 'telefone', 'endereco', 'cidade', 'estado', 'cep')
    search_fields = ('nome', 'email', 'telefone', 'endereco', 'cidade', 'estado', 'cep')
    list_filter = ('estado', 'cidade')
    list_per_page = 10

admin.site.register(Terceiro, TerceiroAdmin)