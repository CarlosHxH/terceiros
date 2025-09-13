from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegistroPrestacaoView, HistoricoValidacaoView

router = DefaultRouter()
router.register(r"prestacoes", RegistroPrestacaoView)
router.register(r"historico-validacoes", HistoricoValidacaoView)

urlpatterns = [
    path("", include(router.urls)),
]
