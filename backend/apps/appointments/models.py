from datetime import timedelta

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone

from apps.clients.models import Client
from apps.services.models import Service

# Create your models here.
class Appointment(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pendiente"
        CONFIRMED = "CONFIRMED", "Confirmada"
        COMPLETED = "COMPLETED", "Completada"
        CANCELED = "CANCELED", "Cancelada"
        NO_SHOW = "NO_SHOW", "No asistió"

    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name="appointments",
        verbose_name="Cliente"
    )

    esthetician = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="appointments",
        verbose_name="Esteticista"
    )

    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        verbose_name="Servicio"
    )

    start_time = models.DateTimeField(verbose_name="Inicio")

    end_time = models.DateTimeField(
        verbose_name="Fin",
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        verbose_name="Estado"
    )

    notes = models.TextField(
        blank=True,
        verbose_name="Notas"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Fecha de creación"
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Última actualización"
    )

    class Meta:
        verbose_name = "Cita"
        verbose_name_plural = "Citas"
        ordering = ["-start_time"]

    def __str__(self):
        return f"{self.client} - {self.service} ({timezone.localtime(self.start_time)})"

    def calculate_end_time(self):
        if self.start_time and self.service:
            return self.start_time + timedelta(minutes=self.service.duration_minutes)
        return None

    def clean(self):
        if not self.client:
            raise ValidationError("Debe seleccionar un cliente.")

        if not self.esthetician:
            raise ValidationError("Debe seleccionar una esteticista.")

        if not self.service:
            raise ValidationError("Debe seleccionar un servicio.")

        if not self.start_time:
            raise ValidationError("Debe indicar la fecha y hora de inicio.")

        if self.esthetician.role != "ESTETICISTA":
            raise ValidationError("El usuario seleccionado no tiene rol de esteticista.")

        if not self.service.is_active:
            raise ValidationError("No se puede agendar una cita con un servicio inactivo.")

        if not self.client.is_active:
            raise ValidationError("No se puede agendar una cita para un cliente inactivo.")

        if self.start_time < timezone.now() and self.status in [
            self.Status.PENDING,
            self.Status.CONFIRMED,
        ]:
            raise ValidationError("No se puede crear o confirmar una cita en el pasado.")

        calculated_end_time = self.calculate_end_time()

        if not calculated_end_time:
            raise ValidationError("No se pudo calcular la hora de finalización.")

        active_statuses = [
            self.Status.PENDING,
            self.Status.CONFIRMED,
        ]

        overlapping = Appointment.objects.filter(
            esthetician=self.esthetician,
            status__in=active_statuses,
            start_time__lt=calculated_end_time,
            end_time__gt=self.start_time,
        ).exclude(id=self.id)

        if overlapping.exists() and self.status in active_statuses:
            raise ValidationError("La esteticista ya tiene una cita en ese horario.")

    def save(self, *args, **kwargs):
        is_new = self.pk is None

        self.end_time = self.calculate_end_time()

        self.full_clean()
        super().save(*args, **kwargs)

        if is_new:
            from apps.notifications.services import create_appointment_notifications
            create_appointment_notifications(self)