// Session base login işlemleri
document.getElementById('LoginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    this.submit();
});

// Token generate işlemleri
LoginForm.addEventListener('submit', async function(e){
    e.preventDefault();

    let postData = {
        'username' : document.getElementById('id_username').value,
        'password' : document.getElementById('id_password').value
    };

    console.log(5);

    let response = await fetch('http://localhost:8000/auth/token/', {
        method: 'POST',
        body: JSON.stringify(postData),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let resData = await response.json();
    console.log(resData);

    if (!response.ok) {
        alert(resData.detail);
    } else {
        localStorage.setItem('token', resData.access);
    }

    console.log(response);
});
