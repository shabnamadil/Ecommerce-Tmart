async function ProductFilter(category, subcat, cat, search) {
    let url = 'http://localhost:8000/api/product/product_versions/?ordering=product__price';
  
    if (category) {
      url += `&category=${category}`;
    }
    
    if (subcat) {
        url += `&subcat=${subcat}`
    }
    
    if (cat) {
        url += `&cat=${cat}`
    }

    if (search) {
      url += `&search=${search}`
    }
    const response = await fetch(url);
    let responseData = await response.json();
    let SlicedData = responseData.slice(0, 4);
    let products = document.querySelector('#products');
  
    if (responseData.length <= 4) {
      const loadMoreButton = document.getElementById('load-more-btn');
      loadMoreButton.style.display = 'none';
    }
  
    for (const product of SlicedData) {
      products.innerHTML += `
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
                  <li><button onclick="updateUserOrder()" class="btn btn-outline-secondary add-btn update-cart" data-product="${product.id}" data-action="add" title="Add TO Cart" "><span class="ti-shopping-cart"></span></button></li>
                  <li><button onclick="updateWishlist()" class="btn btn-outline-secondary add-btn update-wishlist" data-product="${product.id}" data-action="add" title="Wishlist" ><span class="fa fa-heart-o liked"></span></button></li>
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
    }
  
    var updateBtns = document.getElementsByClassName('update-cart');
    for (i = 0; i < updateBtns.length; i++) {
      updateBtns[i].addEventListener('click', function () {
        var productId = this.dataset.product;
        var action = this.dataset.action;
  
        console.log('USER:', user);
  
        if (user == 'AnonymousUser') {
          addCookieItem(productId, action);
        } else {
          updateUserOrder(productId, action);
        }
      });
    }
  
    var updateBtn = document.getElementsByClassName('update-wishlist');
    for (i = 0; i < updateBtn.length; i++) {
      updateBtn[i].addEventListener('click', function () {
        var productId = this.dataset.product;
        var action = this.dataset.action;
  
        console.log('USER:', user);
  
        if (user == 'AnonymousUser') {
          addCookieItem(productId, action);
        } else {
          updateWishlist(productId, action);
          location.reload()
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
          'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({ 'productId': productId, 'action': action })
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log('data:', data);
        });
    }
  
    let hearts = document.getElementsByClassName("liked");
    let product_list = document.getElementsByClassName("product");
    for (let i = 0; i < product_list.length; i++) {
      hearts[i].addEventListener("click", (e) => {
        e.preventDefault();
        result = hearts[i].classList.toggle("active");
        if (result) {
          hearts[i].classList.remove("fa-heart-o");
          hearts[i].classList.add("fa-heart");
        } else {
          hearts[i].classList.remove("fa-heart");
          hearts[i].classList.add("fa-heart-o");
        }
      });
    }
  
    function updateWishlist(productId, action) {
  
      console.log('User is authenticated, sending data...');
      console.log('productId:', productId, 'Action:', action);
  
      var url = `${location.origin}/en/updatewishlist/`
  
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({ 'productId': productId, 'action': action })
      })
      alert('This item was added to your wishlist')
        .then((response) => {
          return response.json();
        })
        .then((data) => {
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

  }
  
  window.addEventListener('load', async function (e) {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryQuery = urlParams.get('category');
    const catQuery = urlParams.get('cat');
    const subcatQuery = urlParams.get('subcat');
    const SearchQuery = urlParams.get('search')
  
    if (categoryQuery || subcatQuery || catQuery || SearchQuery) {
      await ProductFilter(categoryQuery, subcatQuery, catQuery, SearchQuery);
    }
    else {
        await ProductFilter()
    }
  });
  

window.addEventListener('load', async function(e){
    let response_categories = await fetch('http://localhost:8000/api/product/categories/')
    let response_size = await fetch('http://localhost:8000/api/product/property_values/?property_name=size')
    let response_color = await fetch('http://localhost:8000/api/product/property_values/?property_name=color')
    let response_price = await fetch('http://localhost:8000/api/product/product_versions/')
    let resCatData = await response_categories.json()
    console.log(resCatData)
    let resSizeData = await response_size.json()
    let resColorData = await response_color.json()



    let categories = document.querySelector('#category')
    let filter_categories = document.querySelector('#filter_cat')
    let sizes = document.getElementById('filter_size')
    let colors = document.getElementById('filter_color')


    for (let color of resColorData) {
        colors.innerHTML += `
        ${color.product_value.property_name == 'color' ? `<li  class="${color.value_name}"><a href="#products" data-color="${color.id}"><i data-color="${color.id}" class="zmdi zmdi-circle"></i>${color.value_name}</a></li>` : ''}
        `
    }

    for (let size of resSizeData) {
        sizes.innerHTML += `
        ${size.product_value.property_name == 'size' ? `<li><a href="#products" data-size="${size.id}" >${size.value_name}</a></li>` : ''}
        `
    }

    for (category of resCatData){
        categories.innerHTML += `
        ${!category.main_category ? `<button data-category=${category.id} class=".cat--1">${category.category_name}</button>` : ''}
        `

        filter_categories.innerHTML += `
        ${!category.main_category ? `<li> <a href="#products" data-category=${category.id}>${category.main_cat}</a> </li>` : ''}
        `
    }

})

const priceFilterContainer = document.getElementById('filter_price')
priceFilterContainer.addEventListener('click', handlePriceFilter)

function handlePriceFilter(event) {
    const PriceId= event.target.dataset.price;
    const apiUrl = `http://localhost:8000/api/product/product_versions/?price=${PriceId}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        console.log(PriceId)
        displayResults(data);
        FilterMenu.innerHTML = ''
        FilterMenu.innerHTML += `
        <a href="#products"><i class="zmdi zmdi-close"></i></a>`
      })
      .catch(error => {
        console.error('Error:', error);
      });
}

const colorFiltersContainer = document.getElementById('filter_color')
colorFiltersContainer.addEventListener('click', handleColorFilter)

function handleColorFilter(event) {
    const ColorId= event.target.dataset.color;
    const apiUrl = `http://localhost:8000/api/product/product_versions/?color=${ColorId}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        displayResults(data);
        FilterMenu.innerHTML = ''
        FilterMenu.innerHTML += `
        <a href="#products"><i class="zmdi zmdi-close"></i></a>`
      })
      .catch(error => {
        console.error('Error:', error);
      });
}

const sizeFiltersContainer = document.getElementById('filter_size')
sizeFiltersContainer.addEventListener('click', handleSizeFilter)

function handleSizeFilter(event) {
    const SizeId = event.target.dataset.size;
    const apiUrl = `http://localhost:8000/api/product/product_versions/?size=${SizeId}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        displayResults(data);
        FilterMenu.innerHTML = ''
        FilterMenu.innerHTML += `
        <a href="#products"><i class="zmdi zmdi-close"></i></a>`
      })
      .catch(error => {
        console.error('Error:', error);
      });
}

const categoryFiltersContainer = document.querySelector('#category');
const categoryFilter = document.querySelector('#filter_cat');
const FilterMenu = document.querySelector('#FilterMenu');

categoryFiltersContainer.addEventListener('click', handleCategoryFilter);
categoryFilter.addEventListener('click', handleCategoryFilter)

function handleCategoryFilter(event) {
    const selectedCategoryId = event.target.dataset.category;

        console.log(selectedCategoryId)
    const apiUrl = `http://localhost:8000/api/product/product_versions/?category=${selectedCategoryId}`;
    
    fetch(apiUrl)
      .then(response => response.json())
      
      .then(data => {
        if (data){
        console.log(data);
        displayResults(data);
        FilterMenu.innerHTML = ''
        FilterMenu.innerHTML += `
        <a href="#products"><i class="zmdi zmdi-close"></i></a>`
      }})
      .catch(error => {
        console.error('Error:', error);
      });
}

function displayResults(results) {
    const resultsContainer = document.getElementById('products');
    resultsContainer.innerHTML = '';

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




let currentPage = 1;
const itemsPerPage = 4;
let startIndex = 4;
let endIndex = startIndex + itemsPerPage;
const container = document.getElementById('products');

function loadMoreData(category, search, subcat, cat) {
  const apiUrl = `http://localhost:8000/api/product/product_versions/?page=${currentPage}&ordering=product__price`;

  if (category) {
    apiUrl += `&category=${category}`;

  }

  if (search) {
    apiUrl += `&search=${search}`;
  }

  if (subcat) {
    apiUrl += `&subcat=${subcat}`;

  }

  if (cat) {
    apiUrl += `&cat=${cat}`
}

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Check if data is defined and is an array
      if (Array.isArray(data)) {
        // Calculate the new end index
        endIndex = startIndex + itemsPerPage;

        // Get the items to display for the current page
        const itemsToDisplay = data.slice(startIndex, endIndex);

        // Create HTML elements and append them to the container
        itemsToDisplay.forEach(product => {
            document.getElementById('products').innerHTML += `
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
                            
                                                <li><button class="btn btn-outline-secondary add-btn update-cart" data-product="${product.id}" data-action="add" title="Add TO Cart" "><span class="ti-shopping-cart"></span></button></li>
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
            `

        });
        var updateBtns = document.getElementsByClassName('update-cart')

for (i = 0; i < updateBtns.length; i++) {
	updateBtns[i].addEventListener('click', function(){
		var productId = this.dataset.product
		var action = this.dataset.action
		console.log('productId:', productId, 'Action:', action)
		console.log('USER:', user)

		if (user == 'AnonymousUser'){
			addCookieItem(productId, action)
		}else{
			updateUserOrder(productId, action)
		}
	})
}

function updateUserOrder(productId, action){
	console.log('User is authenticated, sending data...')

		var url = `${location.origin}/en/update_item/`

		fetch(url, {
			method:'POST',
			headers:{
				'Content-Type':'application/json',
				'X-CSRFToken':csrftoken,
			}, 
			body:JSON.stringify({'productId':productId, 'action':action})
		})
		.then((response) => {
		   return response.json();
		})
		.then((data) => {
            console.log(data)
		});
}

function addCookieItem(productId, action){
	console.log('User is not authenticated')

	if (action == 'add'){
		if (cart[productId] == undefined){
		cart[productId] = {'quantity':1}

		}else{
			cart[productId]['quantity'] += 1
		}
	}

	if (action == 'remove'){
		cart[productId]['quantity'] -= 1

		if (cart[productId]['quantity'] <= 0){
			console.log('Item should be deleted')
			delete cart[productId];
		}
	}
	console.log('CART:', cart)
	document.cookie ='cart=' + JSON.stringify(cart) + ";domain=;path=/"
	
	location.reload()
}
        
         // Increment the current page and update the start index for the next request
         currentPage++;
         startIndex = endIndex;
       } 
       if (startIndex >= data.length) {
         loadMoreButton.style.display = 'none'; // Show the "Load More" button
       } else {
         loadMoreButton.style.display = 'block'; // Hide the "Load More" button if no more items
       }
     })
     .catch(error => {
       console.error('Error:', error);
     });
    
 }
 
 
 // Attach event listener to the "Load More" button or trigger
 const loadMoreButton = document.getElementById('load-more-btn');
 loadMoreButton.addEventListener('click', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryQuery = urlParams.get('category');
    const SearchQuery = urlParams.get('search');
    const SubCatQuery = urlParams.get('subcat');
    const CatQuery = urlParams.get('cat');

    console.log(1)

    if (categoryQuery || SubCatQuery || SearchQuery || CatQuery) {
      loadMoreData(categoryQuery, SearchQuery, SubCatQuery, CatQuery)
    }
    else {
        loadMoreData()
    }
  
})
 
 