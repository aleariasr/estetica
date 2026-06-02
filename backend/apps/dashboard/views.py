from django.db.models import Count, Sum
from django.utils import timezone

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.appointments.models import Appointment


class TodayAppointmentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = timezone.localdate()

        appointments = Appointment.objects.select_related(
            "client",
            "service",
            "esthetician",
        ).filter(
            start_time__date=today
        )

        if user.role == "ESTETICISTA":
            appointments = appointments.filter(
                esthetician=user
            )

        data = []

        for appointment in appointments:
            data.append({
                "id": appointment.id,
                "client": f"{appointment.client.first_name} {appointment.client.last_name}",
                "service": appointment.service.name,
                "esthetician": appointment.esthetician.get_full_name(),
                "start_time": timezone.localtime(appointment.start_time),
                "end_time": timezone.localtime(appointment.end_time),
                "status": appointment.status,
            })

        return Response(data)


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = timezone.localdate()

        appointments = Appointment.objects.filter(
            start_time__date=today
        )

        if user.role == "ESTETICISTA":
            appointments = appointments.filter(
                esthetician=user
            )

        total_appointments = appointments.count()

        completed_appointments = appointments.filter(
            status=Appointment.Status.COMPLETED
        ).count()

        pending_appointments = appointments.filter(
            status=Appointment.Status.PENDING
        ).count()

        confirmed_appointments = appointments.filter(
            status=Appointment.Status.CONFIRMED
        ).count()

        canceled_appointments = appointments.filter(
            status=Appointment.Status.CANCELED
        ).count()

        estimated_income = appointments.filter(
            status__in=[
                Appointment.Status.CONFIRMED,
                Appointment.Status.COMPLETED,
            ]
        ).aggregate(
            total=Sum("service__price")
        )["total"] or 0

        appointments_by_status = appointments.values(
            "status"
        ).annotate(
            total=Count("id")
        )

        return Response({
            "date": today,
            "total_appointments": total_appointments,
            "completed_appointments": completed_appointments,
            "pending_appointments": pending_appointments,
            "confirmed_appointments": confirmed_appointments,
            "canceled_appointments": canceled_appointments,
            "estimated_income": estimated_income,
            "appointments_by_status": appointments_by_status,
        })