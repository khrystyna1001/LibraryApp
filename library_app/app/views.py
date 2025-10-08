from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User, Group
from app.serializer import UserSerializer, PermissionsSerializer, TokenSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token


# Create your views here.

class PermissionsViewSet(viewsets.ModelViewSet):
    serializer_class = PermissionsSerializer
    queryset = Group.objects.all()
    authentication_classes = (TokenAuthentication,)

class TokensViewSet(viewsets.ModelViewSet):
    serializer_class = TokenSerializer
    queryset = Token.objects.all()
    authentication_classes = (TokenAuthentication,)

class CurrentUsersView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    authentication_classes = (TokenAuthentication,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class UserDetailsView(APIView):
    authentication_classes = (TokenAuthentication,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

def login(request):
    return render(request, 'login.html')

@login_required
def home(request):
    return render(request, 'home.html')