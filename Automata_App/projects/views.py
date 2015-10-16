from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
import json
from collections import OrderedDict, Iterable
from projects.models import Project, Log, Event
from projects.serializers import ProjectSerializer, LogSerializer, EventSerializer
import hashlib
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse


@csrf_exempt
def login_user(request):
    user = authenticate(username=request.POST['username'],  password=request.POST['password'])
    login(request, user)
    return HttpResponse("Logged In")


class ProjectList(APIView):

    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        projects = user.project_set.all()

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

            try:
                user = User.objects.get(username=data['username'])
            except User.DoesNotExist:
                return Response({'errors': ["invalid user."]}, status=400)

            project = Project.objects.create(name=data['name'], description=data['description'])
            project.owners.add(user)
            return Response({'notes': ['project created']}, status=200)
        else:
            return Response({'errors': serializer.errors}, status=400)


class ProjectDetail(APIView):

    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)

    def get(self, request, p_uuid):
        try:
            project = user.project_set.get(uuid=p_uuid)
        except Project.DoesNotExist:
            return Response({'errors': ["Not Found"]}, status=404)
        return Response({
                    'uuid': project.uuid,
                    'name': project.name,
                    'description': project.description
                })


def merge_metadata(md, event):
    total = 0.0
    for val_aggr in md.values():
        total += val_aggr['total']
    for key, value in event.metadata.iteritems():
        try:
            aggr = md[key]
            try:
                val_aggr = aggr['values'][value]
                val_aggr['count'] += 1.0
                aggr['total'] += val_aggr['count']
                total += val_aggr['count']
            except KeyError:
                aggr['values'][value] = {
                    'count': 1.0
                }
                aggr['total'] += 1.0
                total += 1.0
        except KeyError:
            md[key] = {
                'values': {
                    value: {
                        'count': 1.0
                    }
                },
                'total': 1.0
            }
            total += 1.0

    for val_aggr in md.values():
        val_aggr["percentage"] = val_aggr['total']/total
        for value in val_aggr['values'].values():
            value["percentage"] = value['count']/val_aggr['total']


class ProjectTrie(APIView):

    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)

    def get(self, request, p_uuid):

        try:
            project = user.project_set.get(uuid=p_uuid)
        except Project.DoesNotExist:
            return Response({'errors': ["Not Found"]}, status=404)

        logs = project.log_set.all()

        event_trie = {"event": "root", "links": {}}

        for log in logs:
            
            trie_step = event_trie
            for event in log.event_set.all().order_by('date_stamp'):
                try:
                    step = trie_step["links"][event.name]
                    step['count'] += 1

                    merge_metadata(trie_step["links"][event.name]["metadata"], event)

                    trie_step = step["child"]

                except KeyError as e: 
                    trie_step["links"][event.name] = {
                        "count": 1,
                        "child": {
                                "event": event.name,
                                "links": {}
                        },
                        'metadata': {}
                    }

                    merge_metadata(trie_step["links"][event.name]["metadata"], event)

                    trie_step = trie_step["links"][event.name]["child"]

        context = {"event_trie": event_trie}

        return Response(event_trie)


class LogList(APIView):

    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)

    def get(self, request, p_uuid):
        try:
            project = user.project_set.get(uuid=p_uuid)
        except Project.DoesNotExist:
            return Response({'errors': ["Not Found"]}, status=404)
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

        try:
            project = user.project_set.get(uuid=p_uuid)
        except Project.DoesNotExist:
            return Response({'errors': ["Not Found"]}, status=404)

        serializer = LogSerializer(data=request.data)
        
        try:
            if serializer.is_valid():
                data = serializer.validated_data
                try:
                    l_uuid = hashlib.md5(data['uuid'] + p_uuid).hexdigest()
                    log = Log.objects.create(uuid=l_uuid, metadata=data['metadata'], project=project)
                except KeyError:
                    log = Log.objects.create(metadata=data['metadata'], project=project)
            else:
                try:
                    l_uuid = hashlib.md5(data['uuid'] + p_uuid).hexdigest()
                    log = Log.objects.create(uuid=l_uuid, project=project)
                except KeyError:
                    log = Log.objects.create(project=project)
        except Exception as e:
            return Response({'errors': ["log already added"]}, status=400)
                


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
