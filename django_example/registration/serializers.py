from rest_framework import serializers


class NewUserSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    password = serializers.CharField(max_length=200)