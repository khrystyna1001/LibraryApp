from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    groups = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name',
     )  
     
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'groups',)
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        
        return super().update(instance, validated_data)

class PermissionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('name',)
