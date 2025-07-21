from rest_framework import serializers
from authors.models import Author
from books.serializer import AuthorBookSerializer

class AuthorSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField()
    books_written = AuthorBookSerializer(many=True, read_only=True)

    class Meta:
        model = Author
        fields = [
            'id',
            'first_name',
            'last_name',
            'role',
            'full_name',
            'books_written'
        ]