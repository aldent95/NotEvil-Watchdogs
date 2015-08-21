"""django_example URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from rabo_data import views

urlpatterns = [
    url(r'^incident_activities/$', views.total, name='total'),
    url(r'^incident_activities/trie$', views.trie, name='trie'),
    url(r'^incident_activities/trie2$', views.trie2, name='trie2'),
    url(r'^incident_activity/$', views.Incident_ActivityList.as_view()),
    url(r'^incident_activity/(?P<pk>\w+)/$', views.Incident_ActivityDetail.as_view()),
]
