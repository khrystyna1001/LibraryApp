from rest_framework import viewsets, filters
from authors.serializer import AuthorSerializer
from rest_framework.authentication import TokenAuthentication
from authors.models import Author
# Create your views here.

class AuthorViewSet(viewsets.ModelViewSet):
    serializer_class = AuthorSerializer
    queryset = Author.objects.all()
    authentication_classes = (TokenAuthentication,)
    filter_backends = (filters.SearchFilter,)
    search_fields = ["first_name", "last_name"]