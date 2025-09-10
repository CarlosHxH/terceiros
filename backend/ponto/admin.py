from django.contrib import admin
from .models import RegistroPonto

@admin.register(RegistroPonto)
class RegistroPontoAdmin(admin.ModelAdmin):
    list_display = ("funcionario", "created_at")
    search_fields = ("funcionario", "created_at")
    list_display_links = ("funcionario", "created_at")
    list_filter = ("funcionario", "created_at")
    list_per_page = 10
    readonly_fields = ("created_at", "updated_at")