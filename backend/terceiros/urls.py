from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TerceirosView

router = DefaultRouter()
router.register(r"terceiros", TerceirosView)

urlpatterns = [
    path("", include(router.urls)),
]
