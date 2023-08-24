let ContactCreationForm = document.querySelector('#ContactCreationForm')
let success = document.getElementById('success-message')
let alert = document.getElementById('alert_message')
ContactCreationForm.addEventListener('submit', async function(event){
    event.preventDefault()
    let formData = new FormData(ContactCreationForm)
    try {
    let response = await fetch('http://localhost:8000/api/core/contacts/', {
        method : 'POST',
        'X-CSRFToken' : ContactCreationForm.csrfmiddlewaretoken.value,
        body : formData
    })
    
    if (formData.get('name') === '' || (formData.get('email') === '') || (formData.get('subject') === '') || (formData.get('message') === '') ) {
      success.innerHTML = '';
      alert.innerHTML = '';
      alert.innerHTML = `
        <div class="alert alert-danger">
          <strong>All fields have to be filled!</strong>
        </div>`;
      return; // Stop further execution
    } else if (!formData.get('email').endsWith('@gmail.com')) {
      success.innerHTML = ''
      alert.innerHTML = ''
      alert.innerHTML = `
          <div class="alert alert-danger">
              <strong>Your email field has to be gmail!</strong>
          </div>`;
      return; // Stop further execution
  } 
      if (response.ok) {
        success.innerHTML = ''
        alert.innerHTML = ''
          success.innerHTML += `
              <div class="alert alert-success">
                <strong >Thank you for your message!
                As soon as possible<br>
                we will get in touch with you...</strong>
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
                  </div>`;
          }
      }
    ContactCreationForm.reset()
  } catch (error) {
    console.error('Error:', error);
    alert.innerHTML = '';
    success.innerHTML = '';
    alert.innerHTML += `
      <div class="alert alert-danger">
        <strong>An error occurred.</strong>
      </div>`;
  }
});
