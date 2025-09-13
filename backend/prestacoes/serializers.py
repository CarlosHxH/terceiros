from rest_framework import serializers
from .models import RegistroPrestacao, HistoricoValidacao


class RegistroPrestacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistroPrestacao
        fields = '__all__'


class HistoricoValidacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoricoValidacao
        fields = '__all__'
