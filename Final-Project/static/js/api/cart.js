window.addEventListener('load', async function(e) {
    let response = await fetch(`${location.origin}/api/order`);
    let resData = await response.json();
    let Cart = document.getElementById('Cart');
    let cartSubTotal = document.getElementById('cartSubTotal')
    let ShippingExpense = document.getElementById('flat_rate')
    let checkoutId = document.getElementById('checkoutId')
    for (item of resData) {
        Cart.innerHTML += `
            <tr>
                <td class="product-thumbnail"><a href="${item.product.get_absolute_url}"><img src="${item.product.main_image}" alt="product img" /></a></td>
                <td class="product-name"><a href="${item.product.get_absolute_url}">${item.product.product.title}</a></td>
                <td class="product-price"><span class="amount">$${item.product.product.price}</span></td>
                <td onclick="updateUserOrder(${item.product.id}, 'add')" class="product-quantity update-cart" data-product="${item.product.id}" data-action="add"><input type="number" value="${item.quantity}" /></td>
                <td class="product-subtotal">$${item.get_total}</td>
                <td class="product-remove" onclick="remove(${item.id})"><a>X</a></td>
            </tr>
        `
        cartSubTotal.innerHTML += `$${item.get_total}`
    }
    
    if (resData.length <= 0) {
        Cart.innerHTML = 'No items in Cart';
        checkoutId.innerHTML = ''
    }
});

function remove(itemId) {
    // Send a request to the server to remove the item from the cart
    fetch(`${location.origin}/api/order/items/${itemId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken // Replace with your actual CSRF token
        }
    })
    .then(() => {
        location.reload();
    });
}

var updateBtns = document.getElementsByClassName('update-cart');
for (let i = 0; i < updateBtns.length; i++) {
    updateBtns[i].addEventListener('click', function() {
        var productId = this.dataset.product;
        var action = this.dataset.action;

        if (user == 'AnonymousUser') {
            addCookieItem(productId, action);
        } else {
            updateUserOrder(productId, action);
            location.reload();
        }
    });
}

function updateUserOrder(productId, action) {
    console.log('User is authenticated, sending data...');
    console.log('productId:', productId, 'Action:', action);

    var url = `${location.origin}/en/update_item/`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({ 'productId': productId, 'action': action })
    })
    .then(response => response.json())
    .then(data => {
        console.log('data:', data);
    });
}

function addCookieItem(productId, action) {
    console.log('User is not authenticated');

    if (action == 'add') {
        if (cart[productId] == undefined) {
            cart[productId] = { 'quantity': 1 };
        } else {
            cart[productId]['quantity'] += 1;
        }
    }

    if (action == 'remove') {
        cart[productId]['quantity'] -= 1;

        if (cart[productId]['quantity'] <= 0) {
            console.log('Item should be deleted');
            delete cart[productId];
        }
    }
    console.log('CART:', cart);
    document.cookie = 'cart=' + JSON.stringify(cart) + ";domain=;path=/";
}
