from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmpresaTerceirizadaView, GestorView

router = DefaultRouter()
router.register(r"empresas", EmpresaTerceirizadaView)
router.register(r"gestores", GestorView)

urlpatterns = [
    path("", include(router.urls)),
]
