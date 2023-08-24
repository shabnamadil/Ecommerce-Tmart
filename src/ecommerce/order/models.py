from django.db import models
from django.contrib.auth import get_user_model
from product.models import ProductVersion
User = get_user_model()

class Order(models.Model):
        customer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='order')
        date_ordered = models.DateTimeField(auto_now_add=True)
        complete = models.BooleanField(default=False)
        transaction_id = models.CharField(max_length=100, null=True)
        shipping = models.BooleanField(default=False)

        def __str__(self) -> str:
            return str(self.id)
        
        @property
        def get_cart_total(self):
            orderitems = self.orderitem_set.all()
            total = sum([item.get_total for item in orderitems])
            return total 

        @property
        def get_cart_items(self):
            orderitems = self.orderitem_set.all()
            total = sum([item.quantity for item in orderitems])
            return total 


class OrderItem(models.Model):
	product = models.ForeignKey(ProductVersion, on_delete=models.SET_NULL, null=True)
	order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)
	quantity = models.IntegerField(default=0, null=True, blank=True)
	date_added = models.DateTimeField(auto_now_add=True)

	@property
	def get_total(self):
		total = self.product.product.price * self.quantity
		return total


            

class Wishlist(models.Model):
    product = models.ForeignKey(ProductVersion, on_delete=models.SET_NULL, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='wishlist')
  


    def __str__(self):
        return self.user.get_username()
    
Country_Choices = [
     ('Azerbaijan', 'Azerbaijan'),
     ('Turkey', 'Turkey'),
     ('England', 'England'),
     ('Germany', 'Germany')
]
class Billing(models.Model):
  
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=25)
    phone_number = models.CharField(max_length=20)
    message = models.TextField()
    country = models.CharField(max_length=50, choices=Country_Choices)
    state = models.CharField(max_length=100 )
    street_adress = models.CharField(max_length=100)
    zipcode = models.CharField(max_length=50)
    flat_rate = models.DecimalField(max_digits=4, decimal_places=2, default=7.00)
    date_added = models.DateTimeField(auto_now_add=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, related_name='billing')
    user = models.ForeignKey(User, blank=True, on_delete=models.CASCADE, related_name='billing')

    def __str__(self):
        return self.zipcode