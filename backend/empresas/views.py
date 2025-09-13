from django.shortcuts import render
from rest_framework import viewsets
from .models import EmpresaTerceirizada, Gestor
from .serialazer import EmpresaTerceirizadaSerializer, GestorSerializer

# Create your views here.

class EmpresaTerceirizadaView(viewsets.ModelViewSet):
    queryset = EmpresaTerceirizada.objects.all()
    serializer_class = EmpresaTerceirizadaSerializer

class GestorView(viewsets.ModelViewSet):
    queryset = Gestor.objects.all()
    serializer_class = GestorSerializer