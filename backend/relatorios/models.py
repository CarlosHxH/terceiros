# relatorios/models.py
from django.db import models

# Esta app agora serve apenas como namespace para os endpoints de relatórios
# Os dados são obtidos diretamente dos modelos das outras apps:
# - funcionarios.models.Funcionario
# - prestacoes.models.RegistroPrestacao  
# - ponto.models.RegistroPonto
# - empresas.models.EmpresaTerceirizada

# Não precisamos de modelos próprios aqui, apenas dos endpoints filtrados