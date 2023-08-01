from modeltranslation.translator import register, TranslationOptions

from .models import Blog, BlogCategory

@register(Blog)
class BlogTranslationOptions(TranslationOptions):
    fields = ('title', 'blog')

@register(BlogCategory)
class BlogCategoryTranslationOptions(TranslationOptions):
    fields = ('category_name',)

