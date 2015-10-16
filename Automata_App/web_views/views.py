from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.core.context_processors import csrf
from django.contrib import auth
from django.contrib.auth.decorators import login_required
from form import AppRegistrationForm
from django.views.decorators.csrf import requires_csrf_token
from projects.models import Project
from django.contrib.auth import logout as dj_logout


def index(request):#Basic Index View
    context = {}
    template = loader.get_template("index.html")
    return HttpResponse(template.render(context))#Return the template as a rendered html webpage

@login_required(login_url='/login/')
@requires_csrf_token#Makes sure this page gets the token needed to post to the API
def visualisation(request, p_uuid):#Visualisation view
    try:
        project = Project.objects.get(uuid=p_uuid)#Try catch for getting a project, throws 404 if there is no project.
    except Project.DoesNotExist:
        return render(request, '404.html', {'errorMessage':'The project with the id '+p_uuid+' does not exist'})
    context = {#Context variables to pass to the template
        "p_uuid": p_uuid,
        'p_name': project.name,
        'p_description': project.description,
        "test": False
    }
    template = loader.get_template("visualisation.html")
    return HttpResponse(template.render(context))#Return the template as a rendered html webpage

def test_visualisation(request):#Test visualisation
    context = {"test": True}#Context variables to pass to the template
    template = loader.get_template("visualisation.html")
    return HttpResponse(template.render(context))#Return the template as a rendered html webpage

def signup(request):#Signup page
    if request.method == 'POST':#If we a receiving a a post request
        form = AppRegistrationForm(request.POST)#Get the form that the user should have filled out
        if form.is_valid():#and the form is valid
            form.save()#If it is valid save it
            return HttpResponseRedirect('/login')#And redirect to login page
    else:#Otherwise
        args={}
        args.update(csrf(request))#Get the token for posting
        args['form'] = AppRegistrationForm()#Get the form
        return render(request, 'registration/signup.html', args)#Return the template as a rendered html webpage
    return render(request, 'registration/signup.html', {'form': form})#Return the template as a rendered html webpage

@login_required(login_url='/login/')
@requires_csrf_token#Makes sure this page gets the token needed to post to the API
def projectshome(request):#Home page
        context={}#Context variables to pass to the template
        user = request.user
        context['project_list'] = user.project_set.all()
        context['username'] = str(user)
        return render(request, 'projects/home.html', context)#Return the template as a rendered html webpage
        
def logout(request):
        dj_logout(request)
        context={}#Context variables to pass to the template
        template = loader.get_template('registration/logout.html')
        return HttpResponse(template.render(context))#Return the template as a rendered html webpage
        
