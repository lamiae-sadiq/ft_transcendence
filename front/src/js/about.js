import { navigateTo } from "./main.js";

export function initAboutPage() {
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
          <button class="user btn p-2">
            <div class="d-flex align-items-center gap-5">
              <!-- Profile Image -->
              <div class="users-container">
                <img src="./src/assets/home/border.png" alt="" class="users-border">
                <img src="${profilePicture}" alt="Profile Image" class="rounded-circle users">
                <!-- <p class="level">${userData.level}</p> -->
              </div>
              
              <!-- User Name -->
              <div class="UserProfile">
                <a href="#profil" class="text-white text-decoration-none"><strong>${userData.nickname}</strong></a>
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
    
    const developers = [
        {
            name: "..........",
            role: "Front-end Developer",
            image: "https://placehold.co/125x125",
            description: "..... .. . . . .......... . ......... .........  .......  . . . . . .. . . . . ."
        },
        {
            name: "...........",
            role: "Back-end Developer",
            image: "https://placehold.co/125x125",
            description: "..... .. . . . .......... . ......... .........  .......  . . . . . .. . . . . ."
        },
        {
            name: "............",
            role: "..............",
            image: "https://placehold.co/125x125",
            description: "..... .. . . . .......... . ......... .........  .......  . . . . . .. . . . . ."
        },
        {
            name: "..............",
            role: ".............",
            image: "https://placehold.co/125x125",
            description: "..... .. . . . .......... . ......... .........  .......  . . . . . .. . . . . ."
        }
    ];

    const developerCards = document.getElementById("developer-cards");

    developers.forEach(developer => {
        const card = document.createElement("div");
        card.classList.add("col-md-6", "col-lg-3", "developer-card", "mx-auto", "mb-4", "text-white");

        const image = document.createElement("img");
        image.src = `${developer.image}`;
        image.alt = developer.name;
        image.classList.add("img-fluid", "rounded-circle", "mb-3");

        const name = document.createElement("h3");
        name.textContent = developer.name;

        const role = document.createElement("p");
        role.textContent = developer.role;

        const description = document.createElement("p");
        description.textContent = developer.description;

        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(role);
        card.appendChild(description);

        developerCards.appendChild(card);
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
   // }
   /******************************************************************************** */
}
