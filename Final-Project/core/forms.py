from django import forms
from .models import Contact, Newsletter
from django.utils.translation import gettext_lazy as _

class ContactForm(forms.ModelForm):

    class Meta:
        model = Contact
        fields = ['name', 'email', 'subject', 'message']
        exclude = ['created_at', 'updated_at']
        widgets = {
            'name' : forms.TextInput(attrs={'placeholder' : _('Your name'), 'min_length' : 3}),
            'email' : forms.EmailInput(attrs={'placeholder' : _('Your email')}),
            'subject' : forms.TextInput(attrs={'placeholder' : _('Subject')}),
            'message' : forms.Textarea(attrs={'placeholder' : _('Your message')})
            }
        

class NewsletterForm(forms.ModelForm):

    class Meta:
        model = Newsletter
        fields = ['email']
        widgets = {
            'email' : forms.EmailInput(attrs={'placeholder' : 'Email Address', 'class':'email', 'name':'EMAIL', 'id' : 'mce-EMAIL', 'type' : 'email'})
        }
        exclude = ['created_at', 'updated_at']