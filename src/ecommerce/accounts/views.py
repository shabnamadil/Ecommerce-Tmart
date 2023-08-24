from typing import Any, Dict
from django.forms.models import BaseModelForm
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .forms import RegistrationForm, Authentication
from django.urls import reverse_lazy
from django.views.generic import CreateView
from django.contrib.sites.shortcuts import get_current_site
from django.shortcuts import render, redirect
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.template.loader import render_to_string
from accounts.tokens import account_activation_token
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.views import LogoutView

User = get_user_model()


def login_view(request):
    login_form = Authentication()
    registration_form = RegistrationForm()
    if request.method == 'POST':
        login_form = Authentication(request, request.POST)
        if login_form.is_valid():
            username = login_form.cleaned_data.get('username')
            password = login_form.cleaned_data.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                if user.is_active == True:
                    login(request, user)
                return redirect(reverse_lazy('home'))
            else:
                login_form = Authentication()
                
    context = {
        'form': login_form,
        'registration_form' : registration_form
    }
    return render(request, 'login-register.html', context)


# class LoginRegisterView(TemplateView):
    template_name = 'login-register.html'
    login_form_class = Authentication
    registration_form_class = RegistrationForm

    def post(self, request, *args, **kwargs):
        login_form = self.login_form_class()
        registration_form = self.registration_form_class()
        print(2)
        if 'login_form_submit' in request.POST:
            login_form = self.login_form_class(request.POST)
            print(3)
            if login_form.is_valid():
                print(4)
                username = login_form.cleaned_data.get('username')
                password = login_form.cleaned_data.get('password')
                user = authenticate(request, username=username, password=password)
                print(username, password)
                if user is not None:
                    if user.is_active == True:
                        login(request, user)
                        return reverse_lazy('home')  
        elif 'registration_form_submit' in request.POST:
            registration_form = self.registration_form_class(request.POST)
            if registration_form.is_valid():
                registration_form.save()
                return reverse_lazy('login-register') 

        return render(request, self.template_name, {
            'login_form': login_form,
            'registration_form': registration_form,
        })

    def get(self, request, *args, **kwargs):
        login_form = self.login_form_class()
        registration_form = self.registration_form_class()

        return render(request, self.template_name, {
            'login_form': login_form,
            'registration_form': registration_form,
        })


class LoginView(CreateView):
    template_name = 'login-register.html'
    print(2)

    def get(self, request):
        login_form = Authentication()
        registration_form = RegistrationForm()
        return render(request, self.template_name, {
            'login_form': login_form,
            'registration_form': registration_form
        })

    def post(self, request,  *args, **kwargs):
        login_form = Authentication(request, request.POST)
        registration_form = RegistrationForm()
        print(3)
        
        if login_form.is_valid():
            username = login_form.cleaned_data['username']
            password = login_form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                print(request.user)
                return redirect(reverse_lazy('home'))

        return render(request, self.template_name, {
            'login_form': login_form,
            'registration_form' : registration_form
        })
        
class RegisterView(CreateView):
    template_name = 'login-register.html'

    def get(self, request):
        login_form = Authentication()
        registration_form = RegistrationForm()
        return render(request, self.template_name, {
            'login_form': login_form,
            'registration_form': registration_form
        })
    
    def post(self, request, *args, **kwargs):
        registration_form = RegistrationForm(request.POST)
        login_form = Authentication()
        if registration_form.is_valid():
            user = registration_form.save(commit=False)
            user.is_active = False
            user.save()
            current_site = get_current_site(request)
            subject = _('Activate Your TMART Account')
            message = render_to_string('account_activation_email.html', {
                'user': user,
                'domain': current_site.domain,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': account_activation_token.make_token(user),
            })
            user.email_user(subject, message)
            messages.add_message(request, messages.SUCCESS, _('You have registered succesfully!!! Please check your email to activate your account!!!'))
            return redirect(reverse_lazy('login_register'))
        return render(request, self.template_name, {
            'registration_form': registration_form,
            'login_form' : login_form
        })



def register(request):
    registration_form = RegistrationForm()
    login_form = Authentication()
    if request.method == 'POST':
        registration_form = RegistrationForm(request.POST)
        if registration_form.is_valid():
            user = registration_form.save(commit=False)
            user.is_active = False
            user.save()
            current_site = get_current_site(request)
            subject = 'Activate Your TMART Account'
            message = render_to_string('account_activation_email.html', {
                'user': user,
                'domain': current_site.domain,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': account_activation_token.make_token(user),
            })
            user.email_user(subject, message)
            messages.add_message(request, messages.SUCCESS, 'You have registered succesfully!!! Please check your email to activate your account!!!')
            return redirect(reverse_lazy('login'))

    context = {      
        'form': login_form,
        'registration_form': registration_form
    }
    return render(request, 'login-register.html', context)

def activate(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        if user.is_active == True:
            messages.add_message(request, messages.SUCCESS, _( 'You have activated your account successfully!!!'))
        user.save()
        return redirect(reverse_lazy('login_register'))


# def logout_request(request):
# 	logout(request)
# 	messages.info(request, _("You have successfully logged out.")) 
# 	return redirect("home")



class LogoutRequestView(LogoutView):
    print(7)
    next_page = "home"  # Specify the URL name or path to redirect after logout
    template_name = "base.html"  # Specify the template for the logout view
    print(8)




