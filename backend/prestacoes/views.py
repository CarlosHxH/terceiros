from django.shortcuts import render
from rest_framework import viewsets
from .models import RegistroPrestacao, HistoricoValidacao
from .serializers import RegistroPrestacaoSerializer, HistoricoValidacaoSerializer

# Create your views here.

class RegistroPrestacaoView(viewsets.ModelViewSet):
    queryset = RegistroPrestacao.objects.all()
    serializer_class = RegistroPrestacaoSerializer

class HistoricoValidacaoView(viewsets.ModelViewSet):
    queryset = HistoricoValidacao.objects.all()
    serializer_class = HistoricoValidacaoSerializer