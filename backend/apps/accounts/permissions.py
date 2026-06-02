from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "ADMIN"


class IsReceptionistOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role in [
            "ADMIN",
            "RECEPCIONISTA",
        ]


class IsEsthetician(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "ESTETICISTA"


class IsReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS