from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import IntegrityError

from trace_parsing import serializers


class TraceListView(APIView):
    """
    """
    
    def get(self, request):
        return Response({'logs': "stuff"}, status=200)

    def post(self, request):
        return Response({'logs': "stuff"}, status=200)


