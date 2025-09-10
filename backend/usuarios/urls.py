from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .views import UsuarioViewSet

# Configuração do router para ViewSets
router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')

urlpatterns = [
    # Inclui todas as rotas do router
    path('', include(router.urls)),
    
    # Rotas específicas para autenticação JWT
    path('auth/', include([
        # Endpoints customizados
        path('register/', UsuarioViewSet.as_view({'post': 'register'}), name='usuario-register'),
        path('login/', UsuarioViewSet.as_view({'post': 'login'}), name='usuario-login'),
        path('logout/', UsuarioViewSet.as_view({'post': 'logout'}), name='usuario-logout'),
        path('me/', UsuarioViewSet.as_view({'get': 'me'}), name='usuario-me'),
        path('me/update/', UsuarioViewSet.as_view({'put': 'update_me'}), name='usuario-update-me'),
        path('change-password/', UsuarioViewSet.as_view({'post': 'change_password'}), name='usuario-change-password'),
        path('refresh-token/', UsuarioViewSet.as_view({'post': 'refresh_token'}), name='usuario-refresh-token'),
        
        # Endpoints JWT padrão
        path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
        path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
        path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    ])),
]
