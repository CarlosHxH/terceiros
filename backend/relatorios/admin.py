from django.contrib import admin
from .models import RelatorioPersonalizado

@admin.register(RelatorioPersonalizado)
class RelatorioPersonalizadoAdmin(admin.ModelAdmin):
    list_display = ("nome", "usuario", "publico", "created_at")
    search_fields = ("nome", "usuario__username", "usuario__first_name", "usuario__last_name")
    list_filter = ("publico", "created_at", "usuario")
    list_per_page = 20
    readonly_fields = ("created_at", "updated_at")

    fieldsets = (
        ('Informações Básicas', {
            'fields': ('nome', 'usuario', 'publico')
        }),
        ('Configuração', {
            'fields': ('filtros', 'campos_exibidos')
        }),
        ('Descrição', {
            'fields': ('descricao',)
        }),
        ('Auditoria', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )