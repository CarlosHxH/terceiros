from rest_framework import serializers
from .models import EmpresaTerceirizada, Gestor

class EmpresaTerceirizadaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmpresaTerceirizada
        fields = '__all__'

class GestorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gestor
        fields = '__all__'