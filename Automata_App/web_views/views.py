from django.http import HttpResponse
from forms import AppRegistrationForm


def index(request):
    return HttpResponse("Hello, world. You're at the web_views index.")
def signup(request):
    if request.method = 'POST':
        form = AppRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('registration/signup_complete.html')
        args={}
        args.update(csrf(request))
        args.['form'] = AppRegistrationForm()
        print args
        return render(request, 'registration/signup.html', args)
