from django.http import HttpResponse
from django.template import loader

def index(request):
	context = {}
	template = loader.get_template("index.html")
	return HttpResponse(template.render(context))

def visualisation1(request):
	context = {}
	template = loader.get_template("visualisation1.html")
	return HttpResponse(template.render(context))
