export function initProfilPage() {
  let token = sessionStorage.getItem("jwtToken");
  let isEditing = false;

  const achievementsContainer = document.getElementById(
    "achievementsContainer"
  );
  const friendsContainer = document.getElementById("friendsContainer");

  // Mock achievements data
  const achievements = [
    { name: "Master Strategist", icon: "https://i.pravatar.cc/160?img=3" },
    { name: "Level 50 Warrior", icon: "https://i.pravatar.cc/160?img=3" },
    { name: "1000 Games Played", icon: "https://i.pravatar.cc/160?img=3" },
    { name: "Tournament Winner", icon: "https://i.pravatar.cc/160?img=3" },
    { name: "Legendary Player", icon: "https://i.pravatar.cc/160?img=3" },
    { name: "Social Butterfly", icon: "https://i.pravatar.cc/160?img=3" },
  ];

  // Populate Achievements
  achievements.forEach((achievement) => {
    const div = document.createElement("div");
    div.className = "achievement-item";
    div.innerHTML = `
            <img src="${achievement.icon}" alt="${achievement.name}" class="achievement-icon">
            <div>
                <p class="achievement-name">${achievement.name}</p>
            </div>
        `;
    achievementsContainer.appendChild(div);
  });

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
  ];

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
        let profilePicture = decryptImage(userData.profile_picture, userData);
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

  function decryptImage(encryptedImageBase64, userData) {
    // Recreate the data URL for the image
    return `data:${userData.mimeType};base64,${encryptedImageBase64}`;
  }
  
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
        document
          .getElementById("profileImage")
          .classList.add("highlight-border");
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
          .then((data) => {
            console.log("Profile updated successfully:", data);
          })
          .catch((error) => console.error("Error updating profile:", error));

        document
          .getElementById("profileName")
          .setAttribute("contenteditable", "false");
        document
          .getElementById("profileBio")
          .setAttribute("contenteditable", "false");
        document.getElementById("profileImage").style.cursor = "not-allowed";
        document
          .getElementById("profileImage")
          .classList.remove("highlight-border");
        document.getElementById("editImageIcon").style.display = "none";
        this.innerHTML = '<i class="fas fa-pencil-alt me-2"></i>Edit Profile';
      }
    });

  // Image upload logic
  document
    .getElementById("editImageIcon")
    .addEventListener("click", function () {
      document.getElementById("fileInput").click();
    });

  document
    .getElementById("fileInput")
    .addEventListener("change", function (event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      if (file) {
        reader.onload = function (event) {
          const base64Data = event.target.result.split(",")[1];

          const formData = new FormData();
          formData.append("profileImage", base64Data);
          fetch("http://0.0.0.0:8000/profile/update/", {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          })
            .then((response) => response.json())
            .then((userData) => {
              let profilePicture = decryptImage(
                userData.profile_picture,
                userData
              );
              document.getElementById("profileImage").src = profilePicture;
            })
            .catch((error) => console.error("Error uploading image:", error));
        };
        // Start reading the file as a Data URL
        reader.readAsDataURL(file);
      }
    });
}
