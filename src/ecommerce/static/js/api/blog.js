window.addEventListener('load', async function(e) {
    async function SearchBlog(search) {
      let url = 'http://localhost:8000/api/blogs/';
  
      if (search) {
        url += `?search=${search}`;
      }
      
      const response = await fetch(url);
      const resData = await response.json();
      const SlicedData = resData.slice(0, 3);
      const blogs = document.querySelector('#blogs');
  
      if (SlicedData.length === 0) {
        blogs.innerHTML = `
          <div class="alert alert-danger">
            <strong>No related blogs</strong>
          </div>
        `;
      }
      if (resData.length <= 3 ) {
        const loadMoreButton = document.getElementById('load-more-btn');
        loadMoreButton.style.display = 'none'
      }

      for (let blog of SlicedData) {
        blogs.innerHTML += `
          <div class="col-md-4 col-lg-4 col-sm-6 col-xs-12">
            <div class="blog foo">
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
                      <li> By: <a href="#">${blog.blog_user}</a></li>
                      <li>${blog.category.category_name}</li>
                    </ul>
                    <div class="blog__btn">
                      <a class="read__more__btn" href="${blog.get_absolute_url}">read more</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      }
    }
  
    // Check if 'search' and 'category' query parameters exist
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    const categoryQuery = urlParams.get('category');
  
    if (categoryQuery) {
      // Add category filter to the API URL
      const apiUrl = `http://localhost:8000/api/blogs/?category=${categoryQuery}`;
  
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          displayResults(data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      // Usage example:
      await SearchBlog(searchQuery);
    }
  });
  



  let currentPage = 1;
  const itemsPerPage = 3;
  let startIndex = 3;
  let endIndex = startIndex + itemsPerPage;
  const container = document.getElementById('blogs');
  
  function loadMoreData(search, category) {
    let apiUrl = `http://localhost:8000/api/blogs/?page=${currentPage}`;
  
    if (search) {
      apiUrl += `&search=${search}`;
    }
  
    if (category) {
      apiUrl += `&category=${category}`;
    }
  
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          endIndex = startIndex + itemsPerPage;
          const itemsToDisplay = data.slice(startIndex, endIndex);
          itemsToDisplay.forEach(blog => {
            container.innerHTML += `
              <div class="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                <div class="blog foo">
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
                          <li> By: <a href="#">${blog.blog_user}</a></li>
                          <li>${blog.category.category_name}</li>
                        </ul>
                        <div class="blog__btn">
                          <a class="read__more__btn" href="${blog.get_absolute_url}">read more</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `;
          });
  
          currentPage++;
          startIndex = endIndex;
        }
  
        if (startIndex >= endIndex) {
          loadMoreButton.style.display = 'none';
        } else {
          loadMoreButton.style.display = 'block';
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
    const loadMoreButton = document.getElementById('load-more-btn');
    loadMoreButton.addEventListener('click', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    const categoryQuery = urlParams.get('category');
  
    loadMoreData(searchQuery, categoryQuery);
  });
  