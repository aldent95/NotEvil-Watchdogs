from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db import IntegrityError

from registration import serializers


class UserListView(APIView):
    """
    """
    
    def post(self, request):
        user_serializer = serializers.NewUserSerializer(data=request.data)

        if user_serializer.is_valid():
            try:
                username = user_serializer.validated_data['username']
                email = user_serializer.validated_data['email']
                password = user_serializer.validated_data['password']
                user = User.objects.create_user(username, email, password)
                user.save()
                return Response({'username': user.username, 'email': user.email}, status=201)
            except IntegrityError:
                return Response({'errors': ["Username already taken."]})
        else:
            return Response(user_serializer.errors, status=400)

    def get(self, request):
        users = User.objects.all()

        user_list = []

        for user in users:
            user_list.append({'username': user.username, 'email': user.email})

        return Response({'users': user_list}, status=200)


class LoginView(APIView):

    def post(self, request):
        pass