from rest_framework import viewsets, filters, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework.decorators import action
from books.serializer import BookSerializer
from books.models import Book
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
# Create your views here.

User = get_user_model()

class BookViewSet(viewsets.ModelViewSet):
    serializer_class = BookSerializer
    queryset = Book.objects.all()
    authentication_classes = (TokenAuthentication,)
    filter_backends = (filters.SearchFilter,)
    search_fields = ["title", "description"]

    @action(detail=True, methods=['post'], url_path='issue')
    def issue_book(self, request, pk=None):
        book = self.get_object()
        user_id = request.data.get('user_id')

        if not request.user.groups.filter(name='Librarian').exists() and not request.user.is_superuser:
            raise PermissionDenied("You must be a Librarian or Admin to issue books.")

        if not user_id:
            return Response({'detail': 'User ID is required to issue the book.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            visitor = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({'detail': 'Visitor not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not book.is_available:
            return Response({'detail': f'Book "{book.title}" is currently unavailable or already borrowed.'}, status=status.HTTP_400_BAD_REQUEST)
        
        book.borrower = visitor
        book.is_available = False
        book.save()
        
        return Response(BookSerializer(book).data, status=status.HTTP_200_OK)