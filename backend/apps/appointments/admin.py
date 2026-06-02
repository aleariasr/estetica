from django.contrib import admin
from .models import Appointment

# Register your models here.
@admin.register(Appointment)

class AppointmentAdmin(admin.ModelAdmin):

    list_display = (
        "client",
        "service",
        "esthetician",
        "start_time",
        "end_time",
        "status",
    )

    list_filter = (
        "status",
        "start_time",
        "esthetician",
    )

    search_fields = (
        "client__first_name",
        "client__last_name",
        "service__name",
    )

    ordering = ("-start_time",)