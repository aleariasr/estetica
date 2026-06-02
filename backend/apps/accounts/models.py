from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):

    class Roles(models.TextChoices):
        ADMIN = "ADMIN", "Administrador"
        ESTETICISTA = "ESTETICISTA", "Esteticista"
        RECEPCIONISTA = "RECEPCIONISTA", "Recepcionista"

    role = models.CharField(
        max_length=20,
        choices=Roles.choices,
        default=Roles.RECEPCIONISTA

    )

    telefono = models.CharField(
        max_length=20,
        blank=True,
        null=True

    )

    def __str__(self):
        return f"{self.username} - {self.get_role_display()}"