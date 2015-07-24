from django.contrib import admin
from trace_parsing.models import Trace, Event


admin.site.register(Trace)
admin.site.register(Event)
