from rest_framework import serializers
from .models import RelatorioPersonalizado


class RelatorioPersonalizadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = RelatorioPersonalizado
        fields = '__all__'
