from django.contrib import admin
from .models import Client

# Register your models here.
@admin.register(Client)

class ClientAdmin(admin.ModelAdmin):

    list_display = (
        "first_name",
        "last_name",
        "phone",
        "email",
        "is_active",
        "created_at",
    )

    list_filter = (
        "is_active",
        "created_at",
    )

    search_fields = (
        "first_name",
        "last_name",
        "phone",
        "email",
    )

    ordering = (
        "first_name",
        "last_name",
    )