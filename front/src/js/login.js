import { navigateTo } from "./main.js";
// Get the password input and toggle button
export function initLoginPage() {
  const passwordInput = document.getElementsByClassName("passwordInput");
  const passwordToggleBtn =
    document.getElementsByClassName("passwordToggleBtn");
  const passwordSimilar1 = document.getElementById("passW1");
  const passwordSimilar2 = document.getElementById("passW2");

  // shifting
  const container = document.getElementById("container");
  const registerBtn = document.getElementById("register");
  const loginBtn = document.getElementById("login");

  registerBtn.addEventListener("click", () => {
    container.classList.add("active");
  });

  loginBtn.addEventListener("click", () => {
    container.classList.remove("active");
  });

  // Add event listener to toggle button
  for (let i = 0; i < passwordToggleBtn.length; i++) {
    passwordToggleBtn[i].addEventListener("click", function () {
      // console.log("Toggle button clicked");
      // Toggle password visibility
      if (passwordInput[i].type === "password") {
        passwordInput[i].type = "text";
        passwordToggleBtn[i].innerHTML =
          '<i class="bi bi-eye" style="color: black;"></i>';
      } else {
        passwordInput[i].type = "password";
        passwordToggleBtn[i].innerHTML =
          '<i class="bi bi-eye-slash" style="color: black;"></i>';
      }
    });
  }

  document
    .getElementById("signUpForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent the default signUp submission
      if (passwordSimilar1.value != passwordSimilar2.value) {
        alert("Password does not meet the requirements.");
        return; // Stop further execution
      }
      const formData = new FormData(this);
      // console.log(formData.get("nickname"));
      // console.log(formData.get("password"));
      // console.log(formData.get("email"));
      // console.log(formData);
      try {
        let response = await fetch("http://0.0.0.0:8000/signup/", {
          // Specify the server endpoint directly
          headers: {
            "Content-Type": "application/json", // Ensure the content type is set to JSON
            Accept: "application/json", // Optionally, specify the format you want the response in
          },
          method: "POST",
          body: formDataToJson(formData),
        });
        // console.log("Response : ", rewind);
        if (response.ok) {
          // let rewind = await response.json();
          navigateTo("login"); // to be changed later on
        }
      } catch (error) {
        console.error("Error : ", error);
      }
    });

  // This script runs when the page loads
  window.onload = async function () {
    // Get the query parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);

    // Example: Extract a query parameter called 'code'
    const authCode = urlParams.get("code");

    if (authCode) {
      // console.log("Authorization Code:", authCode);
      try {
        const response = await fetch(
          "http://0.0.0.0:8000/oauthcallback?code=" + authCode
        );
        if (response.ok) {
          console.log("Authentication initiated successfully");
          console.log(response);
          let rewind = await response.json();
          const token = rewind.access; // Replace with actual token retrieval
          sessionStorage.setItem("jwtToken", token);
          navigateTo("home"); // to be changed later on
        } else {
          console.error("Failed to initiate 42 authentication");
        }
      } catch (error) {
        console.error("Login with 42 failed:", error);
      }
    } else {
      // Handle the absence of the authorization code
      console.log("No authorization code found.");
    }
  };

  document
    .getElementById("loginForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent the default signUp submission
      const formData = new FormData(this);
      // console.log(formData.get("nickname"));
      // console.log(formData.get("password"));
      // console.log(formData.get('email'));
      // console.log(formData);
      try {
        let response = await fetch("http://0.0.0.0:8000/signin/", {
          // Specify the server endpoint directly
          headers: {
            "Content-Type": "application/json", // Ensure the content type is set to JSON
            Accept: "application/json", // Optionally, specify the format you want the response in
          },
          method: "POST",
          body: formDataToJson(formData),
        });
        if (response.ok) {
          let rewind = await response.json();
          // console.log("Response : ", rewind, "||", response);
          const token = rewind.access;
          sessionStorage.setItem("jwtToken", token);
          navigateTo("home");
        }
      } catch (error) {
        console.error("Error : ", error);
      }
    });

  function formDataToJson(formData) {
    const obj = {};
    formData.forEach((value, key) => {
      obj[key] = value;
    });
    return JSON.stringify(obj);
  }

  const signInForm = document.querySelector(".sign-in");
  const signUpForm = document.querySelector(".sign-up");
  const toSignupButton = document.getElementById("to-signup");
  const toSigninButton = document.getElementById("to-signin");

  // signUpForm.style.display = "none";

  toSignupButton.addEventListener("click", (e) => {
    e.preventDefault();
    signUpForm.style.display = "block";
    signInForm.style.display = "none";
  });

  // Toggle to show sign-in form
  toSigninButton.addEventListener("click", (e) => {
    e.preventDefault();
      signInForm.style.display = "block";
      signUpForm.style.display = "none";
  });

// Function to check window width and remove class
function checkWindowSize() {  
  if (window.innerWidth < 768) {
    container.classList.remove("active");
  } else {
    signInForm.style.display = "block";
    signUpForm.style.display = "block";
  }
}

window.addEventListener("resize", checkWindowSize);

checkWindowSize();
}