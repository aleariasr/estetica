from datetime import datetime, time, timedelta

from django.utils import timezone

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.accounts.models import User
from apps.services.models import Service

from .models import Appointment
from .serializers import AppointmentSerializer


class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Appointment.objects.select_related(
            "client",
            "esthetician",
            "service"
        )

        if user.role in ["ADMIN", "RECEPCIONISTA"]:
            return queryset.all()

        if user.role == "ESTETICISTA":
            return queryset.filter(esthetician=user)

        return queryset.none()

    @action(
        detail=False,
        methods=["get"],
        url_path="available-slots"
    )
    def available_slots(self, request):
        esthetician_id = request.query_params.get("esthetician")
        service_id = request.query_params.get("service")
        date_value = request.query_params.get("date")

        if not esthetician_id or not service_id or not date_value:
            return Response(
                {
                    "detail": (
                        "Debe indicar esthetician, service y date."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            esthetician = User.objects.get(
                id=esthetician_id,
                role=User.Roles.ESTETICISTA,
                is_active=True,
            )

            service = Service.objects.get(
                id=service_id,
                is_active=True,
            )

            selected_date = datetime.strptime(
                date_value,
                "%Y-%m-%d"
            ).date()

        except User.DoesNotExist:
            return Response(
                {"detail": "La esteticista no existe o no está activa."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Service.DoesNotExist:
            return Response(
                {"detail": "El servicio no existe o no está activo."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except ValueError:
            return Response(
                {"detail": "La fecha debe tener formato YYYY-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        work_start = timezone.make_aware(
            datetime.combine(selected_date, time(hour=8, minute=0))
        )

        work_end = timezone.make_aware(
            datetime.combine(selected_date, time(hour=18, minute=0))
        )

        slot_interval = timedelta(minutes=30)
        service_duration = timedelta(
            minutes=service.duration_minutes
        )

        active_statuses = [
            Appointment.Status.PENDING,
            Appointment.Status.CONFIRMED,
        ]

        appointments = Appointment.objects.filter(
            esthetician=esthetician,
            status__in=active_statuses,
            start_time__date=selected_date,
        )

        available_slots = []
        current_start = work_start

        while current_start + service_duration <= work_end:
            current_end = current_start + service_duration

            overlaps = appointments.filter(
                start_time__lt=current_end,
                end_time__gt=current_start,
            ).exists()

            is_past_slot = current_start < timezone.now()

            if not overlaps and not is_past_slot:
                available_slots.append(
                    timezone.localtime(current_start).strftime("%H:%M")
                )

            current_start += slot_interval

        return Response(available_slots)