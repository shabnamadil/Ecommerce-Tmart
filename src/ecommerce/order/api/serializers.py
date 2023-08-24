from rest_framework import serializers
from order.models import OrderItem, Order, Billing, Wishlist
from product.api.serializers import ProductVersionSerializer

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = (
            'customer',
            'shipping',
            'get_cart_total',
            'get_cart_items'
        )


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductVersionSerializer()
    order = OrderSerializer()
    class Meta:
        model = OrderItem
        fields = (
            'id',
            'product',
            'order',
            'quantity',
            'get_total'
        )


class CheckoutSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Billing
        fields = (
            'message',
            'country',
            'state',
            'zipcode',
            'street_adress',
            'flat_rate',
            'user',
        )

    def validate(self, attrs):
        request = self.context['request']
        attrs['user'] = request.user
        return super().validate(attrs)
    

class WishlistSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    product = ProductVersionSerializer()
    class Meta:
        model = Wishlist
        fields = (
            'id',
            'product',
            'user'
        )

    def validate(self, attrs):
        request = self.context['request']
        attrs['user'] = request.user
        return super().validate(attrs)