// document.addEventListener("DOMContentLoaded", function () {
import { navigateTo } from "./main.js";

export function initHomePage() {
  const toggleBtn = document.getElementById("toggle-btn");
  const friendList = document.querySelector(".friend-list");
  const conversation = document.querySelector(".conversation");
  const text = document.querySelector(".Text");

  toggleBtn.addEventListener("click", function () {
    if (friendList.style.display === "none") {
      friendList.style.display = "block";
    } else {
      friendList.style.display = "none";
      conversation.style.display = "none";
    }
  });

  document.querySelectorAll(".friend").forEach((friend) => {
    friend.addEventListener("click", function () {
      let friendName = this.getAttribute("data-friend") || "salam"; // Get the friend name or default to "salam"

      if (
        document.querySelector(".conversation").style.display === "none" ||
        document.querySelector(".conversation").style.display === ""
      ) {
        // Show conversation and hide text and avatar
        document.querySelector(".conversation").style.display = "block";
        document.getElementById(
          "conversation-content"
        ).innerHTML = `<p>Chatting with ${friendName}...</p>`;
        document.querySelector(".Text").style.display = "none";
      } else {
        // Hide conversation and show text and avatar
        document.querySelector(".conversation").style.display = "none";
        document.querySelector(".Text").style.display = "block";
      }
    });
  });

  document.getElementById("back-button").addEventListener("click", function () {
    friendList.style.display = "block";
    conversation.style.display = "none";
    document.querySelector(".Text").style.display = "block"; //in smaller screen (make it permanently none)
  });

  document.getElementById("search-btn").addEventListener("click", function () {
    if (document.getElementById("search-bar").style.display == "block") {
      document.getElementById("search-bar").style.display = "none";
      document.getElementById("add-friend-bar").style.display = "none";
    } else {
      document.getElementById("search-bar").style.display = "block";
      document.getElementById("add-friend-bar").style.display = "none";
    }
  });

  // document.getElementById("search-btn").addEventListener("input", function() {
  //   const searchText = searchBar.value.toLowerCase();
  //   //users = get all the friend list
  //   // const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchText));
  //   renderFriendList(filteredUsers);
  // });

  document.getElementById("add-btn").addEventListener("click", function () {
    if (document.getElementById("add-friend-bar").style.display == "block") {
      document.getElementById("search-bar").style.display = "none";
      document.getElementById("add-friend-bar").style.display = "none";
    } else {
      document.getElementById("search-bar").style.display = "none";
      document.getElementById("add-friend-bar").style.display = "block";
    }
  });

  // document.getElementById("add-btn").addEventListener("input", function() {
  //   const searchText = searchBar.value.toLowerCase();

  // });

  // Render Friend List
// function renderFriendList(users) {
//   friendList.innerHTML = ''; // Clear previous list
//   users.forEach(user => {
//     const listItem = document.createElement('li');
//     listItem.className = 'list-group-item';
//     listItem.textContent = user.name;
//     listItem.addEventListener('click', () => loadProfile(user));
//     friendList.appendChild(listItem);
//   });
// }

  // Add event listener to "Play" button
  const playButton = document.getElementById("playButton");
  if (playButton) {
    playButton.addEventListener("click", function () {
      navigateTo("play"); // Redirect to 'login' page when Play button is clicked
    });
  }

  function handleResize() {
    if (window.innerWidth > 990) friendList.style.display = "block";
  }

  window.addEventListener("resize", handleResize); // TO BE REMOVED F PLAY AND FRIEND DISPLAY NONE fiha

  /*------------------------------------- NEW CODE ADDED -------------- */
  //   async function fetchUserData() {
  //   let token = sessionStorage.getItem('accessToken');
  //   try {
  //     let response = await fetch("http://0.0.0.0:8000/user/", {
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       },
  //       method: "POST",
  //     });
  //     if (response.ok) {
  //       let rewind = await response.json();
  //       /* user data to be rendered here*/

  //     }
  //   } catch (err) {
  //     console.err(err);
  //   }
  // }
  // fetchUserData();
  // const dummydata =
  //   { id: 1, name: "Alex", level: 999, wins: 150, img: "https://i.pravatar.cc/160?img=1" };

  // function renderUser() {
  //   return `
  //   <button class="user btn p-2">
  //     <div class="d-flex align-items-center gap-5">
  //       <!-- Profile Image -->
  //       <div class="users-container">
  //         <img src="./src/assets/home/border.png" alt="" class="users-border">
  //         <img src="${dummydata.img}" alt="Profile Image" class="rounded-circle users">
  //         <p class="level">${dummydata.level}</p>
  //       </div>

  //       <!-- User Name -->
  //       <div class="UserProfile">
  //         <a href="#profil" class="text-white text-decoration-none"><strong>${dummydata.name}</strong></a>
  //       </div>

  //       <!-- Notification Icon -->
  //       <div class="Notifications">
  //         <i class="bi bi-bell-fill text-white"></i>
  //       </div>
  //     </div>
  //   </button>
  //   `;
  // }
  // function user() {
  //   let user = document.getElementById("user-container");
  //   user.innerHTML = `${renderUser()}`;
  // }
  // user();
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

  function decryptImage(encryptedImageBase64, userData) {
    // Recreate the data URL for the image
    return `data:${userData.mimeType};base64,${encryptedImageBase64}`;
}

  fetchUserData();
}

