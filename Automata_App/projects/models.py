from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from jsonfield import JSONField
from uuid import uuid4


def hex_uuid():
    return uuid4().hex


class Project(models.Model):
    """docstring for Project"""
    uuid = models.CharField(max_length=100, default=hex_uuid, primary_key=True)
    name = models.CharField(max_length=200)
    description = models.TextField()
    # owners = models.ManyToManyField(User)

    created_on = models.DateTimeField(default=timezone.now)


class Log(models.Model):
    """docstring for Log"""
    uuid = models.CharField(max_length=100, default=hex_uuid, primary_key=True)
    metadata = JSONField(default={})
    project = models.ForeignKey(Project, db_index=True)

    created_on = models.DateTimeField(default=timezone.now)


class Event(models.Model):
    """docstring for Event"""
    uuid = models.CharField(max_length=100, default=hex_uuid, primary_key=True)
    name = models.CharField(max_length=200)
    date_stamp = models.DateTimeField()
    metadata = JSONField(default={})
    log = models.ForeignKey(Log, db_index=True)

    created_on = models.DateTimeField(default=timezone.now)
