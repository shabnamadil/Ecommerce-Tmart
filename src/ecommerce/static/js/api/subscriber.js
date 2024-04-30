let newsletter = document.getElementById('subscriber-form');
let email = document.getElementById('mce-EMAIL');
let alert_news = document.getElementById('alert_newsletter');


newsletter.addEventListener('submit', async function(e){
    e.preventDefault();
    let formData = new FormData(newsletter);
    
    try {
        if (formData.get('email') === '') {
            alert_news.innerHTML = ''
            alert_news.innerHTML = `
                <div class="alert alert-danger">
                    <strong>This field cannot be empty!</strong>
                </div>`;
            return; // Stop further execution
        } else if (!formData.get('email').endsWith('@gmail.com')) {
            alert_news.innerHTML = ''
            alert_news.innerHTML = `
                <div class="alert alert-danger">
                    <strong>This field has to be gmail!</strong>
                </div>`;
            return; // Stop further execution
        } 
        let response = await fetch('http://localhost:8000/api/core/newsletter/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': newsletter.csrfmiddlewaretoken.value
            },
            body: JSON.stringify({'email': formData.get('email')})
        });
        let data = await response.json();
        newsletter.reset();

        if (response.status === 201) {
            newsletter.innerHTML = '';
            newsletter.innerHTML += `
                <div class="alert alert-success">
                    <strong>You subscribed successfully!</strong>
                </div>`;
        } else if (response.status === 400) {                    
            // Check the error message in the console
            if (data && data.message) {
                alert_news.innerHTML = ''
                alert_news.innerHTML += `
                    <div class="alert alert-danger">
                        <strong>${data.message}</strong>
                    </div>`;
            
            }else {
                alert_news.innerHTML = '';
                alert_news.innerHTML += `
                    <div class="alert alert-danger">
                        <strong>An error occurred.</strong>
                    </div>`;
            }
        } else {
            alert_news.innerHTML = '';
            alert_news.innerHTML += `
                <div class="alert alert-danger">
                    <strong>An error occurred.</strong>
                </div>`;
        }
    } catch (error) {
        console.error('Error:', error);
        alert_news.innerHTML = '';
        alert_news.innerHTML += `
            <div class="alert alert-danger">
                <strong>An error occurred.</strong>
            </div>`;
    }
});
