from datetime import timedelta

from django.utils import timezone

from apps.notifications.models import Notification


def create_appointment_notifications(appointment):
    client = appointment.client
    esthetician = appointment.esthetician
    service = appointment.service

    appointment_date = timezone.localtime(appointment.start_time).strftime("%d/%m/%Y")
    appointment_time = timezone.localtime(appointment.start_time).strftime("%I:%M %p")

    client_message = (
        f"Hola {client.first_name}, le recordamos su cita de "
        f"{service.name} el {appointment_date} a las {appointment_time}."
    )

    staff_message = (
        f"Hola {esthetician.first_name}, tiene una cita de "
        f"{service.name} con {client.first_name} {client.last_name} "
        f"el {appointment_date} a las {appointment_time}."
    )

    client_scheduled_for = appointment.start_time - timedelta(hours=24)
    staff_scheduled_for = appointment.start_time - timedelta(hours=2)

    if client.email:
        Notification.objects.create(
            appointment=appointment,
            notification_type=Notification.NotificationType.CLIENT_REMINDER,
            channel=Notification.Channel.EMAIL,
            recipient=client.email,
            message=client_message,
            scheduled_for=client_scheduled_for,
        )

    if client.phone:
        Notification.objects.create(
            appointment=appointment,
            notification_type=Notification.NotificationType.CLIENT_REMINDER,
            channel=Notification.Channel.WHATSAPP,
            recipient=client.phone,
            message=client_message,
            scheduled_for=client_scheduled_for,
        )

    if esthetician.email:
        Notification.objects.create(
            appointment=appointment,
            notification_type=Notification.NotificationType.STAFF_REMINDER,
            channel=Notification.Channel.EMAIL,
            recipient=esthetician.email,
            message=staff_message,
            scheduled_for=staff_scheduled_for,
        )

    if esthetician.telefono:
        Notification.objects.create(
            appointment=appointment,
            notification_type=Notification.NotificationType.STAFF_REMINDER,
            channel=Notification.Channel.WHATSAPP,
            recipient=esthetician.telefono,
            message=staff_message,
            scheduled_for=staff_scheduled_for,
        )