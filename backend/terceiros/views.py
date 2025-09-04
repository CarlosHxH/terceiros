from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets
from .models import Terceiro
from .serialazer import TerceiroSerializer

# Create your views here.


class TerceirosView(viewsets.ModelViewSet):
    queryset = Terceiro.objects.all()
    serializer_class = TerceiroSerializer

    
