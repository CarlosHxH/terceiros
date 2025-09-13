from django.contrib import admin
from .models import Estado, Cidade, LocalPrestacao


@admin.register(Estado)
class EstadoAdmin(admin.ModelAdmin):
    list_display = ("nome", "sigla", "ativo", "created_at")
    search_fields = ("nome", "sigla")
    list_filter = ("ativo", "created_at")
    list_per_page = 20
    readonly_fields = ("created_at", "updated_at")
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('nome', 'sigla', 'ativo')
        }),
        ('Auditoria', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Cidade)
class CidadeAdmin(admin.ModelAdmin):
    list_display = ("nome", "estado", "codigo_ibge", "ativa", "created_at")
    search_fields = ("nome", "estado__nome", "estado__sigla", "codigo_ibge")
    list_filter = ("estado", "ativa", "created_at")
    list_per_page = 20
    readonly_fields = ("created_at", "updated_at")
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('nome', 'estado', 'codigo_ibge', 'ativa')
        }),
        ('Auditoria', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(LocalPrestacao)
class LocalPrestacaoAdmin(admin.ModelAdmin):
    list_display = ("nome", "cidade", "ativo", "created_at")
    search_fields = ("nome", "cidade__nome", "endereco", "cep")
    list_filter = ("cidade__estado", "cidade", "ativo", "created_at")
    list_per_page = 20
    readonly_fields = ("created_at", "updated_at")
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('nome', 'cidade', 'ativo')
        }),
        ('Endereço', {
            'fields': ('endereco', 'cep')
        }),
        ('Geolocalização', {
            'fields': ('latitude', 'longitude'),
            'classes': ('collapse',)
        }),
        ('Observações', {
            'fields': ('observacoes',),
            'classes': ('collapse',)
        }),
        ('Auditoria', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
