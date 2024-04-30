from modeltranslation.translator import register, TranslationOptions

from .models import Product, PropertyValue

@register(Product)
class ProductTranslationOptions(TranslationOptions):
    fields = ('title', 'small_description', 'large_description')


@register(PropertyValue)
class PropertyValueTranslationOptions(TranslationOptions):
    fields = ('value_name', )

