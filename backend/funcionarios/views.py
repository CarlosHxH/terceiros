from django.shortcuts import render
from rest_framework import viewsets
from .models import Funcionario
from .serialazer import FuncionarioSerializer

# Create your views here.

class FuncionariosView(viewsets.ModelViewSet):
    queryset = Funcionario.objects.all()
    serializer_class = FuncionarioSerializer