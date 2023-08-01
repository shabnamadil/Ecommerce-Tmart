from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView, CreateAPIView
from .serializers import OrderItemSerializer, CheckoutSerializer, WishlistSerializer
from order.models import OrderItem, Billing, Wishlist
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response

class OrderItemListAPIView(ListAPIView):
    serializer_class = OrderItemSerializer
    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get_queryset(self):
        user = self.request.user
        return OrderItem.objects.filter(order__customer=user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class OrderItemDeleteAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = OrderItemSerializer
    queryset = OrderItem.objects.all()
    permission_classes = (IsAuthenticated, )

    def partial_update(self, request, *args, **kwargs):
        if self.request.method == 'PATCH':
            instance = self.get_object()
            instance.quantity -= 1
            instance.save()
            if instance.quantity <= 0:
                instance.delete()

            return self.update(request, *args, **kwargs)
        if self.request.method == 'DELETE':
            instance = self.get_object()
            instance.delete()
            return self.update(request, *args, **kwargs)
        

class CheckoutAPIView(CreateAPIView):
    serializer_class = CheckoutSerializer
    permission_classes = (IsAuthenticated, )


class WishlistAPIView(ListAPIView):
    serializer_class = WishlistSerializer
    permission_classes = (IsAuthenticatedOrReadOnly, )
    queryset = Wishlist.objects.all()


class WishListDeleteAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = WishlistSerializer
    permission_classes = (IsAuthenticated, )
    queryset = Wishlist.objects.all()