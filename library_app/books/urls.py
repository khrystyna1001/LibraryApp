from django.urls import path, include
from books.views import BookViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', BookViewSet)

urlpatterns = [
    path("", include(router.urls))
]
