from rabo_data.models import Incident_Activity
from rabo_data.serializers import Incident_ActivitySerializer
from rest_framework import generics
from django.http import HttpResponse
import json


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


def trie(request):

    event_trie = {"event": "open", "links": {}}


    i_ids = Incident_Activity.objects.values_list(
        'Incident_ID', flat=True).order_by('Incident_ID')

    for i_id in i_ids:
        events = Incident_Activity.objects.filter(IncidentActivity_Number=i_id).order_by('DateStamp')

        trie_step = event_trie
        for event in events:
            try:
                step = trie_step["links"][event.IncidentActivity_Type]
                step['count'] += 1
                trie_step = step
            except KeyError:
                trie_step["links"][event.IncidentActivity_Type] = {
                    "count": 1,
                    "child": {
                            "event": event.IncidentActivity_Type
                            "links": {}
                    }
                }
                step = trie_step["links"][event.IncidentActivity_Type]
                trie_step = step

    return HttpResponse(json.dumps(event_trie))
