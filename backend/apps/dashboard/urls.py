

from django.urls import path

from .views import DashboardStatsView, TodayAppointmentsView

urlpatterns = [
    path("dashboard/today/", TodayAppointmentsView.as_view(), name="dashboard-today"),
    path("dashboard/stats/", DashboardStatsView.as_view(), name="dashboard-stats"),
]