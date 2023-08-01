from typing import Any, Dict, Sequence
from django.db.models.query import QuerySet
from django.http import HttpRequest, HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from .models import Product, Category, ProductVersion
from blog.models import Blog
from .forms import ReviewForm
from django.urls import reverse_lazy
from django.contrib import messages
from django.views.generic import ListView, DetailView
from django.views.generic.edit import FormMixin
from django.db.models import Avg, Max, Count
from django.utils.translation import gettext_lazy as _

def home(request):
    return render(request, 'index.html')

class HomeListView(ListView):
    template_name = 'index.html'
    model = Product
    ordering = ['-created_at']


    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)
        context['blogs']  = Blog.published.all().order_by('-published_at')[:3]
        context['best_sale'] = Product.objects.all().order_by('product_version__total')[:6]
        # unsorted_results = Product.objects.all().order_by('-created_at')[:3]
        # sorted_results = sorted( unsorted_results, key= lambda t: t.product_version__average_rating())
        # context['top_rated'] = Product.objects.all().order_by('-product_version__average_rating')
        rate_women = Product.objects.filter(category__main_category__main_category=1, review__rating__gt=0).annotate(avg_rating=Avg('review__rating')).order_by('avg_rating')[:6]
        context['top_rated_women'] = rate_women
        rate_men = Product.objects.filter(category__main_category__main_category=3, review__rating__gt=0).annotate(avg_rating=Avg('review__rating')).order_by('avg_rating')[:6]
        context['top_rated_men'] = rate_men
        rate_girls = Product.objects.filter(category__main_category__main_category=48, review__rating__gt=0).annotate(avg_rating=Avg('review__rating')).order_by('avg_rating')[:6]
        context['top_rated_girls'] = rate_girls
        # avg = Product.objects.average_rating('product_version__review__rating')
        # context['top_rated'] = Product.objects.all().order_by(avg)
        context['categories'] = Category.objects.all()
        context['WomenLatest'] = Product.objects.filter(category__main_category__main_category=1)
        context['MenLatest'] = Product.objects.filter(category__main_category__main_category=3)
        context['GirlsLatest'] = Product.objects.filter(category__main_category__main_category=48)
        context['on_sale_women'] = Product.objects.filter(category__main_category__main_category=1)
        context['on_sale_men'] = Product.objects.filter(category__main_category__main_category=3)
        context['on_sale_girls'] = Product.objects.filter(category__main_category__main_category=48)
        return context
    
    def get_queryset(self) -> QuerySet[Any]:
        queryset = super().get_queryset()
        cat_slug = self.request.GET.get('category')
        if cat_slug:
            queryset = queryset.filter(category__slug = cat_slug)
        return queryset


class ShopListView(ListView):
    model = Product
    template_name= 'shop.html'
    queryset = Product.objects.all()

    def get_queryset(self) -> QuerySet[Any]:
        queryset = super().get_queryset()
        cat_slug = self.request.GET.get('category')
        if cat_slug:
            queryset = queryset.filter(category__slug = cat_slug)
        return queryset
    
    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)
        context['product_category'] = Category.objects.all()
        
        return context
    

def shop(request, category_slug=None):
    products = Product.objects.all()
    product_category = Category.objects.all()
    category=None

    if category_slug:
        category = get_object_or_404(Category, slug=category_slug)
        products = Product.objects.filter(category__in=[category])
    context = {
        'products' : products,
        'product_category' : product_category,
    }
    return render(request, 'shop.html', context)


class ShopDetailView(DetailView, FormMixin):
    model = ProductVersion
    template_name = 'product-details.html'
    form_class = ReviewForm
    context_object_name = 'product'

    def get(self, request, slug) -> HttpResponse:
        self.object = get_object_or_404(ProductVersion, slug = slug,)
        context = self.get_context_data(object=self.object)
        return self.render_to_response(context)
    
    def get_success_url(self) -> str:
        return reverse_lazy('shop_detail', kwargs={'slug' : self.object.slug,})
    
    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context =  super().get_context_data(**kwargs)
        context['reviews'] = self.object.product.review.filter(active=True).order_by('-created_at')
        return context
    
    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        form = self.get_form()
        if form.is_valid():
                return self.form_valid(form)
        else:
            return self.form_invalid(form)  
        
    def form_valid(self, form: Any) -> HttpResponse:
        form.instance.product = self.object.product
        form.instance.user = self.request.user
        form.save()
        messages.add_message(self.request, messages.SUCCESS, _('Your review has been posted'))
        return super().form_valid(form)



def shop_detail(request, id):
    product = get_object_or_404(ProductVersion, id=id)
    review = None
    form = ReviewForm()
    reviews = product.review.filter(active=True).order_by('-created_at')
    if request.method == 'POST' :
        form = ReviewForm(request.POST or None)
        if form.is_valid():
            review = form.save(commit=False)
            review.product = product
            review.user = request.user
            review.rating = form.cleaned_data['rating']
            review.save()
            form = ReviewForm()
            messages.add_message(request, messages.SUCCESS, 'Your review has been posted')
            return redirect(reverse_lazy('shop_detail', kwargs={'id':id}))
    else:
        form = ReviewForm()
    context = {
        'product' : product,
        'form' : form,
        'reviews' : reviews
    }

    return render(request, 'product-details.html', context)