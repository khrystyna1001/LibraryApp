from django.urls import path, include
from authors.views import AuthorViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', AuthorViewSet)

urlpatterns = [
    path("", include(router.urls))
]
