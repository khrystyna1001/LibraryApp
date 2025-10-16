from rest_framework import serializers
from authors.models import Author
from books.serializer import AuthorBookSerializer

class AuthorSerializer(serializers.ModelSerializer):
    from books.models import Book
    full_name = serializers.CharField(read_only=True)
    serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.all(),
        many=True,
        required=False,
    )

    class Meta:
        model = Author
        fields = [
            'id',
            'first_name',
            'last_name',
            'full_name',
            'role',
            'books_written'
        ]

    def update(self, instance, validated_data):
        if 'books_written' in validated_data:
            books_data = validated_data.pop('books_written')
            instance.books_written.set(books_data)
        return super().update(instance, validated_data)