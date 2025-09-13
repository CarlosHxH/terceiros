from rest_framework import serializers
from .models import RegistroPonto


class RegistroPontoSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistroPonto
        fields = '__all__'
