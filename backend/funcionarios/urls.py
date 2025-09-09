from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FuncionariosView

router = DefaultRouter()
router.register(r"funcionarios", FuncionariosView)

urlpatterns = [
    path("", include(router.urls)),
]
