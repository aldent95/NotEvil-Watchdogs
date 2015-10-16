from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
import json
from collections import OrderedDict, Iterable
from projects.models import Project, Log, Event
from projects.serializers import ProjectSerializer, LogSerializer, EventSerializer
import hashlib


class ProjectList(APIView):#API for getting a list of projects, or for posting a new project

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

            try:
                user = User.objects.get(username=data['username'])
            except User.DoesNotExist:
                return Response({'errors': ["invalid user."]}, status=400)

            project = Project.objects.create(name=data['name'], description=data['description'])
            project.owners.add(user)
            return Response({'notes': ['project created']}, status=200)
        else:
            return Response({'errors': serializer.errors}, status=400)


class ProjectDetail(APIView):#Gets the details of a project

    def get(self, request, p_uuid):
        try:
            project = Project.objects.get(uuid=p_uuid)#Checks if project exists, otherwise throws a 404
        except Project.DoesNotExist:
            return Response({'errors': ["Not Found"]}, status=404)
        return Response({
                    'uuid': project.uuid,
                    'name': project.name,
                    'description': project.description
                })


def merge_metadata(md, event): #Counts each meta data and works out percentages
    total = 0.0
    for val_aggr in md.values():#Counts total amount of meta data
        total += val_aggr['total']
    for key, value in event.metadata.iteritems():
        try:#Try getting the key from the global meta data
            aggr = md[key]
            try:#Try get the value
                val_aggr = aggr['values'][value]
                val_aggr['count'] += 1.0
                aggr['total'] += val_aggr['count']
                total += val_aggr['count']
            except KeyError:#If the value does not exist, add it
                aggr['values'][value] = {
                    'count': 1.0
                }
                aggr['total'] += 1.0
                total += 1.0
        except KeyError: #If the meta data from the event does not exist in the global meta data, add it and increase the count
            md[key] = {
                'values': {
                    value: {
                        'count': 1.0
                    }
                },
                'total': 1.0
            }
            total += 1.0

    for val_aggr in md.values():#Calculate percentages for each value and key over the total count
        val_aggr["percentage"] = val_aggr['total']/total
        for value in val_aggr['values'].values():
            value["percentage"] = value['count']/val_aggr['total']


class ProjectTrie(APIView):#Provides a trie to the visualisations page

    def get(self, request, p_uuid):

        try:
            project = Project.objects.get(uuid=p_uuid)#Checks if project exists, otherwise throws a 404
        except Project.DoesNotExist:
            return Response({'errors': ["Not Found"]}, status=404)

        logs = project.log_set.all()#Get all logs

        event_trie = {"event": "root", "links": {}}#build the root of the trie

        for log in logs:
            
            trie_step = event_trie#Get the root
            for event in log.event_set.all().order_by('date_stamp'):#Order all events in that log
                try:#Get the next step if that exists
                    step = trie_step["links"][event.name]
                    step['count'] += 1

                    merge_metadata(trie_step["links"][event.name]["metadata"], event)#Merge the meta data

                    trie_step = step["child"]#Get the next step

                except KeyError as e: #Otherwise create it
                    trie_step["links"][event.name] = {#Build the new step
                        "count": 1,
                        "child": {
                                "event": event.name,
                                "links": {}
                        },
                        'metadata': {}
                    }

                    merge_metadata(trie_step["links"][event.name]["metadata"], event)#Merge the meta data

                    trie_step = trie_step["links"][event.name]["child"]#Get the next step

        context = {"event_trie": event_trie}

        return Response(event_trie)


class LogList(APIView):#Provides a list of logs for a project and handles post requests for adding logs to a project

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

        try:
            project = Project.objects.get(uuid=p_uuid)
        except Project.DoesNotExist:
            return Response({'errors': ["Not Found"]}, status=404)#Checks if project exists, otherwise throws a 404

        serializer = LogSerializer(data=request.data)
        
        try:#try add the log
            if serializer.is_valid():#If meta data is valid
                data = serializer.validated_data
                try:#Try hash the ids and create the log
                    l_uuid = hashlib.md5(data['uuid'] + p_uuid).hexdigest()
                    log = Log.objects.create(uuid=l_uuid, metadata=data['metadata'], project=project)
                except KeyError:#Otherwise just add the log
                    log = Log.objects.create(metadata=data['metadata'], project=project)
            else:#Otherwise create the log without the metadata
                try:#Try hash the ids and create the log
                    l_uuid = hashlib.md5(data['uuid'] + p_uuid).hexdigest()
                    log = Log.objects.create(uuid=l_uuid, project=project)
                except KeyError:#Otherwise just add the log
                    log = Log.objects.create(project=project)
        except Exception as e:#If log already exists throw error response
            return Response({'errors': ["log already added"]}, status=400)
                


        if "events" not in request.data:#If there are not events, delete the log and return an error
            log.delete()
            return Response({'errors': ["events is a required field."]}, status=400)

        if not isinstance(request.data['events'], Iterable): #If the events is not a list delete the log and return and error
            log.delete()
            return Response({'errors': ["events needs to be a list."]}, status=400)

        for event in request.data['events']:#For each event

            serializer = EventSerializer(data=event)

            if not serializer.is_valid():#Check is the json is valid
                # MAKE THIS ERROR BETTER!!!! GAH!!!!
                log.delete()#If not delete the log and return and error
                return Response({'errors': serializer.errors}, status=400)

            data = serializer.validated_data#Otherwise add the event to the log
            Event.objects.create(
                name=data['name'], date_stamp=data['date_stamp'],
                metadata=data['metadata'], log=log)

        return Response({'notes': ['log added']}, status=200)#Respond and tell the user we added the log
