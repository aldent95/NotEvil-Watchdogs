from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.core.context_processors import csrf
from django.contrib import auth
from django.contrib.auth.decorators import login_required
from form import AppRegistrationForm
from django.views.decorators.csrf import requires_csrf_token


def index(request):
    context = {}
    template = loader.get_template("index.html")
    return HttpResponse(template.render(context))

@requires_csrf_token
def visualisation(request, p_uuid):
    project = Project.objects.get(uuid=p_uuid)
    context = {
        "p_uuid": p_uuid,
        'p_name': project.name,
        'p_description': project.description,
        "test": False
    }
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
            return HttpResponseRedirect('/login')
    else:
        args={}
        args.update(csrf(request))
        args['form'] = AppRegistrationForm()
        print args
        return render(request, 'registration/signup.html', args)
    return render(request, 'registration/signup.html', {'form': form})

@login_required(login_url='/login/')
@requires_csrf_token
def projectshome(request):
        context={}
        user = request.user
        context['project_list'] = user.project_set.all()
        context['username'] = str(user)
        return render(request, 'projects/home.html', context)
        
def logout(request):
        context={}
        template = loader.get_template('registration/logout.html')
        return HttpResponse(template.render(context))
        
