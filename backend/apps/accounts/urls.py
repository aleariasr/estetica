from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import EstheticianViewSet

router = DefaultRouter()
router.register(
    r'estheticians',
    EstheticianViewSet,
    basename='esthetician'
)

urlpatterns = [
    path('', include(router.urls)),
]