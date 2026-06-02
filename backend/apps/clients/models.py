from django.db import models

# Create your models here.
class Client(models.Model):

    first_name = models.CharField(max_length=80, verbose_name="Nombre")
    last_name = models.CharField(max_length=80, verbose_name="Apellido")

    phone = models.CharField(
        max_length=20,
        unique=True,
        verbose_name="Teléfono"
    )

    email = models.EmailField(
        blank=True,
        null=True,
        verbose_name="Correo electrónico"
    )

    notes = models.TextField(
        blank=True,
        verbose_name="Notas"
    )

    is_active = models.BooleanField(
        default=True,
        verbose_name="Activo"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Fecha de registro"
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Última actualización"
    )

    class Meta:
        verbose_name = "Cliente"
        verbose_name_plural = "Clientes"
        ordering = ["first_name", "last_name"]

    def __str__(self):
        return f"{self.first_name} {self.last_name}"