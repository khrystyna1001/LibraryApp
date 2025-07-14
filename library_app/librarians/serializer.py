from rest_framework import serializers
from librarians.models import Librarian

class LibrarianSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField()
    class Meta:
        model = Librarian
        fields = "__all__"