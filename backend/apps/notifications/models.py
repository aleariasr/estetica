from django.db import models
from apps.appointments.models import Appointment

# Create your models here.
class Notification(models.Model):

    class NotificationType(models.TextChoices):
        CLIENT_REMINDER = "CLIENT_REMINDER", "Recordatorio para cliente"
        STAFF_REMINDER = "STAFF_REMINDER", "Recordatorio para esteticista"

    class Channel(models.TextChoices):
        EMAIL = "EMAIL", "Correo electrónico"
        WHATSAPP = "WHATSAPP", "WhatsApp"
        SYSTEM = "SYSTEM", "Sistema"

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pendiente"
        SENT = "SENT", "Enviado"
        FAILED = "FAILED", "Fallido"

    appointment = models.ForeignKey(
        Appointment,
        on_delete=models.CASCADE,
        related_name="notifications",
        verbose_name="Cita"
    )

    channel = models.CharField(
        max_length=20,
        choices=Channel.choices,
        default=Channel.SYSTEM,
        verbose_name="Canal"
    )

    recipient = models.CharField(
        max_length=150,
        verbose_name="Destinatario"
    )

    message = models.TextField(
        verbose_name="Mensaje"
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        verbose_name="Estado"
    )

    scheduled_for = models.DateTimeField(
        verbose_name="Programado para"
    )

    sent_at = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name="Enviado en"
    )

    error_message = models.TextField(
        blank=True,
        verbose_name="Mensaje de error"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Fecha de creación"
    )

    notification_type = models.CharField(
    max_length=30,
    choices=NotificationType.choices,
    verbose_name="Tipo de notificación"
    )

    class Meta:
        verbose_name = "Notificación"
        verbose_name_plural = "Notificaciones"
        ordering = ["-scheduled_for"]

    def __str__(self):
        return f"{self.channel} - {self.recipient} - {self.status}"