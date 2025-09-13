from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EstadoView, CidadeView, LocalPrestacaoView

router = DefaultRouter()
router.register(r"estados", EstadoView)
router.register(r"cidades", CidadeView)
router.register(r"locais-prestacao", LocalPrestacaoView)

urlpatterns = [
    path("", include(router.urls)),
]
