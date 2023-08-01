window.addEventListener('load', async function(e){
	let res = await fetch(`${location.origin}/api/order/`)
	let resD = await res.json()
	let ShoppingCart = document.getElementById('ShoppingCart')
	let cartItems = document.getElementById('cartItems')
	let cartTotal = document.getElementById('cartTotal')
  let checkproceed = document.getElementById('checkId')
	for(item of resD) {
		ShoppingCart.innerHTML += `
							<div class="shp__single__product">
								<div class="shp__pro__thumb">
									<a href="${item.product.get_absolute_url}">
										<img src="${item.product.main_image}" alt="product images">
									</a>
								</div>
								<div class="shp__pro__details">
									<h2><a href="${item.product.get_absolute_url}">${item.product.product.title}</a></h2>
									<span type="submit" value="${item.quantity}" class="quantity">QTY: ${item.quantity}</span>
									<span class="shp__price">$${item.get_total}</span>
								</div>
								<div class="remove__btn" >
									<i onclick="removeItem(${item.id})"   class="zmdi zmdi-close"></i>
                            	</div>
							</div>
		`	
		cartItems.innerHTML = `${item.order.get_cart_items}`
		cartTotal.innerHTML = `$${item.order.get_cart_total}`
	}
	if (resD.length <= 0 ){
		cartItems.innerHTML = `0`
		cartTotal.innerHTML = `$0.00`
		ShoppingCart.innerHTML = `No items in Cart`
    checkproceed.innerHTML = ''
	}
	
})
function removeItem(itemId) {
    // Send a request to the server to remove the item from the cart
    fetch(`${location.origin}/api/order/items/${itemId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken// Replace with your actual CSRF token
        }
    })
	location.reload()
}

const ProductSearchForm = document.getElementById('ProductSearchForm');
const ProductSearchInput = document.getElementById('ProductSearchInput');

ProductSearchForm.addEventListener('submit', redirectToProductResultsPage);

function redirectToProductResultsPage(event) {
  event.preventDefault(); // Formun göndərilməsini dayandır
  
  const ProductsearchTerm = ProductSearchInput.value;
  if (ProductsearchTerm) {
  const url = `http://127.0.0.1:8000/en/shop/?search=${ProductsearchTerm}`;

  window.location.href = url;
}}

// Səhifə yükləndikdə, axtarış parametrlərini yoxlayır və axtarış nəticələrini göstərir
window.addEventListener('DOMContentLoaded', handleProductSearchResults);

function handleProductSearchResults() {
  const urlParams = new URLSearchParams(window.location.search);
  const ProductsearchTerm = urlParams.get('search');

  if (ProductsearchTerm) {
    const apiUrl = `http://localhost:8000/api/product/product_versions/?search=${encodeURIComponent(ProductsearchTerm)}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        
        displaySearchResults(data);

      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
}

function displaySearchResults(results) {
	console.log(results)
    const resultsContainer = document.getElementById('product');
    resultsContainer.innerHTML = '';
	if (results.length === 0) {
		resultsContainer.innerHTML = '<p>No results found.</p>';
	  } else {
		resultsContainer.innerHTML = '';
	  }
      for (const product of results) {
        const productElement = document.createElement('div');
        productElement.classList.add('blog', 'foo');
        productElement.innerHTML = `
            <div class="col-md-3 single__pro col-lg-3 cat--1 col-sm-4 col-xs-12">
                <div class="product foo">
                    <div class="product__inner">
                        <div class="pro__thumb">                                                                                
                            <a href="${product.get_absolute_url}">
                                <img src="${product.main_image}" alt="product images">
                            </a>                                      
                        </div>
                        <div class="product__hover__info">
                            <ul class="product__action">
                                <li><a data-toggle="modal" data-target="#productModal" title="Quick View" class="quick-view modal-view detail-link" href="#"><span class="ti-plus"></span></a></li>
                                <li><button onclick="updateUserOrder()" class="btn btn-outline-secondary add-btn update-cart" data-product="${product.id}" data-action="add" title="Add TO Cart" "><span class="ti-shopping-cart"></span></button></li>
                                <li><a title="Wishlist" href="wishlist.html"><span class="fa fa-heart-o liked"></span></a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="product__details">
                        <h2><a href="${product.get_absolute_url}">${product.product.title}</a></h2>
                        <ul class="product__price">
                            ${product.product.old_price ? `<li class="old__price">$${product.product.old_price}</li>` : ''}
                            <li class="new__price">$${product.product.price}</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        resultsContainer.appendChild(productElement);
      }
    }
