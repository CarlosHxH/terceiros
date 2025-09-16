from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RelatorioPersonalizadoView, FuncionarioViewSet, 
    PrestacaoViewSet, PontoViewSet, DashboardViewSet
)

router = DefaultRouter()
router.register(r"relatorios", RelatorioPersonalizadoView)
router.register(r"funcionarios", FuncionarioViewSet)
router.register(r"prestacoes", PrestacaoViewSet)
router.register(r"pontos", PontoViewSet)
router.register(r"dashboard", DashboardViewSet, basename='dashboard')

urlpatterns = [
    path("", include(router.urls)),
]
