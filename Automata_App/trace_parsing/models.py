from django.db import models
from uuid import uuid4


def hex_uuid():
    return uuid4().hex


from jsonfield import JSONField

class Trace(models.Model):
	"""docstring for Trace"""
	uuid = models.CharField(max_length=100, default=hex_uuid,
                            primary_key=True)
	metadata = JSONField(default={})


class Event(models.Model):
	"""docstring for Event"""
	uuid = models.CharField(max_length=100, default=hex_uuid,
                            primary_key=True)
	metadata = JSONField(default={})
	trace = models.ForeignKey(Trace)