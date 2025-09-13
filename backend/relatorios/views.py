from django.shortcuts import render
from rest_framework import viewsets
from .models import RelatorioPersonalizado
from .serializers import RelatorioPersonalizadoSerializer

# Create your views here.

class RelatorioPersonalizadoView(viewsets.ModelViewSet):
    queryset = RelatorioPersonalizado.objects.all()
    serializer_class = RelatorioPersonalizadoSerializer