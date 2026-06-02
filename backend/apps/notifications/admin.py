from django.contrib import admin
from .models import Notification

# Register your models here.
@admin.register(Notification)

class NotificationAdmin(admin.ModelAdmin):

    list_display = (
        "appointment",
        "channel",
        "recipient",
        "status",
        "scheduled_for",
        "sent_at",
    )

    list_filter = (
        "channel",
        "status",
        "scheduled_for",
    )

    search_fields = (
        "recipient",
        "message",
    )

    ordering = ("-scheduled_for",)