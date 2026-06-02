from django.db import models

# Create your models here.
class Service(models.Model):
    name = models.CharField(
        max_length=120,
        unique=True,
        verbose_name="Nombre"
    )

    description = models.TextField(
        blank=True,
        verbose_name="Descripción"
    )

    duration_minutes = models.PositiveIntegerField(
        verbose_name="Duración en minutos"
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Precio"
    )

    is_active = models.BooleanField(
        default=True,
        verbose_name="Activo"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Fecha de creación"
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Fecha de actualización"
    )

    class Meta:
        verbose_name = "Servicio"
        verbose_name_plural = "Servicios"
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} - ₡{self.price}"
