from rest_framework import serializers
from rest_framework.authtoken.models import Token
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

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        groups_data = validated_data.pop('groups', None)
        user = User.objects.create(**validated_data)

        if password:
            user.set_password(password)

        if groups_data:
            user.groups.set(groups_data)
            
        user.save()
        return user

    def update(self, instance, validated_data):
        groups_data = validated_data.pop('groups', None)
        password = validated_data.pop('password', None)

        if password:
            instance.set_password(password)

        if groups_data is not None:
            instance.groups.set(groups_data)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ('key', 'user', 'created',)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

class PermissionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('name',)
