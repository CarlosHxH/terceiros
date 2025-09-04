from django.urls import path
from .views import TerceirosView

urlpatterns = [
    path('terceiros/', TerceirosView.as_view(), name='terceiros'),
]