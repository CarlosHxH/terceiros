from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from .models import Usuario
from .serializers import (
    UsuarioSerializer, 
    UsuarioCreateSerializer, 
    UsuarioUpdateSerializer,
    UsuarioPasswordSerializer
)


class UsuarioViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciamento de usuários com permissões Django"""
    
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        """Retorna o serializer apropriado baseado na ação"""
        if self.action == 'create':
            return UsuarioCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return UsuarioUpdateSerializer
        return UsuarioSerializer
    
    def get_permissions(self):
        """Define permissões específicas para cada ação"""
        # Endpoints públicos (não exigem autenticação)
        if self.action in ['register', 'login', 'refresh_token', 'create']:
            permission_classes = [permissions.AllowAny]
        # Demais endpoints exigem autenticação
        elif self.action in [
            'list', 'retrieve', 'update', 'partial_update', 'destroy',
            'me', 'update_me', 'change_password', 'logout',
            'toggle_active', 'toggle_staff'
        ]:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAuthenticated]
        
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        """Criação de usuário com validações"""
        serializer.save()
    
    def perform_update(self, serializer):
        """Atualização de usuário com validações"""
        # Verifica se o usuário pode editar este perfil
        if self.request.user != serializer.instance and not self.request.user.is_staff:
            return Response(
                {'detail': 'Você não tem permissão para editar este usuário.'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer.save()
    
    def perform_destroy(self, instance):
        """Exclusão de usuário com validações"""
        # Apenas staff pode deletar usuários
        if not self.request.user.is_staff:
            return Response(
                {'detail': 'Você não tem permissão para deletar usuários.'},
                status=status.HTTP_403_FORBIDDEN
            )
        instance.delete()
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def register(self, request):
        """Endpoint para registro de novos usuários"""
        serializer = UsuarioCreateSerializer(data=request.data)
        if serializer.is_valid():
            usuario = serializer.save()
            # Cria tokens JWT
            refresh = RefreshToken.for_user(usuario)
            access_token = refresh.access_token
            
            return Response({
                'usuario': UsuarioSerializer(usuario).data,
                'tokens': {
                    'access': str(access_token),
                    'refresh': str(refresh)
                },
                'message': 'Usuário criado com sucesso!'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def login(self, request):
        """Endpoint para login de usuários"""
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'detail': 'Username e password são obrigatórios.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)
        if user and user.is_active:
            # Cria tokens JWT
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            
            return Response({
                'usuario': UsuarioSerializer(user).data,
                'tokens': {
                    'access': str(access_token),
                    'refresh': str(refresh)
                },
                'message': 'Login realizado com sucesso!'
            })
        else:
            return Response(
                {'detail': 'Credenciais inválidas ou usuário inativo.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def logout(self, request):
        """Endpoint para logout de usuários"""
        try:
            # Com JWT, o logout é feito no frontend removendo o token
            # Aqui podemos adicionar o token à blacklist se necessário
            return Response({'message': 'Logout realizado com sucesso!'})
        except:
            return Response(
                {'detail': 'Erro ao realizar logout.'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """Endpoint para obter dados do usuário logado"""
        return Response(UsuarioSerializer(request.user).data)
    
    @action(detail=False, methods=['put'], permission_classes=[permissions.IsAuthenticated])
    def update_me(self, request):
        """Endpoint para atualizar dados do usuário logado"""
        serializer = UsuarioUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'usuario': UsuarioSerializer(request.user).data,
                'message': 'Perfil atualizado com sucesso!'
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def change_password(self, request):
        """Endpoint para alteração de senha"""
        serializer = UsuarioPasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'message': 'Senha alterada com sucesso!'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def toggle_active(self, request, pk=None):
        """Endpoint para ativar/desativar usuário (apenas admin)"""
        usuario = self.get_object()
        usuario.is_active = not usuario.is_active
        usuario.save()
        status_text = 'ativado' if usuario.is_active else 'desativado'
        return Response({
            'message': f'Usuário {status_text} com sucesso!',
            'is_active': usuario.is_active
        })
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def toggle_staff(self, request, pk=None):
        """Endpoint para dar/remover permissões de staff (apenas admin)"""
        usuario = self.get_object()
        usuario.is_staff = not usuario.is_staff
        usuario.save()
        status_text = 'promovido a staff' if usuario.is_staff else 'removido do staff'
        return Response({
            'message': f'Usuário {status_text} com sucesso!',
            'is_staff': usuario.is_staff
        })
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def refresh_token(self, request):
        """Endpoint para renovar access token usando refresh token"""
        refresh_token = request.data.get('refresh')
        
        if not refresh_token:
            return Response(
                {'detail': 'Refresh token é obrigatório.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            refresh = RefreshToken(refresh_token)
            access_token = refresh.access_token
            
            return Response({
                'access': str(access_token),
                'message': 'Token renovado com sucesso!'
            })
        except Exception as e:
            return Response(
                {'detail': 'Refresh token inválido ou expirado.'},
                status=status.HTTP_401_UNAUTHORIZED
            )