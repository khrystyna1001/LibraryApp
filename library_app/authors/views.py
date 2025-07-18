from rest_framework import viewsets
from authors.serializer import AuthorSerializer
from django.contrib.auth.mixins import LoginRequiredMixin
from authors.models import Author
# Create your views here.

class AuthorViewSet(LoginRequiredMixin, viewsets.ModelViewSet):
    login_url = "/login/"
    redirect_field_name = "/home"
    serializer_class = AuthorSerializer
    queryset = Author.objects.all()