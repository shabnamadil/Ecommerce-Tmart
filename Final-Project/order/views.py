from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
import json
from product.models import ProductVersion
from order.models import Order, OrderItem, Wishlist
from .utils import *
from django.views.generic import ListView


def CheckoutView(request):
        data = cartData(request)
        
        cartItems = data['cartItems']
        order = data['order']
        items = data['items']

        context = {'items':items, 'order':order, 'cartItems':cartItems}
        return render(request, 'checkout.html', context)

from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def updateItem(request):
        data = json.loads(request.body)
        productId = data['productId']
        action = data['action']
        print('Action:', action)
        print('Product:', productId)
        print(request.user)
        customer = request.user
        product = ProductVersion.objects.get(id=productId)
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        orderItem, created = OrderItem.objects.get_or_create(order=order, product=product)
        wish_list_item = Wishlist.objects.filter(product__id=productId)
        wishobcect, created = Wishlist.objects.get_or_create(user=customer, product=product)

        if action == 'add':
            if wish_list_item:
                  wishobcect.delete()
            orderItem.quantity = (orderItem.quantity + 1)
        elif action == 'remove':
            orderItem.quantity = (orderItem.quantity - 1)

        orderItem.save()

        if orderItem.quantity <= 0:
            orderItem.delete()

        return JsonResponse('Item was added', safe=False)



from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def updateWishList(request):
        data = json.loads(request.body)
        productId = data['productId']
        action = data['action']
        print('Action:', action)
        print('Product:', productId)
        print(request.user)
        user= request.user
        product = ProductVersion.objects.get(id=productId)
        wishobcect, created = Wishlist.objects.get_or_create(user=user, product=product)
        order, created = Order.objects.get_or_create(customer=user, complete=False)
        orderItem, created = OrderItem.objects.get_or_create(product__id=productId)
        print(wishobcect.product.id)
        print(orderItem.product.id)
        if action == 'add' and wishobcect.product.id == orderItem.product.id:                
                wishobcect.delete()
        else:
              wishobcect.save()


        return JsonResponse('wishItem was added', safe=False)

def cart(request):
	data = cartData(request)

	cartItems = data['cartItems']
	order = data['order']
	items = data['items']

	context = {'items':items, 'order':order, 'cartItems':cartItems}
	return render(request, 'cart.html', context)


class WishlistView(ListView):
      model = Wishlist
      template_name = 'wishlist.html'
      context_object_name = 'wishlist'
      