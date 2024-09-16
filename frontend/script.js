// Get the password input and toggle button
const passwordInput = document.getElementsByClassName('passwordInput');
const passwordToggleBtn = document.getElementsByClassName('passwordToggleBtn');
const passwordSimilar1 = document.getElementById("passW1");
const passwordSimilar2 = document.getElementById("passW2");

// shifting
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// Add event listener to toggle button
for (let i = 0; i < passwordToggleBtn.length; i++) {
    passwordToggleBtn[i].addEventListener('click', function() {
    console.log('Toggle button clicked');
    // Toggle password visibility
    if (passwordInput[i].type === 'password') {
        passwordInput[i].type = 'text';
        passwordToggleBtn[i].innerHTML = '<i class="bi bi-eye" style="color: black;"></i>';
    } else {
        passwordInput[i].type = 'password';
        passwordToggleBtn[i].innerHTML = '<i class="bi bi-eye-slash" style="color: black;"></i>';
    }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('signUpForm').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default signUp submission
        if (passwordSimilar1.value != passwordSimilar2.value)
        {
            alert('Password does not meet the requirements.');
            return; // Stop further execution
        }
        const formData = new FormData(this);
        console.log(formData.get('nickname'));
        console.log(formData.get('password'));
        console.log(formData.get('email'));
        console.log(formData);
        try {
            let response = await fetch('http://127.0.0.1:8000/signup/', { // Specify the server endpoint directly
                headers: {
                    'Content-Type': 'application/json', // Ensure the content type is set to JSON
                    'Accept': 'application/json'        // Optionally, specify the format you want the response in
                },
                method: 'POST',
                body: formDataToJson(formData)
            })
            let rewind = await response.json();
            console.log("Response : ", rewind);
            if (response.ok) {
                document.location.href = 'http://localhost:8000/';
            }
        } catch (error) {
            console.error("Error : ", error);
        }
    });
    document.getElementById('signInForm').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default form submission
        const formData = new FormData(this);
        
        try {
            let response = await fetch('http://127.0.0.1:8000/signin/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                method: 'POST',
                body: formDataToJson(formData)
            });
            
            let result = await response.json();
            console.log("Response : ", result);
            
            if (response.ok) {
                // Store JWT tokens in cookies
                document.cookie = `access=${result.access}; path=/;`;
                document.cookie = `refresh=${result.refresh}; path=/;`;
                
                // Redirect to home page or another page
                window.location.href = 'http://127.0.0.1:8000/';
            }
        } catch (error) {
            console.error("Error : ", error);
        }
    });
});

// This script runs when the page loads
window.onload = async function() {
    // Get the query parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    
    // Example: Extract a query parameter called 'code'
    const authCode = urlParams.get('code');    
    if (authCode) {
        // Do something with the authorization code
        console.log('Authorization Code:', authCode);
        try {
            const response = await fetch('http://127.0.0.1:8000/oauthcallback?code=' + authCode);
            console.log(response);
            if (response.ok) {
                console.log('Authentication initiated successfully');
                console.log(response);
                let r = await response.json();
                console.log(r);
                document.location.href = 'http://localhost:8000';

            } else {
                console.error('Failed to initiate 42 authentication');
            }
        } catch (error) {
            console.error('Login with 42 failed:', error);
        }
        // Display the authorization code on the webpage
        document.getElementById('message').innerText = 'Authorization Code: ' + authCode;
    } else {
        // Handle the absence of the authorization code
        console.log('No authorization code found.');
        // document.getElementById('message').innerText = 'No authorization code found.';
    }
};

async function fetchHome() {
    const accessToken = getCookie('access'); // Function to get the token from cookies
    
    try {
        let response = await fetch('http://127.0.0.1:8000/', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
            }
        });
        
        let result = await response.json();
        console.log("Response : ", result);
    } catch (error) {
        console.error("Error : ", error);
    }
}


function formDataToJson(formData) {
    const obj = {};
    formData.forEach((value, key) => {
        obj[key] = value;
    });
    return JSON.stringify(obj);
}

function createBubble() {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.style.left = `${Math.random() * 100}vw`;
    bubble.style.animationDelay = `${Math.random() * 10}s`;
    document.body.appendChild(bubble);

    setTimeout(() => {
        bubble.remove();
    }, 10000);
}

setInterval(createBubble, 300);