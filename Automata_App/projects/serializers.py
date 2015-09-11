from rest_framework import serializers


class JSONSerializerField(serializers.Field):
    """ Serializer for JSONField -- required to make field writable"""
    def to_internal_value(self, data):
        return data
    def to_representation(self, value):
        return value


class ProjectSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    description = serializers.CharField()


class LogSerializer(serializers.Serializer):
    metadata = JSONSerializerField()


class EventSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    date_stamp = serializers.DateTimeField()
    metadata = JSONSerializerField()