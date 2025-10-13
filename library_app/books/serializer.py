from rest_framework import serializers
from books.models import Book
from authors.models import Author

class BookSerializer(serializers.ModelSerializer):
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

    def to_representation(self, instance):
        from authors.serializer import AuthorSerializer
        representation = super().to_representation(instance)
        authors = instance.author.all()
        representation['author'] = AuthorSerializer(authors, many=True).data
        
        return representation

class AuthorBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'published_date']