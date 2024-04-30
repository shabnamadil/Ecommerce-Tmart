from django import forms
from .models import Comment
from django.utils.translation import gettext_lazy as _

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = [ 'message' ]
        widgets = {
            'message' : forms.Textarea(attrs={'placeholder' : _('Your message')})
            }

class SearchForm(forms.Form):
    query = forms.CharField(widget=forms.TextInput(attrs={'placeholder' : _('Search...')}))