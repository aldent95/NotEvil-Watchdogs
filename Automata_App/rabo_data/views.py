from rabo_data.models import Incident_Activity
from rabo_data.serializers import Incident_ActivitySerializer
from rest_framework import generics
from django.http import HttpResponse


class Incident_ActivityList(generics.ListCreateAPIView):
    queryset = Incident_Activity.objects.all()
    serializer_class = Incident_ActivitySerializer


class Incident_ActivityDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Incident_Activity.objects.all()
    serializer_class = Incident_ActivitySerializer


def total(request):
    queryset = Incident_Activity.objects.all()
    data = {"total actitivities": len(queryset)}
    return HttpResponse(str(data))
