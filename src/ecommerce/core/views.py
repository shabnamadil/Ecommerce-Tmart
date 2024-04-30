from typing import Any, Dict
from django.forms.models import BaseModelForm
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from django.urls import reverse_lazy
from .models import Team, Newsletter
from product.models import Review, Product
from .forms import ContactForm, NewsletterForm
from django.views.generic import ListView, FormView, CreateView
from django.utils.translation import gettext_lazy as _


def about(request):
    review = Review.objects.filter(active=True).order_by('rating').last()
    team = Team.objects.filter(active=True, department__contains='CEO')[:3]
    context = {
        'review' : review,
        'team' : team
    }
    return render (request, 'about.html', context)

def team(request):
    team = Team.objects.filter(active=True, department__contains='CEO')[:6]
    review = Review.objects.order_by('rating').last()
    context = {
        'team' : team,
        'review' : review
    }
    return render (request, 'team.html', context)

@csrf_exempt
def contact(request):
    form = ContactForm()
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            messages.add_message(request, messages.SUCCESS, 'Your message has been sent')
            form = ContactForm()
            return redirect(reverse_lazy('contact'))


    context = {
        'form' : form
    }

    return render (request, 'contact.html', context )

class ContactView(FormView):
    template_name = 'contact.html'
    form_class = ContactForm
    success_url = reverse_lazy('contact')

    def form_valid(self, form: BaseModelForm) -> HttpResponse:
        messages.add_message(self.request, messages.SUCCESS, _('Your message has been sent'))
        return super().form_valid(form)
    

class TeamListView(ListView):
    model = Team
    template_name = 'team.html'
    queryset = Team.objects.filter(active=True, department__contains='CEO')[:6]

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)
        context['review'] = Review.objects.order_by('rating').last()
        return context
    

class AboutView(ListView):
    model = Team
    template_name = 'about.html'
    queryset = Team.objects.filter(active=True, department__contains='CEO')[:3]

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)
        context['review'] = Review.objects.order_by('rating').last()
        return context

class NewsletterView(FormView):
    model = Newsletter
    template_name = 'base.html'