from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

class AppRegistrationForm(UserCreationForm):#User signup form
    email = forms.EmailField(required=True)#Set up all the fields 
    first_name = forms.CharField(required=True)
    last_name = forms.CharField(required=True)
    username = forms.CharField(required=True)
    company_name = forms.CharField(required=False)

    class Meta:#Meta user
        model = User
        fields = ('username', 'email', 'password1', 'password2')

    def save(self,commit = True):  #Saving the user 
        user = super(AppRegistrationForm, self).save(commit = False)#Save the actual django user object and get it back
        user.email = self.cleaned_data['email']#Then add all the extra fields
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.username = self.cleaned_data['username']
        user.company_name = self.cleaned_data['company_name']
        user.password1 = self.cleaned_data['password1']
        user.password2 = self.cleaned_data['password2']


        if commit:
            user.save()

        return user
