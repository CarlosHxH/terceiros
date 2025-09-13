from django.shortcuts import render
from rest_framework import viewsets
from .models import RegistroPonto
from .serializers import RegistroPontoSerializer

# Create your views here.

class RegistroPontoView(viewsets.ModelViewSet):
    queryset = RegistroPonto.objects.all()
    serializer_class = RegistroPontoSerializer