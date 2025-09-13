from django.contrib import admin
from .models import RegistroPrestacao, HistoricoValidacao


@admin.register(RegistroPrestacao)
class RegistroPrestacaoAdmin(admin.ModelAdmin):
    list_display = ("funcionario", "data", "local_prestacao", "valor", "validacao_gestor", "created_at")
    search_fields = ("funcionario__usuario__first_name", "funcionario__usuario__last_name", "local_prestacao__nome")
    list_filter = ("data", "validacao_gestor", "validacao_local", "funcionario__empresa", "created_at")
    list_per_page = 20
    readonly_fields = ("created_at", "updated_at")
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('funcionario', 'local_prestacao', 'gestor', 'data')
        }),
        ('Horários', {
            'fields': ('horario_chegada', 'horario_saida_almoco', 'horario_retorno_almoco', 'horario_saida')
        }),
        ('Validações', {
            'fields': ('validacao_local', 'validacao_gestor')
        }),
        ('Financeiro', {
            'fields': ('valor', 'observacoes')
        }),
        ('Evidências', {
            'fields': ('foto_comprovante',)
        }),
        ('Geolocalização', {
            'fields': ('latitude_chegada', 'longitude_chegada', 'latitude_saida', 'longitude_saida'),
            'classes': ('collapse',)
        }),
        ('Auditoria', {
            'fields': ('created_at', 'updated_at', 'created_by'),
            'classes': ('collapse',)
        }),
    )


@admin.register(HistoricoValidacao)
class HistoricoValidacaoAdmin(admin.ModelAdmin):
    list_display = ("prestacao", "status_anterior", "status_novo", "validado_por", "created_at")
    search_fields = ("prestacao__funcionario__usuario__first_name", "validado_por__username")
    list_filter = ("status_anterior", "status_novo", "created_at")
    list_per_page = 20
    readonly_fields = ("created_at", "updated_at")
    
    fieldsets = (
        ('Validação', {
            'fields': ('prestacao', 'status_anterior', 'status_novo', 'validado_por')
        }),
        ('Observações', {
            'fields': ('observacoes',)
        }),
        ('Auditoria', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
