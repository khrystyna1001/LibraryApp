from rest_framework import serializers
from authors.models import Author

class AuthorSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField()
    class Meta:
        model = Author
        fields = "__all__"