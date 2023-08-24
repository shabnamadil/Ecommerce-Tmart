let CheckoutForm = document.getElementById('CheckoutForm');

CheckoutForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    let token = localStorage.getItem('token');
    let formData = new FormData(CheckoutForm);

    if (token) {
        try {
            let response = await fetch('http://localhost:8000/api/order/checkout/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });
            CheckoutForm.reset()
            if (response.ok) {
                document.getElementById('form-button').classList.add("hidden");
                document.getElementById('payment-info').classList.remove("hidden")

                // Handle the successful response
                console.log('Checkout success');
            } else {
                // Handle the error response
                console.error('Checkout failed');
            }
        } catch (error) {
            // Handle any network or other errors
            console.error('An error occurred during checkout', error);
        }
    } else {
        console.error('Token not available');
    }
});

