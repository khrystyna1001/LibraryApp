from rest_framework import viewsets
from authors.serializer import AuthorSerializer
from authors.models import Author
# Create your views here.

class AuthorViewSet(viewsets.ModelViewSet):
    serializer_class = AuthorSerializer
    queryset = Author.objects.all()