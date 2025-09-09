from django.contrib import admin
from .models import Funcionario, Cargo


@admin.register(Funcionario)
class FuncionarioAdmin(admin.ModelAdmin):
    list_display = ("nome_completo", "cargo", "empresa", "ativo")
    search_fields = ("usuario__first_name", "usuario__last_name", "usuario__cpf", "registro")
    list_display_links = ("nome_completo",)
    list_filter = ("cargo", "empresa", "ativo", "data_admissao")
    list_per_page = 20
    readonly_fields = ("created_at", "updated_at")
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('usuario', 'empresa', 'cargo')
        }),
        ('Dados Financeiros', {
            'fields': ('pix', 'banco', 'agencia', 'conta')
        }),
        ('Dados Trabalhistas', {
            'fields': ('registro', 'data_admissao', 'data_demissao')
        }),
        ('Status', {
            'fields': ('ativo', 'created_at', 'updated_at')
        }),
    )


@admin.register(Cargo)
class CargoAdmin(admin.ModelAdmin):
    list_display = ("nome", "nivel", "ativo", "created_at")
    search_fields = ("nome", "descricao")
    list_filter = ("nivel", "ativo")
    list_per_page = 20
