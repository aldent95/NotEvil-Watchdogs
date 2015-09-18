from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.core.context_processors import csrf
from django.contrib import auth
from form import AppRegistrationForm

def index(request):
	context = {}
	template = loader.get_template("index.html")
	return HttpResponse(template.render(context))

def visualisation(request, p_uuid):
	context = {"p_uuid": p_uuid, "test": False}
	template = loader.get_template("visualisation.html")
	return HttpResponse(template.render(context))

def test_visualisation(request):
    context = {"test": True}
    template = loader.get_template("visualisation.html")
    return HttpResponse(template.render(context))

def signup(request):
    if request.method == 'POST':
        form = AppRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('registration/signup_complete.html')
    else:
        args={}
        args.update(csrf(request))
        args['form'] = AppRegistrationForm()
        print args
        return render(request, 'registration/signup.html', args)
    return render(request, 'registration/signup.html', {'form': form})

def login(request):
        context={}
        template = loader.get_template('registration/login.html')
        return HttpResponse(template.render(context))
        
