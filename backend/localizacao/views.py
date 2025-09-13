from django.shortcuts import render
from rest_framework import viewsets
from .models import Estado, Cidade, LocalPrestacao
from .serializers import EstadoSerializer, CidadeSerializer, LocalPrestacaoSerializer

# Create your views here.

class EstadoView(viewsets.ModelViewSet):
    queryset = Estado.objects.all()
    serializer_class = EstadoSerializer

class CidadeView(viewsets.ModelViewSet):
    queryset = Cidade.objects.all()
    serializer_class = CidadeSerializer

class LocalPrestacaoView(viewsets.ModelViewSet):
    queryset = LocalPrestacao.objects.all()
    serializer_class = LocalPrestacaoSerializer