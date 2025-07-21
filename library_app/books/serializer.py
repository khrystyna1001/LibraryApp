from rest_framework import serializers
from books.models import Book

class BookSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    class Meta:
        model = Book
        fields = [
            'id',
            'title',
            'description',
            'published_date',
            'is_available',
            'author'
        ]

    def get_author(self, obj):
        from authors.serializer import AuthorSerializer
        return AuthorSerializer(obj.author.all(), many=True, read_only=True).data

class AuthorBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'published_date']