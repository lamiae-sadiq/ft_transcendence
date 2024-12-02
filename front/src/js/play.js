import { navigateTo } from "./main.js";

export function initPlayPage() {
  const modeItems = document.querySelectorAll(".mode-item");
  const confirmButton = document.getElementById("confirmButton");

  modeItems.forEach((item) => {
    const image = item.querySelector(".mode-image");
    const description = item.querySelector(".mode-description");

    image.addEventListener("click", () => {
      // Hide all descriptions first
      document.querySelectorAll(".mode-description").forEach((desc) => {
        desc.classList.remove("active");
      });

      // Show clicked item's description
      description.classList.add("active");
    });
  });

  confirmButton.addEventListener("click", () => {
    const activeMode = document.querySelector(".mode-description.active");
    if (activeMode) {
      const modeName =
        activeMode.parentElement.querySelector(".mode-title").textContent;
        console.log("First one");
        navigateTo('game', { mode: modeName });
    } else {
      alert("Please select a game mode first!");
    }
  });
  /******************************************************************************** */
  const homebtn = document.getElementsByClassName("home");
  if (homebtn[0]) {
    homebtn[0].addEventListener("click", function (event) {
      event.preventDefault();
      navigateTo("home");
    });
  }
  
  const homeButton = document.getElementById("home");
  if (homeButton) {
    homeButton.addEventListener("click", function (event) {
      event.preventDefault();
      navigateTo("home");
    });
  }

  const leaderboardButton = document.getElementById("leaderboard");
  if (leaderboardButton) {
    leaderboardButton.addEventListener("click", function (event) {
      event.preventDefault();
      navigateTo("leaderboard");
    });
  }

  const aboutButton = document.getElementById("about");
  if (aboutButton) {
    aboutButton.addEventListener("click", function (event) {
      event.preventDefault();
      navigateTo("about");
    });
  }
  // if (document.getElementsByClassName("profil")) {
    const profilButton = document.getElementsByClassName("profil");
    if (profilButton[0]) {
      profilButton[0].addEventListener("click", function (event) {
        event.preventDefault();
        navigateTo("profil");
      });
    }

  async function fetchUserData() {
    let token = sessionStorage.getItem("jwtToken");
    console.log(token);
    try {
      let response = await fetch("http://0.0.0.0:8000/userinfo/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      if (response.ok) {
        let userData = await response.json();
        console.log(userData);
        // Decrypt the profile picture and update the user display
        let profilePicture = "http://0.0.0.0:8000/" + userData.profile_picture;
        console.log(profilePicture, userData);
        updateUserDisplay(userData, profilePicture);
      } else {
        console.error("Failed to fetch user data:", response.statusText); // Error handling
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  }

  function renderUser(userData, profilePicture) {
    return `
        <button class="user btn p-2 no-border">
          <div class="d-flex align-items-center gap-2">
            <!-- Profile Image -->
            <div class="users-container">
              <img src="./src/assets/home/border.png" alt="" class="users-border">
              <img src="${profilePicture}" alt="Profile Image" class="rounded-circle users">
              <!-- <p class="level"></p> -->
            </div>

            <!-- User Name -->
            <div class="UserProfile">
              <a href="" class="text-white text-decoration-none"><strong>${userData.nickname}</strong></a>
            </div>

            <!-- Notification Icon -->
            <div class="Notifications">
              <i class="bi bi-bell-fill text-white"></i>
            </div>
          </div>
        </button>
      `;
  }

  function updateUserDisplay(userData, profilePicture) {
    let userContainer = document.getElementById("user-container");
    userContainer.innerHTML = renderUser(userData, profilePicture);
  }
  fetchUserData();
  // }
  /******************************************************************************** */
}