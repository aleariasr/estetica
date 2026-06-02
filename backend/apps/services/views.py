from rest_framework import viewsets

from .models import Service
from .serializers import ServiceSerializer

from rest_framework.permissions import IsAuthenticated
from apps.accounts.permissions import (
    IsAdmin,
    IsReceptionistOrAdmin,
    IsReadOnly,
)


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method in ["GET", "HEAD", "OPTIONS"]:
            permission_classes = [IsAuthenticated]

        else:
            permission_classes = [
                IsAuthenticated,
                IsReceptionistOrAdmin,
            ]

        return [permission() for permission in permission_classes]