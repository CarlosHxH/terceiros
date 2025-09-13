from django.contrib import admin

from .models import EmpresaTerceirizada, Gestor

@admin.register(EmpresaTerceirizada)
class EmpresaTerceirizadaAdmin(admin.ModelAdmin):
    list_display = ("razao_social", "nome_fantasia", "ativa")
    search_fields = ("razao_social", "nome_fantasia")
    list_filter = ("ativa",)
    list_per_page = 10
    readonly_fields = ("created_at", "updated_at")

@admin.register(Gestor)
class GestorAdmin(admin.ModelAdmin):
    list_display = ("usuario", "empresa", "cargo")
    search_fields = ("usuario", "empresa", "cargo")
    list_filter = ("empresa", "cargo")
    list_per_page = 10
    readonly_fields = ("created_at", "updated_at")


