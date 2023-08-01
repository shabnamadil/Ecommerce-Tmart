from core.models import Contact, Newsletter
from django.http import JsonResponse
from .serializers import *
from rest_framework.decorators import api_view
from rest_framework.generics import CreateAPIView, ListCreateAPIView




class ContactCreateAPIView(CreateAPIView):
    serializer_class = ContactSerializer

class NewsletterAPIView(CreateAPIView):
    serializer_class = NewsletterSerializer

    


@api_view(http_method_names=['GET', 'POST'])
def contacts(request):
    if request.method == 'POST':
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(data=serializer.data, safe=False, status=201)
        return JsonResponse(data=serializer.errors, safe=False, status=400)
    contact_list = Contact.objects.all()
    serializer = ContactSerializer(contact_list, many=True)
    return JsonResponse( data=serializer.data,  safe=False)