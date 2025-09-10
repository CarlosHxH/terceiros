# ponto/models.py
from django.db import models


class RegistroPonto(models.Model):
    """
    Registro de ponto dos funcionários.
    Responsável por armazenar a foto (comprovante), IP, latitude, longitude e o funcionário relacionado.
    Utilizado para validação de presença/autenticação do usuário no local.
    """
    foto = models.ImageField(upload_to='pontos/%Y/%m/', help_text="Foto do funcionário no momento do ponto")
    ip = models.CharField(max_length=100, help_text="IP do dispositivo no momento do registro")
    latitude = models.DecimalField(max_digits=10, decimal_places=8, help_text="Latitude do local do ponto")
    longitude = models.DecimalField(max_digits=11, decimal_places=8, help_text="Longitude do local do ponto")
    funcionario = models.ForeignKey(
        'funcionarios.Funcionario',
        on_delete=models.PROTECT,
        related_name='pontos',
        help_text="Funcionário que realizou o ponto"
    )
    created_at = models.DateTimeField(auto_now_add=True, help_text="Data e hora do registro do ponto")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Registro de Ponto'
        verbose_name_plural = 'Registros de Ponto'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.funcionario} - {self.created_at.strftime('%d/%m/%Y %H:%M:%S')}"

    def to_dict(self):
        """
        Retorna um dicionário com os dados essenciais para resposta da API.
        Ideal para uso em serializers customizados ou respostas diretas.
        """
        return {
            "id": self.id,
            "funcionario_id": self.funcionario.id,
            "nome_funcionario": str(self.funcionario),
            "created_at": self.created_at.isoformat(),
            "foto_url": self.foto.url if self.foto else None,
            "ip": self.ip,
            "latitude": float(self.latitude) if self.latitude else None,
            "longitude": float(self.longitude) if self.longitude else None,
        }