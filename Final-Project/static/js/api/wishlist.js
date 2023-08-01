window.addEventListener('load', async function(e){
    let resWishListResponse =  await fetch('http://127.0.0.1:8000/api/order/wishlist/')
    let WishData = await resWishListResponse.json()
    let WishListContainer = document.getElementById('WishListContainer')
    for (item of WishData) {
        WishListContainer.innerHTML += `
                        <tr>
                            <td class="product-remove" onclick="remove(${item.id})"><a >×</a></td>
                            <td class="product-thumbnail"><a href="#"><img src="${item.product.main_image}" alt="" /></a></td>
                            <td class="product-name"><a href="#">${item.product.product.title}</a></td>
                            <td class="product-price"><span class="amount">$${item.product.product.price}</span></td>
                            ${item.product.current_stock ? `<td class="product-stock-status"><span class="wishlist-in-stock">In Stock(${item.product.total})</span></td>` : `<td class="product-stock-status"><span class="wishlist-in-stock">Out Of Stock</span></td>`}
                            ${item.product.current_stock ? `<td onclick="updateUserOrder(${item.product.id}, 'add')" onclick="remove(${item.id})" data-product="${item.product.id}" data-action="add" class="product-add-to-cart update-cart"><a> Add to Cart</a></td>` : `<td class="product-add-to-cart"><a href="#footer">Subscribe Us for  stock notification</a></td>` }
                        </tr>  
        `

    }
})
function remove(itemId) {
    // Send a request to the server to remove the item from the cart
    fetch(`${location.origin}/api/order/wishlist/${itemId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken // Replace with your actual CSRF token
        }
    })
    .then(() => {
    });
}

var updateBtns = document.getElementsByClassName('update-cart')
    for (i = 0; i < updateBtns.length; i++) {
        updateBtns[i].addEventListener('click', function(){
            var productId = this.dataset.product
            var action = this.dataset.action
            
            console.log('USER:', user)
            
    
            if (user == 'AnonymousUser'){
                addCookieItem(productId, action)
            }else{
                updateUserOrder(productId, action)
            }
        })
    }

    var updateBtn = document.getElementsByClassName('update-wishlist')
    for (i = 0; i < updateBtn.length; i++) {
        updateBtn[i].addEventListener('click', function(){
            var productId = this.dataset.product
            var action = this.dataset.action
            
            console.log('USER:', user)
            
    
            if (user == 'AnonymousUser'){
                addCookieItem(productId, action)
            }else{
                updateWishlist(productId, action)
            }
        })
    }
    
    function updateUserOrder(productId, action){
        console.log('User is authenticated, sending data...')
        console.log('productId:', productId, 'Action:', action)
    
            var url = `${location.origin}/en/update_item/`
    
            fetch(url, {
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'X-CSRFToken': csrftoken,
                }, 
                body:JSON.stringify({'productId':productId, 'action':action})
            })
            .then((response) => {
               return response.json();
            })
            .then((data) => {
                console.log('data:', data)
            });
    }

    function remove(itemId) {
        // Send a request to the server to remove the item from the cart
        fetch(`${location.origin}/api/order/wishlist/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken // Replace with your actual CSRF token
            }
        })
        .then(() => {
        });
    }

