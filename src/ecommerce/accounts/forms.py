from typing import Any, Dict
from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import get_user_model, login
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

User = get_user_model()

class RegistrationForm(UserCreationForm):
    password1 = forms.CharField(widget=forms.PasswordInput({
        'placeholder' : _('Password*')
    }))
    password2 = forms.CharField(widget=forms.PasswordInput({
        'placeholder' : _('Confirm password*')
    }))
    class Meta:
        model = User
        fields = ['username', 'email']

        widgets = {
            'username' : forms.TextInput(attrs={
                'placeholder' : _('Username*')
            }),
            'email' : forms.EmailInput(attrs={
                'placeholder' : _('Your email*')
            })
        }


class Authentication(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput({
        'placeholder' : _('Username*')
    }))
    password = forms.CharField(widget=forms.PasswordInput({
        'placeholder' : _('Password*')
    }))

