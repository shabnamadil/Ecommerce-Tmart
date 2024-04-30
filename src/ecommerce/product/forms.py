from django import forms
from .models import Review
from django.utils.translation import gettext_lazy as _

class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ['review', 'rating', 'product']
        widgets = {
            'review' : forms.Textarea(attrs={'placeholder' : _('Type your review')})
        }