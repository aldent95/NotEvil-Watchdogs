from django.contrib import admin

from .models import Project, Log, Event

admin.site.register(Project)
admin.site.register(Log)
admin.site.register(Event)