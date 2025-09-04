from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Terceiro

# Create your views here.

class TerceirosView(APIView):
    def get(self, request):
        terceiros = Terceiro.objects.all()
        return Response({'message': terceiros.values()})
        