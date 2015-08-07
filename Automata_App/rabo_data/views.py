from rabo_data.models import Interaction_Activity
from rabo_data.serializers import Interaction_ActivitySerializer
from rest_framework import generics
from django.http import HttpResponse


class Incident_ActivityList(generics.ListCreateAPIView):
    queryset = Interaction_Activity.objects.all()
    serializer_class = Interaction_ActivitySerializer


class Incident_ActivityDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Interaction_Activity.objects.all()
    serializer_class = Interaction_ActivitySerializer


def total(request):
    queryset = Interaction_Activity.objects.all()
    data = {"total actitivities": len(queryset)}
    return HttpResponse(str(data))
