from rabo_data.models import Incident_Activity
from rabo_data.serializers import Incident_ActivitySerializer
from rest_framework import generics
from django.http import HttpResponse
import json
from django.template import RequestContext, loader


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
        'Incident_ID', flat=True).distinct().order_by('Incident_ID')

    print len(i_ids)

    for i_id in i_ids:
        print i_id
        if i_id == "IM0000049":
            break

        events = Incident_Activity.objects.filter(Incident_ID=i_id).order_by('DateStamp')

        trie_step = event_trie
        for event in events:
            try:
                step = trie_step["links"][event.IncidentActivity_Type]
                step['count'] += 1
                trie_step = step["child"]
            except KeyError as e: 
                trie_step["links"][event.IncidentActivity_Type] = {
                    "count": 1,
                    "child": {
                            "event": event.IncidentActivity_Type,
                            "links": {}
                    }
                }
                step = trie_step["links"][event.IncidentActivity_Type]["child"]
                trie_step = step

    context = {"event_trie"; event_trie}

    template = loader.get_template('index.html')

    return HttpResponse(template.render(context))
