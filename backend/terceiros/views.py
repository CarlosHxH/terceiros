from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Terceiro
from .serialazer import TerceiroSerializer
# Create your views here.

class TerceirosView(APIView):
    def get(self, request):
        terceiros = Terceiro.objects.all()
        serializer = TerceiroSerializer(terceiros, many=True)
        return Response(serializer.data)
        


