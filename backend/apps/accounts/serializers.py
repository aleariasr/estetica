from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "full_name",
            "email",
            "telefono",
            "role",
            "is_active",
        )

    def get_full_name(self, obj):
        name = obj.get_full_name()
        return name if name else obj.username