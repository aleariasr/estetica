from rest_framework import serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    appointment_client = serializers.CharField(
        source="appointment.client.__str__",
        read_only=True
    )
    appointment_service = serializers.CharField(
        source="appointment.service.name",
        read_only=True
    )
    appointment_start_time = serializers.DateTimeField(
        source="appointment.start_time",
        read_only=True
    )

    class Meta:
        model = Notification
        fields = "__all__"