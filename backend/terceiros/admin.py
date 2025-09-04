from django.contrib import admin
from rest_framework.serializers import ModelSerializer

# Register your models here.
from .models import Terceiro
from .serialazer import TerceiroSerializer


class TerceiroAdmin(admin.ModelAdmin):
    list_display = ("nome", "telefone")
    search_fields = ("nome", "telefone")
    list_display_links = ("nome", "telefone")
    list_filter = ("nome", "telefone")
    list_per_page = 10


admin.site.register(Terceiro, TerceiroAdmin)
