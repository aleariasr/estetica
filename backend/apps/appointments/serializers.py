from rest_framework import serializers

from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source="client.__str__", read_only=True)
    service_name = serializers.CharField(source="service.name", read_only=True)
    esthetician_name = serializers.CharField(
        source="esthetician.get_full_name",
        read_only=True
    )
    service_price = serializers.DecimalField(
        source="service.price",
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    class Meta:
        model = Appointment
        fields = "__all__"
        read_only_fields = ("end_time", "created_at", "updated_at")

    def validate(self, attrs):
        instance = self.instance or Appointment()

        for field, value in attrs.items():
            setattr(instance, field, value)

        if not instance.status:
            instance.status = Appointment.Status.PENDING

        instance.end_time = instance.calculate_end_time()

        try:
            instance.clean()
        except Exception as error:
            raise serializers.ValidationError({
                "detail": str(error)
            })

        return attrs