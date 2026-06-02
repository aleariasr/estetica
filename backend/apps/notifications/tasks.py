from celery import shared_task
from django.core.mail import send_mail
from django.utils import timezone

from apps.notifications.models import Notification
from apps.notifications.whatsapp_service import WhatsAppService


@shared_task
def test_notification_task():
    return "Celery está funcionando correctamente."


@shared_task
def send_pending_notifications():
    now = timezone.now()

    notifications = Notification.objects.filter(
        status=Notification.Status.PENDING,
        scheduled_for__lte=now,
    )

    sent_count = 0

    for notification in notifications:
        try:
            if notification.channel == Notification.Channel.EMAIL:
                send_mail(
                    subject="Recordatorio de cita",
                    message=notification.message,
                    from_email=None,
                    recipient_list=[notification.recipient],
                    fail_silently=False,
                )

            elif notification.channel == Notification.Channel.WHATSAPP:
                WhatsAppService.send_message(
                    to=notification.recipient,
                    message=notification.message,
                )

            else:
                raise ValueError(
                    f"Canal de notificación no soportado: {notification.channel}"
                )

            notification.status = Notification.Status.SENT
            notification.sent_at = now
            notification.error_message = ""
            notification.save()

            sent_count += 1

        except Exception as error:
            notification.status = Notification.Status.FAILED
            notification.error_message = str(error)
            notification.save()

    return f"Notificaciones enviadas: {sent_count}"