from django.contrib import admin
from django.urls import path, include
from app.swagger import schema_view
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('auth/', obtain_auth_token),
]