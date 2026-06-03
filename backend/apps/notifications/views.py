from django.core.mail import send_mail
from django.utils import timezone

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Notification
from .serializers import NotificationSerializer
from .whatsapp_service import WhatsAppService


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.select_related(
            "appointment",
            "appointment__client",
            "appointment__service",
            "appointment__esthetician",
        ).all()

    @action(detail=True, methods=["post"], url_path="send-now")
    def send_now(self, request, pk=None):
        notification = self.get_object()

        if notification.status == Notification.Status.SENT:
            return Response(
                {"detail": "La notificación ya fue enviada."},
                status=status.HTTP_400_BAD_REQUEST,
            )

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
                return Response(
                    {"detail": "Canal de notificación no soportado."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            notification.status = Notification.Status.SENT
            notification.sent_at = timezone.now()
            notification.error_message = ""
            notification.save()

            serializer = self.get_serializer(notification)

            return Response(serializer.data)

        except Exception as error:
            notification.status = Notification.Status.FAILED
            notification.error_message = str(error)
            notification.save()

            return Response(
                {
                    "detail": "No se pudo enviar la notificación.",
                    "error": str(error),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )