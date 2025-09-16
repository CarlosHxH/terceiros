from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import Usuario
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UsuarioSerializer(serializers.ModelSerializer):
    """Serializer para o modelo Usuario"""
    
    class Meta:
        model = Usuario
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'cpf', 'telefone', 'is_active', 'is_staff',
            'date_joined', 'last_login', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login', 'created_at', 'updated_at']


class UsuarioCreateSerializer(serializers.ModelSerializer):
    """Serializer para criação de usuários"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = Usuario
        fields = [
            'username', 'email', 'first_name', 'last_name', 
            'cpf', 'telefone', 'password', 'password_confirm'
        ]
    
    def validate(self, attrs):
        """Validação customizada"""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("As senhas não coincidem.")
        return attrs
    
    def validate_cpf(self, value):
        """Validação do CPF"""
        if Usuario.objects.filter(cpf=value).exists():
            raise serializers.ValidationError("Já existe um usuário com este CPF.")
        return value
    
    def validate_email(self, value):
        """Validação do email"""
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError("Já existe um usuário com este email.")
        return value
    
    def create(self, validated_data):
        """Criação do usuário"""
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        usuario = Usuario.objects.create_user(**validated_data)
        usuario.set_password(password)
        usuario.save()
        return usuario


class UsuarioUpdateSerializer(serializers.ModelSerializer):
    """Serializer para atualização de usuários"""
    
    class Meta:
        model = Usuario
        fields = [
            'email', 'first_name', 'last_name', 
            'cpf', 'telefone', 'is_active'
        ]
    
    def validate_cpf(self, value):
        """Validação do CPF na atualização"""
        if self.instance and Usuario.objects.filter(cpf=value).exclude(pk=self.instance.pk).exists():
            raise serializers.ValidationError("Já existe um usuário com este CPF.")
        return value
    
    def validate_email(self, value):
        """Validação do email na atualização"""
        if self.instance and Usuario.objects.filter(email=value).exclude(pk=self.instance.pk).exists():
            raise serializers.ValidationError("Já existe um usuário com este email.")
        return value


class UsuarioPasswordSerializer(serializers.Serializer):
    """Serializer para alteração de senha"""
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        """Validação das senhas"""
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("As novas senhas não coincidem.")
        return attrs
    
    def validate_old_password(self, value):
        """Validação da senha atual"""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Senha atual incorreta.")
        return value


class EmailOrUsernameTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Permite autenticar usando username OU email no endpoint de token."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Tornar username opcional e adicionar campo email opcional
        if self.username_field in self.fields:
            self.fields[self.username_field].required = False
        self.fields['email'] = serializers.EmailField(required=False)

    def validate(self, attrs):
        username = attrs.get(self.username_field)
        email = self.initial_data.get('email')

        # Se email foi enviado e username não, resolve o username pelo email
        if email and not username:
            try:
                user = Usuario.objects.get(email=email)
                attrs[self.username_field] = getattr(user, self.username_field)
            except Usuario.DoesNotExist:
                # Mantém fluxo padrão que resultará em credenciais inválidas
                attrs[self.username_field] = ''

        return super().validate(attrs)
