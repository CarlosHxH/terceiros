from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RelatorioPersonalizadoView

router = DefaultRouter()
router.register(r"relatorios", RelatorioPersonalizadoView)

urlpatterns = [
    path("", include(router.urls)),
]
