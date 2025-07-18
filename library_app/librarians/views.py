from rest_framework import viewsets
from librarians.serializer import LibrarianSerializer
from django.contrib.auth.mixins import LoginRequiredMixin
from librarians.models import Librarian
# Create your views here.

class LibrarianViewSet(LoginRequiredMixin, viewsets.ModelViewSet):
    login_url = "/login/"
    redirect_field_name = "/home"
    serializer_class = LibrarianSerializer
    queryset = Librarian.objects.all()