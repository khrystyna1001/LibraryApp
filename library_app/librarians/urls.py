from django.urls import path, include
from librarians.views import LibrarianViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', LibrarianViewSet)

urlpatterns = [
    path("", include(router.urls))
]