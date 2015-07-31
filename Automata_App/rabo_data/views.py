from rabo_data.models import Interaction_Activity
from rabo_data.serializers import Interaction_ActivitySerializer
from rest_framework import generics


class Interaction_ActivityList(generics.ListCreateAPIView):
    queryset = Interaction_Activity.objects.all()
    serializer_class = Interaction_ActivitySerializer


class Interaction_ActivityDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Interaction_Activity.objects.all()
    serializer_class = Interaction_ActivitySerializer