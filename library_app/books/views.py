from rest_framework import viewsets
from books.serializer import BookSerializer
from django.contrib.auth.mixins import LoginRequiredMixin
from books.models import Book
# Create your views here.

class BookViewSet(LoginRequiredMixin, viewsets.ModelViewSet):
    login_url = "/login/"
    redirect_field_name = "/home"
    serializer_class = BookSerializer
    queryset = Book.objects.all()