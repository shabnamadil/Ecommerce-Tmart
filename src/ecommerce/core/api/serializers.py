from rest_framework import serializers
from core.models import Contact, Newsletter


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = (
            'name',
            'email',
            'subject',
            'message'
        )

class NewsletterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Newsletter
        fields = (
            'email',
        )