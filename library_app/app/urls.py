from django.contrib import admin
from django.urls import path, include
from app.swagger import schema_view
from rest_framework.authtoken.views import obtain_auth_token
from app.views import CurrentUsersView, PermissionsViewSet, TokensViewSet
from rest_framework.routers import DefaultRouter
from app.views import UserDetailsView

router = DefaultRouter()
router.register(r'users', CurrentUsersView)
router.register(r'tokens', TokensViewSet)
router.register(r'groups', PermissionsViewSet)

urlpatterns = [
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/login/', obtain_auth_token),
    path('', include(router.urls)),
    path('user/me', UserDetailsView.as_view(), name='user_details'),
]