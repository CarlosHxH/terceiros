from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegistroPontoView

router = DefaultRouter()
router.register(r"pontos", RegistroPontoView)

urlpatterns = [
    path("", include(router.urls)),
]
