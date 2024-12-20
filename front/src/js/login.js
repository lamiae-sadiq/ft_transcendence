import { navigateTo } from "./main.js";
// Get the password input and toggle button
export function initLoginPage() {
  const passwordInput = document.getElementsByClassName("passwordInput");
  const passwordToggleBtn =
    document.getElementsByClassName("passwordToggleBtn");
  const passwordSimilar1 = document.getElementById("passW1");
  const passwordSimilar2 = document.getElementById("passW2");
  const email = document.getElementById("email");
  const name = document.getElementById("name");

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
        return;
      }
      const formData = new FormData(this);
      console.log("FORM: ", formData);
      try {
        let response = await fetch("http://localhost:8000/signup/", {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          method: "POST",
          body: formDataToJson(formData),
        });
        if (response.ok) {
          passwordSimilar1.value = "";
          name.value = "";
          email.value = "";
          passwordSimilar2.value = "";
          container.classList.remove("active");
        }
        else {
          alert("The nickname you entered is already in use. Please choose a different nickname.");
        }
      } catch (error) {
        alert("Account creation failed. Please try again.");
      }
    });

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
        let response = await fetch("http://localhost:8000/signin/", {
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
          const token = rewind.access; // JWT token from backend
          // Set the cookie to expire in 7 days
          // const date = new Date();
          // date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
          // document.cookie = `jwtToken=${token}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
          // console.log(document.cookie);
          localStorage.setItem("jwtToken", token);
          console.log("TOKEN in login page: ",localStorage.getItem("jwtToken"));
          navigateTo("home");
        }
        else {
          alert("Incorrect nickname or password. Please try again.");
        }
      } catch (error) {
        console.error("Error occured: ", error);
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