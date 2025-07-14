from django.urls import path, include
from visitors.views import VisitorViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', VisitorViewSet)

urlpatterns = [
    path("", include(router.urls))
]
