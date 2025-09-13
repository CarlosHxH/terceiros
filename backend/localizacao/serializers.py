from rest_framework import serializers
from .models import Estado, Cidade, LocalPrestacao


class EstadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estado
        fields = '__all__'


class CidadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cidade
        fields = '__all__'


class LocalPrestacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocalPrestacao
        fields = '__all__'
