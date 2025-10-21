from rest_framework import viewsets, filters
from books.serializer import BookSerializer
from books.models import Book
from rest_framework.authentication import TokenAuthentication
# Create your views here.

class BookViewSet(viewsets.ModelViewSet):
    serializer_class = BookSerializer
    queryset = Book.objects.all()
    authentication_classes = (TokenAuthentication,)
    filter_backends = (filters.SearchFilter,)
    search_fields = ["title", "description"]