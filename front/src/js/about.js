import { navigateTo } from "./main.js";
import { eventRegistry } from "./main.js";
import { syncSession } from "./main.js";

export function initAboutPage() {
  document.querySelectorAll('img, p, a, div, button').forEach(function(element) {
    element.setAttribute('draggable', 'false');
  });
  const switchCheckbox = document.getElementById("2fa-switch");
  async function fetchUserData() {
    let token = localStorage.getItem("jwtToken");
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
        switchCheckbox.checked = userData.is_2fa_enabled;
        console.log(profilePicture, userData);
        updateUserDisplay(userData, profilePicture);
        attachUserMenuListeners();
      } else {
        console.error("Failed to fetch user data:", response.statusText); // Error handling
        localStorage.removeItem('jwtToken');
        syncSession();
        navigateTo("login");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      // localStorage.removeItem('jwtToken');
      // syncSession();
      // navigateTo("login");
    }
  }

  function renderUser(userData, profilePicture) {
    return `
          <button class="user btn p-2 no-border">
            <div class="d-flex align-items-center gap-2">
              <!-- Profile Image -->
              <div id="toggler">
            <div class="users-container">
              <img src="./src/assets/home/border.png" alt="" class="users-border">
              <img src="${profilePicture}" alt="Profile Image" class="rounded-circle users" id="profilePicture">
              <p class="level text-white text-decoration-none" draggable="false">
                  <strong draggable="false">${userData.level}</strong>
                </p>
              </div>

            <!-- User Name -->
            <div class="UserProfile">
              <p class="text-white text-decoration-none" id="profileN">
                <strong>${userData.nickname}</strong>
              </p>
            </div>
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
    const userProfileButtonContainer = document.getElementById("user-profile-button");
    userProfileButtonContainer.innerHTML = renderUser(userData, profilePicture);
  }

  fetchUserData();

  const developerCards = document.getElementById("developer-cards");

  const developers = [
    {
      name: "John Doe",
      role: "Frontend Developer",
      description: "Specializes in React and UI/UX design.",
      image: "https://i.pravatar.cc/160?img=3",
      github: "https://github.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe"
    },
    {
      name: "Jane Smith",
      role: "Backend Developer",
      description: "Loves building APIs and databases.",
      image: "https://i.pravatar.cc/160?img=3",
      github: "https://github.com/janesmith",
      linkedin: "https://linkedin.com/in/janesmith"
    },
    {
      name: "Jane Smith",
      role: "Backend Developer",
      description: "Loves building APIs and databases.",
      image: "https://i.pravatar.cc/160?img=3",
      github: "https://github.com/janesmith",
      linkedin: "https://linkedin.com/in/janesmith"
    },
    {
      name: "Jane Smith",
      role: "Backend Developer",
      description: "Loves building APIs and databases.",
      image: "https://i.pravatar.cc/160?img=3",
      github: "https://github.com/janesmith",
      linkedin: "https://linkedin.com/in/janesmith"
    }
    // Add more developers as needed
  ];

  developers.forEach((developer) => {
    const card = document.createElement("div");
    card.classList.add("col-md-6", "col-lg-3", "developer-card", "mx-auto", "mb-3");

    // Card inner wrapper
    const cardInner = document.createElement("div");
    cardInner.classList.add("developer-card-inner");

    // Card front
    const cardFront = document.createElement("div");
    cardFront.classList.add("developer-card-front");

    const image = document.createElement("img");
    image.src = developer.image;
    image.alt = developer.name;
    image.classList.add("img-fluid", "rounded-circle"); // Ensure responsive image

    const name = document.createElement("h3");
    name.textContent = developer.name;

    const role = document.createElement("p");
    role.textContent = developer.role;

    cardFront.appendChild(image);
    cardFront.appendChild(name);
    cardFront.appendChild(role);

    // Card back
    const cardBack = document.createElement("div");
    cardBack.classList.add("developer-card-back");

    const description = document.createElement("p");
    description.textContent = developer.description;

    const socialIcons = document.createElement("div");
    socialIcons.classList.add("social-icons");

    const githubLink = document.createElement("a");
    githubLink.href = developer.github;
    githubLink.target = "_blank";
    githubLink.innerHTML = `<i class="fab fa-github"></i>`;

    const linkedinLink = document.createElement("a");
    linkedinLink.href = developer.linkedin;
    linkedinLink.target = "_blank";
    linkedinLink.innerHTML = `<i class="fab fa-linkedin"></i>`;

    socialIcons.appendChild(githubLink);
    socialIcons.appendChild(linkedinLink);

    cardBack.appendChild(description);
    cardBack.appendChild(socialIcons);

    // Combine front and back into card
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    developerCards.appendChild(card);
  });


  /******************************************************************************** */
  const homebtn = document.getElementsByClassName("home");
  if (homebtn[0]) {
    function handlea(event) {
      event.preventDefault();
      navigateTo("home");
    };
    homebtn[0].addEventListener("click", handlea);
    eventRegistry.push({
      element: homebtn[0],
      eventType: "click",
      handler: handlea
    });
  }

  const homeButton = document.getElementById("home");
  if (homeButton) {
    function handleb(event) {
      event.preventDefault();
      navigateTo("home");
    };
    homeButton.addEventListener("click", handleb);
    eventRegistry.push({
      element: homeButton,
      eventType: "click",
      handler: handleb
    });
  }

  const leaderboardButton = document.getElementById("leaderboard");
  if (leaderboardButton) {
    function handlec(event) {
      event.preventDefault();
      navigateTo("leaderboard");
    };
    leaderboardButton.addEventListener("click", handlec);
    eventRegistry.push({
      element: leaderboardButton,
      eventType: "click",
      handler: handlec
    });
  }

  const aboutButton = document.getElementById("about");
  if (aboutButton) {
    function handled(event) {
      event.preventDefault();
      navigateTo("about");
    };
    aboutButton.addEventListener("click", handled);
    eventRegistry.push({
      element: aboutButton,
      eventType: "click",
      handler: handled
    });
  }
  // if (document.getElementsByClassName("profil")) {
  // const profilButton = document.getElementsByClassName("profil");
  // if (profilButton[0]) {
  //   profilButton[0].addEventListener("click", function (event) {
  //     event.preventDefault();
  //     navigateTo("profil");
  //   });
  // }
  // Function to attach event listeners when elements exist
  function attachUserMenuListeners() {
    const userContainer = document.getElementById("toggler");
    const userMenu = document.getElementById("user-menu");
    if (userContainer && userMenu) {
      function handlej(event) {
        userMenu.classList.toggle("visible");
        if (userMenu.classList.contains("visible")) {
          userMenu.classList.remove("hidden");
        }
      }
      userContainer.addEventListener("click", handlej);
      eventRegistry.push({
        element: userContainer,
        eventType: "click",
        handler: handlej
      });

      // Close dropdown menu when clicking outside of the user container
      function handlek(event) {
        if (!userMenu.contains(event.target) && !userContainer.contains(event.target)) {
          userMenu.classList.remove("visible");
          userMenu.classList.add("hidden");
        }
      }
      window.addEventListener("click", handlek);
      eventRegistry.push({
        element: window,
        eventType: "click",
        handler: handlek
      });
    }

    // Delegated event listener for "View Profile" and "Log Out" clicks
    async function handlel(event) {
      
      const clickedItem = event.target.closest('.dropdown-item');

      if (!clickedItem) return;

      // Check which specific dropdown item was clicked
      if (clickedItem.querySelector("#view-profile")) {
        console.log("Viewing profile...");
        navigateTo("profil");
      }

      if (clickedItem.querySelector("#log-out")) {
        console.log("Logging out...");
        localStorage.removeItem('jwtToken');
        syncSession();
        navigateTo("landing");
      }
    }
    document.body.addEventListener("click", handlel);
    eventRegistry.push({
      element: document.body,
      eventType: "click",
      handler: handlel
    });

    async function handlehone(event) {
      console.log("change event INSIDE");
        if (event.target.classList.contains("input")) {
          const checkbox = event.target;
          const isChecked = checkbox.checked;
          const action = isChecked ? "enable" : "disable";
  
          try {
            console.log("ACTION : ", action);
            const response = await fetch(`http://0.0.0.0:8000/2fa/${action}/`, {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
                "Content-Type": "application/json",
              },
            });
  
            if (response.ok) {
              console.log(`2FA ${action}d successfully.`);
            } else {
              console.error("Request failed. Reverting switch state.");
              checkbox.checked = !isChecked; // Revert state if request fails
            }
          } catch (error) {
            console.error("Error occurred:", error);
            checkbox.checked = !isChecked; // Revert state if an error occurs
          }
        }
      }
      document.addEventListener("change", handlehone);
      eventRegistry.push({
        element: document,
        eventType: "change",
        handler: handlehone
      });
  }
  // }
  /******************************************************************************** */
}
