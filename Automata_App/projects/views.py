from rest_framework.views import APIView
from rest_framework.response import Response
import json
from collections import OrderedDict, Iterable
from projects.models import Project, Log, Event
from projects.serializers import ProjectSerializer, LogSerializer, EventSerializer


class ProjectList(APIView):

    def get(self, request):
        # TODO(adriant): once login works
        # GET ONLY FOR MY USER
        projects = Project.objects.all()

        json_data = {"projects": []}

        for project in projects:
            json_data["projects"].append(
                {
                    'uuid': project.uuid,
                    'name': project.name,
                    'description': project.description
                }
            )


        return Response(json_data)

    def post(self, request):

        serializer = ProjectSerializer(data=request.data)
           
        if serializer.is_valid():
            data = serializer.validated_data
            project = Project.objects.create(name=data['name'], description=data['description'])
            return Response({'notes': ['project created']}, status=200)
        else:
            return Response({'errors': serializer.errors}, status=400)


class ProjectDetail(APIView):

    def get(self, request, p_uuid):

        project = Project.objects.get(uuid=p_uuid)
        return Response({
                    'uuid': project.uuid,
                    'name': project.name,
                    'description': project.description
                })


class ProjectTrie(APIView):

    def get(self, request, p_uuid):

        project = Project.objects.get(uuid=p_uuid)

        logs = project.log_set.all()

        event_trie = {"event": "root", "links": {}}

        for log in logs:
            
            trie_step = event_trie
            for event in log.event_set.all():
                try:
                    step = trie_step["links"][event.name]
                    step['count'] += 1
                    trie_step = step["child"]
                except KeyError as e: 
                    trie_step["links"][event.name] = {
                        "count": 1,
                        "child": {
                                "event": event.name,
                                "links": {}
                        }
                    }
                    step = trie_step["links"][event.name]["child"]
                    trie_step = step

        context = {"event_trie": event_trie}

        return Response(event_trie)


class LogList(APIView):

    def get(self, request, p_uuid):
        # TODO(adriant): once login works
        # GET ONLY FOR MY USER
        logs = Log.objects.all().filter(project__uuid=p_uuid)

        json_data = {"logs": []}

        for log in logs:
            json_data["logs"].append(
                {
                    'uuid': log.uuid,
                    'project': log.project.uuid,
                    'metadata': log.metadata
                }
            )


        return Response(json_data)

    def post(self, request, p_uuid):

        project = Project.objects.get(uuid=p_uuid)

        serializer = LogSerializer(data=request.data)
           
        if serializer.is_valid():
            data = serializer.validated_data
            log = Log.objects.create(metadata=data['metadata'], project=project)
        else:
            log = Log.objects.create(project=project)

        if "events" not in request.data:
            log.delete()
            return Response({'errors': ["events is a required field."]}, status=400)

        if not isinstance(request.data['events'], Iterable):
            log.delete()
            return Response({'errors': ["events needs to be a list."]}, status=400)

        for event in request.data['events']:

            serializer = EventSerializer(data=event)

            if not serializer.is_valid():
                # MAKE THIS ERROR BETTER!!!! GAH!!!!
                log.delete()
                return Response({'errors': serializer.errors}, status=400)

            data = serializer.validated_data
            Event.objects.create(
                name=data['name'], date_stamp=data['date_stamp'],
                metadata=data['metadata'], log=log)

        return Response({'notes': ['log added']}, status=200)
