window.addEventListener('load', async function(e) {
    let Rescategories = await fetch('http://localhost:8000/api/product/categories/');
    let CategoryData = await Rescategories.json();
    let MenuContainer = document.getElementById('MenuCat');
    let WomenCatAllContainer = document.getElementById('ProductAllCategoryWomen')
    let MenCatAllContainer = document.getElementById('ProductAllCategoryMen')
    let GirlsCatAllContainer = document.getElementById('ProductAllCategoryGirls')

    for (let cat of CategoryData) {
        let menuContent = `
            <li>${!cat.main_category ? `<a href="#"><img alt="" src="${cat.png}">${cat.main_cat}<i class="zmdi zmdi-chevron-right"></i></a>` : ''}
                <div class="category-menu-dropdown">
        `;
        
        if (cat.category_name == cat.main_cat) {
            for (let SUBCAT_ID of cat.cat_name) {
                for (let WomenCat of CategoryData) {
                    if (WomenCat.id == SUBCAT_ID) {
                        menuContent += `
                            <div class="category-part-1 category-common mb--30">
                                <h4 class="categories-subtitle"> ${WomenCat.category_name}</h4>                                   
                                <ul> 
                        `;

                        // Bu alt kateqoriyanın altındakı digər kateqoriyaları da göstərmək üçün bir başqa dövr
                        for (let SUBCAT_SUBID of WomenCat.cat_name) {
                            for (let SubWomenCat of CategoryData) {
                                if (SubWomenCat.id == SUBCAT_SUBID) {
                                    menuContent += `
                                        <li data-category=${SubWomenCat.id} ><a data-category= ${SubWomenCat.id} > ${SubWomenCat.category_name} </a></li>
                                    `;
                                }
                            }
                        }

                        menuContent += `
                                </ul>
                            </div>
                        `;
                    }
                }
            }
        }

        menuContent += `
                </div>
            </li>
        `;

        MenuContainer.innerHTML += menuContent;

        if (cat.id == 1 ) {
        let WomenAllContent = `
                    <div class="product-categories-title">
                        ${!cat.main_category && cat.id ==1 ? `<h3> ${cat.main_cat} </h3>` : '' }
                    </div>
      
        `
        if (cat.category_name == cat.main_cat) {
            for (let SUBCAT_ID of cat.cat_name) {
                for (let WomenCat of CategoryData) {
                    if (WomenCat.id == SUBCAT_ID) {
                        WomenAllContent += `
                        <div class="product-categories-menu">
                            <ul>
                                <li id="ProductAllWomen"><a href="#products" data-category=${WomenCat.id} > ${WomenCat.category_name}</a></li>
                            </ul>
                        </div> 
                        `


                       
                    }
                }
            }
        }
        
        WomenCatAllContainer.innerHTML += WomenAllContent
        }
        
        if (cat.id == 3 ) {
            let MenAllContent = `
                            <div class="product-categories-title">
                            ${!cat.main_category && cat.id == 3 ? `<h3> ${cat.main_cat} </h3>
                            </div>` : '' }
          
                            `
            if (cat.category_name == cat.main_cat) {
                for (let SUBCAT_ID of cat.cat_name) {
                    for (let MenCat of CategoryData) {
                        if (MenCat.id == SUBCAT_ID) {
                            MenAllContent += `
                            <div class="product-categories-menu">
                                <ul>
                                    <li><a  data-category=${MenCat.id} > ${MenCat.category_name} </a></li>                                  
                                </ul>
                            </div>`     
    
    
                           
                        }
                    }
                }
            }
            
            MenCatAllContainer.innerHTML += MenAllContent
            }

        if (cat.id == 48) {
            let GirlsAllContent = `
                            <div class="product-categories-title">
                            ${!cat.main_category && cat.id == 48 ? `<h3> ${cat.main_cat} </h3>
                            </div>` : '' }
          
                            `
            if (cat.category_name == cat.main_cat) {
                for (let SUBCAT_ID of cat.cat_name) {
                    for (let GirlsCat of CategoryData) {
                        if (GirlsCat.id == SUBCAT_ID) {
                            GirlsAllContent += `
                            <div class="product-categories-menu">
                                <ul>
                                    <li><a  data-category=${GirlsCat.id} > ${GirlsCat.category_name} </a></li>                                  
                                </ul>
                            </div>`     
    
    
                           
                        }
                    }
                }
            }
            
            GirlsCatAllContainer.innerHTML += GirlsAllContent
            

        }
    }
});

const categoryFiltersContainer = document.getElementById('MenuCat');

const WomenSubCATContainer = document.getElementById('ProductAllCategoryWomen')

const MenSubCATContainer = document.getElementById('ProductAllCategoryMen')

const GirlsSubCATContainer = document.getElementById('ProductAllCategoryGirls')

categoryFiltersContainer.addEventListener('click', handleCategoryFilter);
WomenSubCATContainer.addEventListener('click', handleSubWomenCategoryFilter);
MenSubCATContainer.addEventListener('click', handleSubMenCategoryFilter)
GirlsSubCATContainer.addEventListener('click', handleSubMenCategoryFilter)

// Step 2: Define the event handler function
function handleCategoryFilter(event) {
  
    const selectedCategoryId = event.target.dataset.category;

    // Step 3: Construct the API URL with the selected category ID as a query parameter
    const apiUrl = `http://localhost:8000/api/product/product_versions/?subcat=${selectedCategoryId}`;
    const url = `http://127.0.0.1:8000/en/shop/?subcat=${selectedCategoryId}`
  if (selectedCategoryId) {
    window.location.href = url
}
    // Step 4: Use the Fetch API to make a GET request to the API endpoint
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        displayResults(data);
      })
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

function handleSubWomenCategoryFilter(event){
    const selectedCategoryId = event.target.dataset.category;

    const apiUrl = `http://localhost:8000/api/product/product_versions/?cat=${selectedCategoryId}`;

    const url = `http://127.0.0.1:8000/en/shop/?cat=${selectedCategoryId}`
  if (selectedCategoryId) {
    window.location.href = url
}

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        displayResults(data);
      })
      .catch(error => {
        console.error('Error:', error);
      })
      

}

function handleSubMenCategoryFilter(event){
    const selectedCategoryId = event.target.dataset.category;

    const apiUrl = `http://localhost:8000/api/product/product_versions/?cat=${selectedCategoryId}`;

    const url = `http://127.0.0.1:8000/en/shop/?cat=${selectedCategoryId}`
  if (selectedCategoryId) {
    window.location.href = url
}

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        displayResults(data);
      })
      .catch(error => {
        console.error('Error:', error);
      })
      

}

