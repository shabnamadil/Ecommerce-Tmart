let ReviewCreationForm = document.querySelector('#ReviewCreationForm');
let success = document.getElementById('review_success');
let alert = document.getElementById('review_alert');

ReviewCreationForm.addEventListener('submit', async function(event) {
  event.preventDefault();
  let token = localStorage.getItem('token');
  let formData = new FormData(ReviewCreationForm);
  
  // Check if the required field is empty
  if (formData.get('review') === '') {
    success.innerHTML = '';
    alert.innerHTML = '';
    alert.innerHTML = `
      <div class="alert alert-danger">
        <strong>Your reveiw field cannot be empty.</strong>
      </div>`;
    return; // Stop further execution
  }

  try {
    let response = await fetch('http://localhost:8000/api/product/reviews/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });

    if (response.ok) {
      success.innerHTML = '';
      alert.innerHTML = '';
      success.innerHTML += `
        <div class="alert alert-success">
          <strong>Your review has been published successfully!<br>Thank you</strong>
        </div>`;
    } else {
      let data = await response.json();
      if (data && data.message) {
        alert.innerHTML = '';
        success.innerHTML = '';
        alert.innerHTML += `
          <div class="alert alert-danger">
            <strong>${data.message}</strong>
          </div>`;
      } else {
        alert.innerHTML = '';
        success.innerHTML = '';
        alert.innerHTML += `
          <div class="alert alert-danger">
            <strong>An error occurred.</strong>
          </div>`;
      }
    }

    ReviewCreationForm.reset();

    let reviews = document.querySelector('#review');
    let response_reviews = await fetch('http://localhost:8000/api/product/reviews/');
    let reviewData = await response_reviews.json();

    if (Array.isArray(reviewData) && reviewData.length > 0) {
      if (response.ok) {
            let rating = reviewData[0].rating;
            let stars = '';

            for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fa fa-star" aria-hidden="true"></i>';
            } else if (i - 0.5 <= rating) {
                stars += '<i class="fa fa-star-half-o" aria-hidden="true"></i>';
            } else {
                stars += '<i class="fa fa-star-o" aria-hidden="true"></i>';
            }
            }

        reviews.innerHTML += `
          <div class="pro__review">
            <div class="review__thumb">
  
            </div>
            <div class="review__details">
              <div class="review__info">
                <h4><a href="">${reviewData[0].review_user}</a></h4>
                    <div class="rating">
                        <div class="rating-star">
                            <span id="mySpan" title="">
                                ${stars}
                            </span>
                        </div>
                    </div>
                <div class="rating__send">
                  <a href="#"><i class="zmdi zmdi-mail-reply"></i></a>
                  <a href="#"><i class="zmdi zmdi-close"></i></a>
                </div>
              </div>
              <div class="review__date">
                <span>${reviewData[0].review_time}</span>
              </div>
              <p>${reviewData[0].review}</p>
            </div>
          </div>`;
      }
    }
  } catch (error) {
    console.error('Error:', error);
    success.innerHTML = '';
    alert.innerHTML = '';
    alert.innerHTML += `
      <div class="alert alert-danger">
        <strong>An error occurred.</strong>
      </div>`;
  }
});


window.addEventListener('load', async function(e) {
  
  let response_product = await fetch(`http://localhost:8000/api/product/product_versions/?ProductId=${ProductId}`)
  let resProduct = await response_product.json()
  let colors = document.getElementById('DetailPageColorFilter')
  let sizes = document.getElementById('DetailPageSizeFilter')
  for (let product of resProduct) {
    for (let filter of product.property_value) {
      colors.innerHTML += `
        ${filter.product_value.property_name == 'color' ? `<li class="${filter.value_name}"><a data-color=${filter.id} ><i data-color=${filter.id} class="zmdi zmdi-circle"></i></a></li>` : ''}
      `;
    }
  }

  colors.addEventListener('click', async function(e) {
    let ColorId = e.target.dataset.color;
    let responseP = await fetch(`http://localhost:8000/api/product/product_versions/?ProductId=${ProductId}&color=${ColorId}`);
    let resPData = await responseP.json();

    sizes.innerHTML = ''; // Sizeları sıfırlayın ki, seçimlərdən əvvəlki sizelar qalmasın
    for (let product of resPData) {
      for (let filter of product.property_value) {
        if (filter.product_value.property_name == 'size') {
          sizes.innerHTML += `
            <li data-size=${filter.id} ><a data-size=${filter.id}>${filter.value_name}</a></li>
          `;
        }
      }
    }
  });

  // let WishHeart = document.getElementById('WishHeart')
  // WishHeart.addEventListener('click', updateWishList)
});


const colorFiltersContainer = document.getElementById('DetailPageColorFilter')
colorFiltersContainer.addEventListener('click', handleColorFilter)

function handleColorFilter(event) {
  const ColorId = event.target.dataset.color;
  const apiUrl = `http://localhost:8000/api/product/product_versions/?color=${ColorId}&ProductId=${ProductId}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      displayResults(data);

      // Change the URL without reloading the page
      if (ProductId) {
        const newUrl = `${window.location.origin}/${data[0].get_absolute_url}`;
        history.pushState({ url: newUrl }, '', newUrl);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Handle browser back/forward navigation
window.addEventListener('popstate', function (event) {
  if (event.state && event.state.url) {
    window.location.href = event.state.url;
  }
});

function displayResults(results) {
  const resultsContainer = document.getElementById('product');
  resultsContainer.innerHTML = '';

  if (results.length === 0) {
    resultsContainer.innerHTML = '<p>No results found for the selected category.</p>';
  } else {
    for (const product of results) {
      const productElement = document.createElement('div');
      productElement.classList.add('blog', 'foo');
      
      // Small images
      let smallImagesHtml = '<ul class="product__small__images" role="tablist">';
      for (let i = 0; i < product.images.length; i++) {
        const p = product.images[i];
        const activeClass = i === 0 ? 'active' : '';
        smallImagesHtml += `
          <li role="presentation" class="pot-small-img ${activeClass}" width="200">
            <a href="#img-tab-${p.id}" role="tab" data-toggle="tab">
              <img src="${p.image}" alt="small-image">
            </a>
          </li>
        `;
      }
      smallImagesHtml += '</ul>';

      productElement.innerHTML = `
        <div class="product__details__container">
          <!-- Start Small images -->
          ${smallImagesHtml}
          <!-- End Small images -->

          <div class="product__big__images">
            <div class="portfolio-full-image tab-content" width="400">
              <div role="tabpanel" class="tab-pane fade in active product-video-position" id="img-tab-${product.id}">
                <img src="${product.main_image}" alt="full-image">
              
              </div>
            </div>
          </div>
        </div>
      `;

      resultsContainer.appendChild(productElement);
    }
  }
}

