from rest_framework import viewsets
from books.serializer import BookSerializer
from books.models import Book
# Create your views here.

class BookViewSet(viewsets.ModelViewSet):
    serializer_class = BookSerializer
    queryset = Book.objects.all()