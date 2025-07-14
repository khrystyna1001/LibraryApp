from rest_framework import serializers
from visitors.models import Visitor

class VisitorSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField()
    class Meta:
        model = Visitor
        fields = "__all__"