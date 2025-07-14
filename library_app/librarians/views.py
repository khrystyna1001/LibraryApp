from rest_framework import viewsets
from librarians.serializer import LibrarianSerializer
from librarians.models import Librarian
# Create your views here.

class LibrarianViewSet(viewsets.ModelViewSet):
    serializer_class = LibrarianSerializer
    queryset = Librarian.objects.all()