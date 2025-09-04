from rest_framework import serializers
from .models import Terceiro

class TerceiroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Terceiro
        fields = '__all__'