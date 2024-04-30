window.addEventListener('load', async function(e) {
  let response_categories = await fetch('http://localhost:8000/api/categories/');
  let resData = await response_categories.json();
  let categories = document.querySelector('#blog_category');
  for (category of resData) {
    categories.innerHTML += `
      <ul class="categore-menu">
        <li><a data-category="${category.id}" id="cat"><i class="zmdi zmdi-caret-right"></i>${category.category_name}<span>${category.blog.length}</span></a></li>
      </ul>
    `;
  }
})

// Step 1: Attach event listener to the parent element of category filters
const categoryFiltersContainer = document.querySelector('#blog_category');

categoryFiltersContainer.addEventListener('click', handleCategoryFilter);

// Step 2: Define the event handler function
function handleCategoryFilter(event) {
  
    const selectedCategoryId = event.target.dataset.category;

    // Step 3: Construct the API URL with the selected category ID as a query parameter
    const apiUrl = `http://localhost:8000/api/blogs/?category=${selectedCategoryId}`;
    const url = `http://localhost:8000/blog/?category=${selectedCategoryId}`
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


// Step 3: Display the filtered results
function displayResults(results) {
  const resultsContainer = document.getElementById('blogs');
  resultsContainer.innerHTML = '';

  if (results.length === 0) {
    resultsContainer.innerHTML = '<p>No results found for the selected category.</p>';
  } else {
    for (const blog of results) {
      const blogElement = document.createElement('div');
      blogElement.classList.add('blog', 'foo');
      blogElement.innerHTML = `
                  <div class="blog__inner">
                    <div class="blog__thumb">
                      <a href="${blog.get_absolute_url}">
                        <img src="${blog.image}" alt="blog images">
                      </a>
                      <div class="blog__post__time">
                        <div class="post__time--inner">
                          <span class="date">${blog.published_day}</span>
                          <span class="month">${blog.published_month}</span>
                        </div>
                      </div>
                    </div>
                    <div class="blog__hover__info">
                      <div class="blog__hover__action">
                        <p class="blog__des"><a href="${blog.get_absolute_url}">${blog.title}</a></p>
                        <ul class="bl__meta">
                          <li> By :<a href="#">${blog.blog_user}</a></li>
                          <li>${blog.category.category_name}</li>
                        </ul>
                        <div class="blog__btn">
                          <a class="read__more__btn" href="${blog.get_absolute_url}">read more</a>
                        </div>
                      </div>
                    </div>
                  </div>
      `;

      resultsContainer.appendChild(blogElement);
    }
  }
}






let CommentCreationForm = document.getElementById('CommentCreationForm');
let success = document.getElementById('success');
let alert = document.getElementById('alert');
CommentCreationForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    let token = localStorage.getItem('token');
    
    let formData = new FormData(CommentCreationForm);
    try {
        let response = await fetch('http://localhost:8000/api/comments/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,     
            },
            body: formData
        });

        if (response.ok) {
          success.innerHTML = ''
          alert.innerHTML = ''
            success.innerHTML += `
                <div class="alert alert-success">
                    <strong>Your comment has been published successfully!<br>Thank you</strong>
                </div>`;
                
        } else {
            let data = await response.json();
            if (data && data.message) {
              alert.innerHTML = ''
              success.innerHTML = ''
                alert.innerHTML += `
                    <div class="alert alert-danger">
                        <strong>${data.message}</strong>
                    </div>`;
            } else {
              alert.innerHTML = ''
              success.innerHTML = ''
                alert.innerHTML += `
                    <div class="alert alert-danger">
                        <strong>An error occurred.</strong>
                    </div>
                    `;
            }
        }

        CommentCreationForm.reset();
 

        // Fetch updated comments
        let commentsResponse = await fetch('http://localhost:8000/api/comments/');
        let commentData = await commentsResponse.json();

        let comments = document.querySelector('#comments');
        // Clear existing comments

        if (Array.isArray(commentData) && commentData.length > 0) {
          if(response.ok) {
            console.log(commentData.length)
                comments.innerHTML += `
                    <div class="blog-comment-inner"> 
                    
                        <div class="single-blog-comment">
                            <div class="blog-comment-thumb">
                                <img src="{% static 'images/comment/1.jpg' %}" alt="comment images">
                            </div>
                            <div class="blog-comment-details">
                                <div class="comment-title-date">
                                    <h2><a href="#">${commentData[0].comment_user}</a></h2>                                           
                                    <div class="reply">                                              
                                        <p>${commentData[0].comment_time} / <a href="#">REPLY</a></p>
                                    </div>
                                </div>
                                <p>${commentData[0].message}</p>
                            </div>
                        </div>
                    </div>`;
 
        }}

    } catch (error) {
        console.error('Error:', error);
        success.innerHTML = ''
        alert.innerHTML = ''
        alert.innerHTML += `
            <div class="alert alert-danger">
                <strong>An error occurred.</strong>
            </div>`;
    }

});


const searchForm = document.getElementById('SearchForm');
const searchInput = document.getElementById('search-input');

searchForm.addEventListener('submit', redirectToResultsPage);

function redirectToResultsPage(event) {
  event.preventDefault(); // Formun göndərilməsini dayandır
  
  const searchTerm = searchInput.value;
  if (searchTerm) {
  const url = `http://localhost:8000/blog/?search=${searchTerm}`;

  window.location.href = url;
}}

// Səhifə yükləndikdə, axtarış parametrlərini yoxlayır və axtarış nəticələrini göstərir
window.addEventListener('DOMContentLoaded', handleSearchResults);

function handleSearchResults() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get('search');

  if (searchTerm) {
    const apiUrl = `http://localhost:8000/api/blogs/?search=${encodeURIComponent(searchTerm)}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        
        displayResults(data);

      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
}

function displayResults(results) {
  const resultsContainer = document.getElementById('blogs');

  if (results.length === 0) {
    resultsContainer.innerHTML = '<p>No results found.</p>';
  } else {
    resultsContainer.innerHTML = '';

    for (const blog of results) {
      const blogElement = document.createElement('div');
      blogElement.classList.add('blog', 'foo');
      blogElement.innerHTML = `
        <div class="blog__inner">
          <div class="blog__thumb">
            <a href="${blog.get_absolute_url}">
              <img src="${blog.image}" alt="blog images">
            </a>
            <div class="blog__post__time">
              <div class="post__time--inner">
                <span class="date">${blog.published_day}</span>
                <span class="month">${blog.published_month}</span>
              </div>
            </div>
          </div>
          <div class="blog__hover__info">
            <div class="blog__hover__action">
              <p class="blog__des"><a href="${blog.get_absolute_url}">${blog.title}</a></p>
              <ul class="bl__meta">
                <li> By :<a href="#">${blog.blog_user}</a></li>
                <li>${blog.category.category_name}</li>
              </ul>
              <div class="blog__btn">
                <a class="read__more__btn" href="${blog.get_absolute_url}">read more</a>
              </div>
            </div>
          </div>
        </div>
      `;

      resultsContainer.appendChild(blogElement);
    }
  }
}


