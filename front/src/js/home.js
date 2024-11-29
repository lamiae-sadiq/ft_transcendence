// document.addEventListener("DOMContentLoaded", function () {
import { navigateTo } from "./main.js";

export function initHomePage() {
  //   const toggleBtn = document.getElementById("toggle-btn");
  //   const friendList = document.querySelector(".friend-list");
  //   const conversation = document.querySelector(".conversation");
  //   const text = document.querySelector(".Text");

  //   toggleBtn.addEventListener("click", function () {
  //     if (friendList.style.display === "none") {
  //       friendList.style.display = "block";
  //     } else {
  //       friendList.style.display = "none";
  //       conversation.style.display = "none";
  //     }
  //   });

  //   document.querySelectorAll(".friend").forEach((friend) => {
  //     friend.addEventListener("click", function () {
  //       let friendName = this.getAttribute("data-friend") || "salam"; // Get the friend name or default to "salam"

  //       if (
  //         document.querySelector(".conversation").style.display === "none" ||
  //         document.querySelector(".conversation").style.display === ""
  //       ) {
  //         // Show conversation and hide text and avatar
  //         document.querySelector(".conversation").style.display = "block";
  //         document.getElementById(
  //           "conversation-content"
  //         ).innerHTML = `<p>Chatting with ${friendName}...</p>`;
  //         document.querySelector(".Text").style.display = "none";
  //       } else {
  //         // Hide conversation and show text and avatar
  //         document.querySelector(".conversation").style.display = "none";
  //         document.querySelector(".Text").style.display = "block";
  //       }
  //     });
  //   });

  //   document.getElementById("back-button").addEventListener("click", function () {
  //     friendList.style.display = "block";
  //     conversation.style.display = "none";
  //     document.querySelector(".Text").style.display = "block"; //in smaller screen (make it permanently none)
  //   });

  //   document.getElementById("search-btn").addEventListener("click", function () {
  //     if (document.getElementById("search-bar").style.display == "block") {
  //       document.getElementById("search-bar").style.display = "none";
  //       document.getElementById("add-friend-bar").style.display = "none";
  //     } else {
  //       document.getElementById("search-bar").style.display = "block";
  //       document.getElementById("add-friend-bar").style.display = "none";
  //     }
  //   });

  //   // document.getElementById("search-btn").addEventListener("input", function() {
  //   //   const searchText = searchBar.value.toLowerCase();
  //   //   //users = get all the friend list
  //   //   // const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchText));
  //   //   renderFriendList(filteredUsers);
  //   // });

  //   document.getElementById("add-btn").addEventListener("click", function () {
  //     if (document.getElementById("add-friend-bar").style.display == "block") {
  //       document.getElementById("search-bar").style.display = "none";
  //       document.getElementById("add-friend-bar").style.display = "none";
  //     } else {
  //       document.getElementById("search-bar").style.display = "none";
  //       document.getElementById("add-friend-bar").style.display = "block";
  //     }
  //   });

  //   // document.getElementById("add-btn").addEventListener("input", function() {
  //   //   const searchText = searchBar.value.toLowerCase();

  //   // });

  //   // Render Friend List
  // // function renderFriendList(users) {
  // //   friendList.innerHTML = ''; // Clear previous list
  // //   users.forEach(user => {
  // //     const listItem = document.createElement('li');
  // //     listItem.className = 'list-group-item';
  // //     listItem.textContent = user.name;
  // //     listItem.addEventListener('click', () => loadProfile(user));
  // //     friendList.appendChild(listItem);
  // //   });
  // // }

  //   // Add event listener to "Play" button
  //   const playButton = document.getElementById("playButton");
  //   if (playButton) {
  //     playButton.addEventListener("click", function () {
  //       navigateTo("play"); // Redirect to 'login' page when Play button is clicked
  //     });
  //   }

  //   function handleResize() {
  //     if (window.innerWidth > 990) friendList.style.display = "block";
  //   }

  //   window.addEventListener("resize", handleResize); // TO BE REMOVED F PLAY AND FRIEND DISPLAY NONE fiha

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
  console.log("BEFORE FETCHING DATA: will it be twice and why");
  fetchUserData();

  // Elements
  const friendListSection = document.getElementById("friendListSection");
  const closeFriendList = document.getElementById("closeFriendList");
  const friendItems = document.querySelectorAll(".friend-item");
  const defaultContent = document.getElementById("defaultContent");
  const chatWindow = document.getElementById("chatWindow");
  const exitChat = document.getElementById("exitChat");
  const userProfile = document.getElementById("userProfile");
  const friendProfile = document.getElementById("friendProfile");
  const searchBtn = document.getElementById("searchBtn");
  const addFriendBtn = document.getElementById("addFriendBtn");
  const searchContainer = document.querySelector(".search-container");
  const addFriendContainer = document.querySelector(".add-friend-container");
  const closeSearch = document.getElementById("closeSearch");
  const mobileFriendsToggle = document.getElementById("mobileFriendsToggle");

  // const closeAddFriend = document.getElementById('closeAddFriend');
  closeFriendList.addEventListener("click", () => {
    friendListSection.classList.remove("active");
  });

  // Friend Selection
  friendItems.forEach((friend) => {
    friend.addEventListener("click", () => {
      const friendName = friend.querySelector(".friend-name").textContent;
      const friendAvatar = friend.querySelector(".friend-avatar").src;
      const friendBio = friend.dataset.friendBio;

      // Update chat window
      document.getElementById("chatUserAvatar").src = friendAvatar;
      document.getElementById("chatUserName").textContent = friendName;

      // Update friend profile
      document.getElementById("friendProfileAvatar").src = friendAvatar;
      document.getElementById("friendProfileName").textContent = friendName;
      document.getElementById("friendProfileBio").textContent = friendBio;

      // Show chat window and friend profile
      defaultContent.classList.add("d-none");
      chatWindow.classList.remove("d-none");
      mobileFriendsToggle.classList.add("d-none");
      userProfile.classList.add("d-none");
      friendProfile.classList.remove("d-none");

      // Close friend list on mobile
      friendListSection.classList.remove("active");
    });
  });

  // Exit Chat
  exitChat.addEventListener("click", () => {
    defaultContent.classList.remove("d-none");
    chatWindow.classList.add("d-none");
    userProfile.classList.remove("d-none");
    friendProfile.classList.add("d-none");
    mobileFriendsToggle.classList.remove("d-none");
  });

  // Search and Add Friend Toggles
  searchBtn.addEventListener("click", () => {
    searchContainer.classList.remove("d-none");
    addFriendContainer.classList.add("d-none");
  });

  addFriendBtn.addEventListener("click", () => {
    addFriendContainer.classList.remove("d-none");
    searchContainer.classList.add("d-none");
  });

  closeSearch.addEventListener("click", () => {
    searchContainer.classList.add("d-none");
  });

  closeAddFriend.addEventListener("click", () => {
    addFriendContainer.classList.add("d-none");
  }); //*request to be sent to the backend request sent*

  mobileFriendsToggle.addEventListener("click", () => {
    friendListSection.classList.toggle("active");
    mobileFriendsToggle.style.zIndex = 0;
  });

  // Add event listener to "Play" button
  const playButton = document.getElementById("confirmButton");
  if (playButton) {
    playButton.addEventListener("click", function () {
      navigateTo("play");
    });
  }
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
