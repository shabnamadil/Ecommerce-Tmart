from typing import Any, Dict, Optional
from django.db import models
from django.http import HttpRequest, HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.db.models import Count
from django.views.generic import ListView, DetailView
from django.views.generic.edit import FormMixin
from .models import Blog, Comment, BlogCategory
from accounts.models import User
from .forms import CommentForm, SearchForm
from taggit.models import Tag
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank, TrigramSimilarity
from django.core.paginator import Paginator, PageNotAnInteger
from django.contrib import messages
from django.urls import reverse_lazy
from django.db.models import Q
from django.utils.translation import gettext_lazy as _
# from django.http import Http404

# app_name = 'BLOG'

def blog_list(request, tag_slug=None, category_slug=None, query=None):
    form1 = SearchForm()
    query = None
    results = []
    blogs = Blog.published.all()
    tag = None
    category2=None
    if tag_slug:
        tag = get_object_or_404(Tag, slug=tag_slug)
        blogs = blogs.filter(tags__in=[tag])

    if category_slug:
        category2 = get_object_or_404(BlogCategory, slug=category_slug)
        blogs = blogs.filter(category__in=[category2])
    
    if 'query' in request.GET:
        form1 = SearchForm(request.GET)
        if form1.is_valid():
            query = form1.cleaned_data['query']
            search_vector = SearchVector('title', 'tags')
            search_query = SearchQuery(query)
            results = Blog.published.annotate(search=search_vector, rank=SearchRank(search_vector, search_query)).filter(search=search_query).order_by('-rank')
    context = {
        'blogs' : blogs,
        'tag' : tag,
        'category2' : category2,
        'query' : query,
        'results' : results
    }
    return render(request, 'blog.html', context)


# def blog_list(request):
#     blog_list_all = Blog.published.all()
#     paginator = Paginator(blog_list_all, 2)
#     page_number = request.GET.get('page', 1)
#     # try:
#     blogs = paginator.get_page(page_number)
#     # except PageNotAnInteger:
#     #     blogs = paginator.page(1)
#     context = {
#         'blogs' : blogs
#     }
#     return render(request, 'blog.html', context)


def blog_detail(request, year, month, day, blog):
    # try:
    #     blog = Blog.published.get(id=id)
    # except Blog.DoesNotExist:
    #     raise Http404('No blog found')
    blog = get_object_or_404(Blog, status = Blog.Status.PUBLİSHED, 
                             slug = blog,
                             published_at__year = year,
                             published_at__month = month,
                             published_at__day = day)
    blog_tags_ids = blog.tags.values_list('id', flat=True)
    similar_blogs = Blog.published.filter(tags__in=blog_tags_ids).exclude(id=blog.id)
    similar_blogs = similar_blogs.annotate(same_tags=Count('tags'), a=Count('comments')).order_by('-same_tags','-a','-published_at')[:3]
    comment = None
    comments = blog.comments.filter(active=True)
    category = BlogCategory.objects.all()
    form1 = SearchForm()
    form = CommentForm()
    if request.method == 'POST':
        form = CommentForm(request.POST or None)
        if form.is_valid():
                comment = form.save(commit=False)
                comment.blog = blog
                comment.user = request.user
                comment.save()
                form = CommentForm()
                messages.add_message(request, messages.SUCCESS, "Your comment has been published successfully!!!")
                return redirect(reverse_lazy('BLOG:blog_detail', kwargs={'year': year,
                                                                        'month': month,
                                                                        'day': day,
                                                                        'blog': blog.slug}))
                
             
    else:
        form = CommentForm()
    context = {
        'blog' : blog,
        'blogs' : similar_blogs,
        'form' : form,
        'comments' : comments,
        'category' : category,
        'form1' : form1
    }
    return render(request, 'blog-details.html', context)


class BlogListView(ListView):
    model = Blog
    context_object_name = 'blogs'
    template_name = 'blog.html'
    queryset = Blog.published.all()

    def get_queryset(self):
        queryset = super().get_queryset()
        cat_slug = self.request.GET.get('category')
        tag_slug = self.request.GET.get('tag')
        query = self.request.GET.get('query')
        if cat_slug:
            queryset = queryset.filter(category__slug = cat_slug)
        if tag_slug:
            queryset = queryset.filter(tags__slug = tag_slug)
        if query:
            form1 = SearchForm(self.request.GET)
            if form1.is_valid():
                queryset = queryset.filter(Q(title__icontains=query) | Q(blog__icontains=query) | Q(tags__name__icontains=query))         
                # search_vector = SearchVector('title') + SearchVector('tags') + SearchVector('blog')
                # search_query = SearchQuery(query)
                # queryset = queryset.annotate(search=search_vector, rank=SearchRank(search_vector, search_query)).filter(search__icontains=query).order_by('-rank')
        return queryset
    

class BlogDetailVieW(DetailView, FormMixin):
    model = Blog
    template_name = 'blog-details.html'
    context_object_name = 'blog'
    form_class = CommentForm

    def get_success_url(self) -> str:
        return reverse_lazy('blog_detail', kwargs={'slug' : self.object.slug,
                                                   'year': self.object.published_at.year,
                                                   'month': self.object.published_at.month,
                                                   'day': self.object.published_at.day})

    def get(self, request,  year, month, day, slug) -> HttpResponse:
        self.object = get_object_or_404(Blog, status = Blog.Status.PUBLİSHED, 
                             slug = slug,
                             published_at__year = year,
                             published_at__month = month,
                             published_at__day = day)
        context = self.get_context_data(object=self.object)
        return self.render_to_response(context)
    
    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)
        context['categories'] = BlogCategory.objects.all()
        blog_tags_ids = self.object.tags.values_list('id', flat=True)
        similar_blogs = Blog.published.filter(Q(tags__in=blog_tags_ids)).exclude(id=self.object.id)
        context['blogs'] = similar_blogs.annotate(same_tags=Count('tags'), a=Count('comments')).order_by('-same_tags','-a','-published_at')[:3]
        context['comments'] = self.object.comments.filter(active=True)
        context['form1'] = SearchForm()
        return context 
    
    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        form = self.get_form()
        if form.is_valid():              
                return self.form_valid(form)
        else:
            return self.form_invalid(form)
        
    def form_valid(self, form: Any) -> HttpResponse:
        form.instance.blog = self.object
        form.instance.user = self.request.user
        form.save()
        messages.add_message(self.request, messages.SUCCESS, _("Your comment has been published successfully!!!"))
        return super().form_valid(form)



