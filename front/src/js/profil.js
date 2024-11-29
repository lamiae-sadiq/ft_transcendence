import { navigateTo } from "./main.js";

export function initProfilPage() {
  let token = sessionStorage.getItem("jwtToken");
  let isEditing = false;

  // const achievementsContainer = document.getElementById(
  //   "achievementsContainer"
  // );
  const friendsContainer = document.getElementById("friendsContainer");

  // Mock achievements data
  // const achievements = [
  //   { name: "Master Strategist", icon: "https://i.pravatar.cc/160?img=3" },
  //   { name: "Level 50 Warrior", icon: "https://i.pravatar.cc/160?img=3" },
  //   { name: "1000 Games Played", icon: "https://i.pravatar.cc/160?img=3" },
  //   { name: "Tournament Winner", icon: "https://i.pravatar.cc/160?img=3" },
  //   { name: "Legendary Player", icon: "https://i.pravatar.cc/160?img=3" },
  //   { name: "Social Butterfly", icon: "https://i.pravatar.cc/160?img=3" },
  // ];

  // // Populate Achievements
  // achievements.forEach((achievement) => {
  //   const div = document.createElement("div");
  //   div.className = "achievement-item";
  //   div.innerHTML = `
  //           <img src="${achievement.icon}" alt="${achievement.name}" class="achievement-icon">
  //           <div>
  //               <p class="achievement-name">${achievement.name}</p>
  //           </div>
  //       `;
  //   achievementsContainer.appendChild(div);
  // });

  // Mock friends data
  const friends = [
    {
      name: "Alice",
      status: "online",
      picture: "https://i.pravatar.cc/160?img=3",
    },
    {
      name: "Bob",
      status: "offline",
      picture: "https://i.pravatar.cc/160?img=3",
    },
    {
      name: "Charlie",
      status: "online",
      picture: "https://i.pravatar.cc/160?img=3",
    },
    {
      name: "David",
      status: "offline",
      picture: "https://i.pravatar.cc/160?img=3",
    },
    {
      name: "Eve",
      status: "online",
      picture: "https://i.pravatar.cc/160?img=3",
    },
    {
      name: "Frank",
      status: "offline",
      picture: "https://i.pravatar.cc/160?img=3",
    },
    {
      name: "54y6",
      status: "offline",
      picture: "https://i.pravatar.cc/160?img=3",
    },
    {
      name: "y",
      status: "offline",
      picture: "https://i.pravatar.cc/160?img=3",
    },
    {
      name: "4",
      status: "offline",
      picture: "https://i.pravatar.cc/160?img=3",
    },
    {
      name: "y",
      status: "offline",
      picture: "https://i.pravatar.cc/160?img=3",
    },
    {
      name: "h",
      status: "offline",
      picture: "https://i.pravatar.cc/160?img=3",
    },
    {
      name: "b",
      status: "offline",
      picture: "https://i.pravatar.cc/160?img=3",
    },
    {
      name: "w",
      status: "offline",
      picture: "https://i.pravatar.cc/160?img=3",
    },
    {
      name: "p",
      status: "offline",
      picture: "https://i.pravatar.cc/160?img=3",
    },
    {
      name: "c",
      status: "offline",
      picture: "https://i.pravatar.cc/160?img=3",
    },
  ];


  const bio = document.getElementById("profileBio");
  const maxLength = 100;

  bio.addEventListener("input", () => {
    // Trim extra characters if exceeded
    if (bio.textContent.length > maxLength) {
      bio.textContent = bio.textContent.slice(0, maxLength);
      placeCaretAtEnd(bio); // Reposition the cursor
    }
  });

// Helper function to place caret at the end of contenteditable
function placeCaretAtEnd(el) {
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(el);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

  // Sort friends by status (online first)
  friends.sort((a, b) => (a.status === "offline") - (b.status === "offline"));

  // Populate Friends List
  friends.forEach((friend) => {
    const div = document.createElement("div");
    div.className = "friend-item";
    div.innerHTML = `
            <img src="${friend.picture}" alt="${
      friend.name
    }" class="friend-picture">
            <div>
                <p class="friend-name">${friend.name}</p>
                <span class="friend-status ${friend.status}">
                    <span class="status-indicator"></span>
                    ${
                      friend.status.charAt(0).toUpperCase() +
                      friend.status.slice(1)
                    }
                </span>
            </div>
        `;
    friendsContainer.appendChild(div);
  });

  // Match History (last 10 games)

  const matchData = [
    {
      player: {
        name: "Player1",
        icon: "https://picsum.photos/50?random=1",
        score: 10,
      },
      enemy: {
        name: "Enemy1",
        icon: "https://picsum.photos/50?random=2",
        score: 8,
      },
    },
    {
      player: {
        name: "Player1",
        icon: "https://picsum.photos/50?random=1",
        score: 7,
      },
      enemy: {
        name: "Enemy2",
        icon: "https://picsum.photos/50?random=3",
        score: 9,
      },
    },
    {
      player: {
        name: "Player1",
        icon: "https://picsum.photos/50?random=1",
        score: 12,
      },
      enemy: {
        name: "Enemy3",
        icon: "https://picsum.photos/50?random=4",
        score: 6,
      },
    },
    {
      player: {
        name: "Player1",
        icon: "https://picsum.photos/50?random=1",
        score: 8,
      },
      enemy: {
        name: "Enemy4",
        icon: "https://picsum.photos/50?random=5",
        score: 8,
      },
    },
    {
      player: {
        name: "Player1",
        icon: "https://picsum.photos/50?random=1",
        score: 15,
      },
      enemy: {
        name: "Enemy5",
        icon: "https://picsum.photos/50?random=6",
        score: 13,
      },
    },
    {
      player: {
        name: "Player1",
        icon: "https://picsum.photos/50?random=1",
        score: 9,
      },
      enemy: {
        name: "Enemy6",
        icon: "https://picsum.photos/50?random=7",
        score: 11,
      },
    },
    {
      player: {
        name: "Player1",
        icon: "https://picsum.photos/50?random=1",
        score: 14,
      },
      enemy: {
        name: "Enemy7",
        icon: "https://picsum.photos/50?random=8",
        score: 10,
      },
    },
    {
      player: {
        name: "Player1",
        icon: "https://picsum.photos/50?random=1",
        score: 6,
      },
      enemy: {
        name: "Enemy8",
        icon: "https://picsum.photos/50?random=9",
        score: 7,
      },
    },
    {
      player: {
        name: "Player1",
        icon: "https://picsum.photos/50?random=1",
        score: 11,
      },
      enemy: {
        name: "Enemy9",
        icon: "https://picsum.photos/50?random=10",
        score: 9,
      },
    },
    {
      player: {
        name: "Player1",
        icon: "https://picsum.photos/50?random=1",
        score: 13,
      },
      enemy: {
        name: "Enemy10",
        icon: "https://picsum.photos/50?random=11",
        score: 12,
      },
    },
  ];

  function createMatchCard(match) {
    const playerWon = match.player.score > match.enemy.score;
    const card = document.createElement("div");
    card.className = "match-card";
    card.innerHTML = `
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-12 col-sm-5 d-flex flex-column flex-sm-row align-items-center justify-content-start mb-3 mb-sm-0">
                        <img src="${
                          match.player.icon
                        }" alt="" class="player-icon mb-2 mb-sm-0 me-sm-2">
                        <h5 class="player-name ${
                          playerWon ? "winner" : "loser"
                        }">${match.player.name}</h5>
                    </div>
                    <div class="col-12 col-sm-2 text-center mb-3 mb-sm-0">
                        <div class="score">${match.player.score} - ${
      match.enemy.score
    }</div>
                    </div>
                    <div class="col-12 col-sm-5 d-flex flex-column flex-sm-row align-items-center justify-content-end">
                        <h5 class="enemy-name ${
                          playerWon ? "loser" : "winner"
                        } mb-2 mb-sm-0 me-sm-2">${match.enemy.name}</h5>
                        <img src="${
                          match.enemy.icon
                        }" alt="" class="enemy-icon">
                    </div>
                </div>
            </div>
        `;
    return card;
  }

  function displayMatchHistory() {
    const matchHistoryContainer = document.getElementById("matchHistory");
    matchHistoryContainer.innerHTML = "";

    // Get the last 10 games from matchData
    const recentMatches = matchData.slice(-10);

    recentMatches.forEach((match) => {
      const matchCard = createMatchCard(match);
      matchHistoryContainer.appendChild(matchCard);
    });
  }

  displayMatchHistory();
  /**
   * ------------------------------------------------------------------
   */
  async function fetchUserData() {
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
        console.log(profilePicture);
        updateUserDisplay(userData, profilePicture);
        document.getElementById("profileName").textContent = userData.nickname;
        document.getElementById("profileBio").textContent = userData.bio;
        document.getElementById("profileImage").src = profilePicture;
      } else {
        console.error("Failed to fetch user data:", response.statusText);
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
          <img src="${profilePicture}" alt="Profile Image" class="rounded-circle users" id="profilPicture">
          <!-- <p class="level"></p> -->
        </div>
        
        <!-- User Name -->
        <div class="UserProfile">
          <a href="#profil" class="text-white text-decoration-none" id="nickName"><strong>${userData.nickname}</strong></a>
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

  console.log("displayed twice for some reason: ");
  fetchUserData();
  // Edit profile logic
  document
    .getElementById("editProfileBtn")
    .addEventListener("click", function () {
      isEditing = !isEditing;

      if (isEditing) {
        document
          .getElementById("profileName")
          .setAttribute("contenteditable", "true");
        document
          .getElementById("profileBio")
          .setAttribute("contenteditable", "true");
        document.getElementById("profileImage").style.cursor = "pointer";
        document.getElementById("profileImage").classList.add("editable");
        document.getElementById("editImageIcon").style.display = "block";
        this.innerHTML = '<i class="fas fa-save me-2"></i>Save Profile';

        document.getElementById("profileName").focus();
      } else {
        const updatedName = document.getElementById("profileName").textContent;
        const updatedBio = document.getElementById("profileBio").textContent;

        fetch("http://0.0.0.0:8000/profile/update/", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nickname: updatedName, bio: updatedBio }),
        })
          .then((response) => response.json())
          .then((userData) => {
            document.getElementById("nickName").textContent = userData.nickname;
            console.log("Profile updated successfully:", userData);
          })
          .catch((error) => console.error("Error updating profile:", error));

        document
          .getElementById("profileName")
          .setAttribute("contenteditable", "false");
        document
          .getElementById("profileBio")
          .setAttribute("contenteditable", "false");
        document.getElementById("profileImage").style.cursor = "not-allowed";
        document.getElementById("profileImage").classList.remove("editable");
        document.getElementById("editImageIcon").style.display = "none";
        this.innerHTML = '<i class="fas fa-pencil-alt me-2"></i>Edit Profile';
      }
    });

  // Image upload logic
  document
    .getElementById("profileImage")
    .addEventListener("click", function () {
      console.log("Image clicked");
      if (isEditing) {
        document.getElementById("fileInput").click();
      }
    });

  document
    .getElementById("fileInput")
    .addEventListener("change", function (event) {
      event.preventDefault();
      console.log("File input changed");
      let formData = new FormData();
      const file = event.target.files[0];

      if (file) {
        formData.append("profile_picture", file);
        fetch("http://0.0.0.0:8000/profile/update/picture/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })
          .then((response) => response.json())
          .then((userData) => {
            const imageUrl = "http://0.0.0.0:8000/" + userData.profile_picture;
            document.getElementById("profilPicture").src = imageUrl;
            document.getElementById("profileImage").src = imageUrl;
          })
          .catch((error) => console.error("Error uploading image:", error));
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
  // }
  /******************************************************************************** */
}
