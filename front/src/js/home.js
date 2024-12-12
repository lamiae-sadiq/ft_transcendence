import { navigateTo } from "./main.js";

export function initHomePage() {
  const searchBtn = document.getElementById("searchBtn");
  const addFriendBtn = document.getElementById("addFriendBtn");
  const searchContainer = document.querySelector(".search-container");
  const addFriendContainer = document.querySelector(".add-friend-container");
  const closeSearch = document.getElementById("closeSearch");
  
  const addFriendButton = document.getElementById("addFriendButton");
  const addFriendInput = document.getElementById("addFriendInput");
  const addFriendResult = document.getElementById("addFriendResult");
  
  const friendRequestButton = document.getElementById("friendRequestButton");
  const friendRequestBadge = document.getElementById("friendRequestBadge");
  const friendRequestsContainer = document.querySelector(".friend-requests-container");
  
  let userData;
  let socket = null;
  let currentRoomId = null;
  // Fetch User Data
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
        userData = await response.json();
        console.log("user data = ", userData);
        let profilePicture = "http://0.0.0.0:8000/" + userData.profile_picture;
        updateUserDisplay(userData, profilePicture);
      } else {
        console.error("Failed to fetch user data:", response.statusText);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  }

function connectWebSocket(username, friendId) {
  const roomId =  `${userData.id < friendId ? `${userData.id}_${friendId}` : `${friendId}_${userData.id}`}`;
  console.log("Connecting to room:", roomId);

  if (socket && currentRoomId !== roomId) {
    disconnectWebSocket();
  }
  if (currentRoomId === roomId) {
    console.log("Already connected to room:", roomId);
    return;
}

  socket = new WebSocket(`ws://0.0.0.0:8002/ws/chat/${roomId}/`);

  socket.onopen = () => {
    console.log(`WebSocket connected to room: ${roomId}`);
    socket.send(JSON.stringify({ type: "join", username }));
  };

  socket.onmessage = (event) => {
    console.log("WebSocket message received:", event.data);
    const data = JSON.parse(event.data);

    if (data.message) {
        // console.log("Passing data to appendMessageToChat:", data);
        appendMessageToChat(data.username, data.message, data.timestamp);
    } else {
        console.error("Invalid message structure:", data);
    }
};

  socket.onclose = () => {
    console.log("WebSocket disconnected.");
    currentRoomId = null;
  };

  socket.onerror = (error) => console.error("WebSocket error:", error);
}

function disconnectWebSocket() {
  if (socket) {
    console.log("Disconnecting WebSocket...");
    socket.close();
    socket = null;
    currentRoomId = null;
  }
}

  // Function to send messages to the server via WebSocket
  function sendMessage(message) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const payload = {
            type: "message",
            message: message,
            username: userData.nickname,
            timestamp: new Date().toISOString(),
        };

        console.log("Sending payload:", payload);
        socket.send(JSON.stringify(payload));
    } else {
        console.error("WebSocket connection is not open.");
    }
}

  
  // Function to update the chat UI with the new message
  function appendMessageToChat(username, message, timestamp) {
    // console.log("appendMessageToChat called:", { username, message, timestamp });

    const chatMessagesContainer = document.getElementById("chat-messages");
    if (!chatMessagesContainer) {
        console.error("Chat messages container not found!");
        return;
    }

    const messageElement = document.createElement("div");
    messageElement.className = `message ${username === userData.nickname ? "sent" : "received"}`;
    messageElement.innerHTML = `
        <div class="message-content">${message}</div>
        <div class="message-timestamp">${new Date(timestamp).toLocaleTimeString()}</div>
    `;
    chatMessagesContainer.appendChild(messageElement);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

    // console.log("Message appended to chat:", messageElement);
}

  
  // Friend selection logic to initiate chat
  const friendItems = document.querySelectorAll(".friend-item");
  friendItems.forEach((friend) => {
      friend.addEventListener("click", () => {
          const roomId = friend.dataset.friendId;
          const username = userData.nickname;
  
          // Disconnect from any existing WebSocket before connecting to a new one
          disconnectWebSocket();
          connectWebSocket(roomId, username);
  
          // Update UI for the selected friend
          const friendName = friend.querySelector(".friend-name").textContent;
          const friendAvatar = friend.querySelector(".friend-avatar").src;
  
          document.getElementById("chatUserAvatar").src = friendAvatar;
          document.getElementById("chatUserName").textContent = friendName;
  
          // Show the chat window and hide the default content
          document.getElementById("defaultContent").classList.add("d-none");
          document.getElementById("chatWindow").classList.remove("d-none");
  
          // Update the friend profile section
          document.getElementById("friendProfileName").textContent = friendName;
          document.getElementById("friendProfileBio").textContent = friend.dataset.friendBio;
      });
  });
  
  // Handle sending a message when the user clicks the send button
  const sendButton = document.querySelector(".chat-input button");
  const chatInput = document.querySelector(".chat-input input");
  
  sendButton.addEventListener("click", () => {
    const message = chatInput.value.trim();
    if (message) {
        sendMessage(message);
        appendMessageToChat(userData.nickname, message, new Date().toISOString());
        chatInput.value = "";
    }
  });
  
  chatInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
          const message = chatInput.value.trim();
          console.log("waaaaaaal3adaw ", message);
          if (message !== "") {
              sendMessage(message);
              appendMessageToChat(userData.nickname, message, new Date().toISOString());
              chatInput.value = "";  // Clear the input field
          }
      }
  });
  

  // Exit Chat
  const exitChat = document.getElementById("exitChat");
  exitChat.addEventListener("click", () => {
    document.getElementById("defaultContent").classList.remove("d-none");
    document.getElementById("chatWindow").classList.add("d-none");
    document.getElementById("userProfile").classList.remove("d-none");
    document.getElementById("friendProfile").classList.add("d-none");
    mobileFriendsToggle.classList.remove("d-none");
  });

  
  mobileFriendsToggle.addEventListener("click", () => {
    friendListSection.classList.toggle("active");
    mobileFriendsToggle.style.zIndex = 0;
  });

  // Add event listener to "Play" button
  const playButton = document.getElementById("confirmButton");
  if (playButton) {
    playButton.addEventListener("click", function () {
      navigateTo("play"); // Redirect to 'login' page when Play button is clicked
    });
  }


  
  function renderUser(userData, profilePicture) {
    return `
    <button class="user btn p-2 no-border">
        <div class="d-flex align-items-center gap-2">
          <div class="users-container">
            <img src="./src/assets/home/border.png" alt="" class="users-border">
            <img src="${profilePicture}" alt="Profile Image" class="rounded-circle users">
            </div>
          <div class="UserProfile">
            <a href="" class="text-white text-decoration-none"><strong>${userData.nickname}</strong></a>
            </div>
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
    if (socket) {
      socket.close();
    }
    connectWebSocket(userData.nickname, friendId);
  });


  addFriendButton.addEventListener("click", () => {
    addFriendContainer.classList.remove("d-none");
    searchContainer.classList.add("d-none");
  });


addFriendButton.addEventListener("click", async () => {
    const nickname = addFriendInput.value.trim();

    if (!nickname) {
        addFriendResult.innerHTML = "<p style='color: red;'>Please enter a nickname.</p>";
        return;
    }

    console.log("Sending friend request for nickname:", nickname);

    try {
        const response = await fetch(`http://0.0.0.0:8000/friends/send-friend-request/${nickname}/`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("jwtToken")}`,
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const result = await response.json();
            addFriendResult.innerHTML = `<p style='color: green;'>${result.message}</p>`;
            addFriendInput.value = ""; // Clear the input field
        } else {
            const error = await response.json();
            addFriendResult.innerHTML = `<p style='color: red;'>${error.error || "Error sending friend request."}</p>`;
        }
    } catch (err) {
        console.error("Error sending friend request:", err);
        addFriendResult.innerHTML = "<p style='color: red;'>An error occurred. Please try again.</p>";
    }
});



// Function to fetch friend requests
async function fetchFriendRequests() {
  try {
    const response = await fetch("http://0.0.0.0:8000/friends/friend-requests/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const requests = await response.json();

      // Update the badge count
      friendRequestBadge.textContent = requests.length;
      friendRequestBadge.style.display = requests.length > 0 ? "inline-block" : "none";

      // Update the friend requests container
      if (friendRequestsContainer) {
        friendRequestsContainer.innerHTML = ""; // Clear existing requests
        requests.forEach((request) => {
          friendRequestsContainer.innerHTML += `
            <div class="friend-request">
              <div class="request-info">
                <span class="requester-name">${request.nickname}</span>
              </div>
              <div class="request-actions">
                <button class="btn btn-success accept-request" data-nickname="${request.nickname}">Accept</button>
                <button class="btn btn-danger cancel-request" data-nickname="${request.nickname}">Cancel</button>
              </div>
            </div>
          `;
        });
      }

      // Reattach listeners for Accept and Cancel buttons
      attachFriendRequestListeners();
    } else {
      console.error("Failed to fetch friend requests:", response.statusText);
    }
  } catch (err) {
    console.error("Error fetching friend requests:", err);
  }
}

// Event listener to open the friend requests container when clicking the button
friendRequestButton.addEventListener("click", () => {
  friendRequestsContainer.classList.toggle("d-none"); // Toggle visibility
});

// Function to attach event listeners for Accept and Cancel buttons
function attachFriendRequestListeners() {
  document.querySelectorAll(".accept-request").forEach((button) => {
    button.addEventListener("click", async () => {
      const nickname = button.dataset.nickname;
      try {
        const response = await fetch(`http://0.0.0.0:8000/friends/accept-friend-request/${nickname}/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const result = await response.json();
          console.log(result.message);
          button.closest(".friend-request").remove();
          fetchFriendRequests(); // Refresh badge and container
        } else {
          console.error("Error accepting friend request:", await response.json());
        }
      } catch (err) {
        console.error("Error accepting friend request:", err);
      }
    });
  });

  document.querySelectorAll(".cancel-request").forEach((button) => {
    button.addEventListener("click", async () => {
      const nickname = button.dataset.nickname;
      console.log(`Canceling friend request for: ${nickname}`); // Debug
      try {
        const response = await fetch(`http://0.0.0.0:8000/friends/cancel-friend-request/${nickname}/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
            "Content-Type": "application/json",
          },
        });
    
        if (response.ok) {
          const result = await response.json();
          console.log(result.message);
          button.closest(".friend-request").remove();
          fetchFriendRequests(); // Refresh badge and container
        } else {
          console.error("Error canceling friend request:", await response.json());
        }
      } catch (err) {
        console.error("Error canceling friend request:", err);
      }
    });    
  });
}
fetchFriendRequests();



let searchResults = document.querySelector(".search-results");

    if (!searchResults) {
        searchResults = document.createElement("div");
        searchResults.classList.add("search-results");
        searchContainer.appendChild(searchResults);
    }

    // Handle Search Input
    searchInput.addEventListener("input", async () => {
        const query = searchInput.value.trim();

        if (query) {
            try {
                const response = await fetch(`http://0.0.0.0:8000/api/search-friends/?query=${query}`, {
                    headers: {
                        "Authorization": `Bearer ${sessionStorage.getItem("jwtToken")}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    searchResults.innerHTML = data.results
                        .map(
                            (result) => `
                            <div class="search-result-item" data-friend-id="${result.id}">
                              <img src="${result.avatar || 'default-avatar.jpg'}" class="result-avatar" alt="Avatar" />
                              <div class="result-info">
                                  <span class="result-name">${result.name}</span>
                                  <span class="result-bio">${result.bio || "No bio available"}</span>
                              </div>
                              <button class="btn btn-sm btn-primary chat-btn" data-friend-id="${result.id}" data-friend-name="${result.name}" data-friend-avatar="${result.avatar}">Chat</button>
                            </div>`
                        )
                        .join("");
                      // Add click listeners to each Chat button
                document.querySelectorAll(".chat-btn").forEach((button) => {
                  button.addEventListener("click", () => {
                    const friendId = button.dataset.friendId; 
                    const friendName = button.dataset.friendName;
                    const friendAvatar = button.dataset.friendAvatar;

                    console.log("Starting chat with:", friendName);

                    // Disconnect existing WebSocket (if any)
                    disconnectWebSocket();

                    // Connect to the new WebSocket for this friend
                    connectWebSocket(userData.nickname, friendId);

                    // Update the chat UI
                    document.getElementById("chatUserAvatar").src = friendAvatar || "default-avatar.jpg";
                    document.getElementById("chatUserName").textContent = friendName;

                    // Show the chat window and hide the default content
                    document.getElementById("defaultContent").classList.add("d-none");
                    document.getElementById("chatWindow").classList.remove("d-none");

                    // Clear previous messages (if any)
                    const chatMessagesContainer = document.getElementById("chat-messages");
                    chatMessagesContainer.innerHTML = "";
              });
                  });

                    // Add click listeners to each result
                    document.querySelectorAll(".search-result-item").forEach((item) => {
                        item.addEventListener("click", () => {
                            const friendId = item.dataset.friendId;
                            console.log("Selected friend ID:", friendId);
                            searchInput.value = ""; // Clear search input
                            searchResults.innerHTML = ""; // Clear search results
                        });
                    });
                } else {
                    console.error("Error fetching search results:", response.statusText);
                }
            } catch (err) {
                console.error("Error during search:", err);
            }
        } else {
            searchResults.innerHTML = ""; // Clear results if query is empty
        }
    });
  
    function fetchFriendList() {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) {
        console.error("JWT token is missing. Please log in.");
        return;
      }
      fetch("http://0.0.0.0:8000/friends/friend-list/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch friend list");
          return response.json();
        })
        .then(renderFriendList)
        .catch((error) => console.error("Error fetching friends:", error));
    }
  
    function renderFriendList(friends) {
      const friendListContainer = document.querySelector(".friend-list");
      if (!friendListContainer) {
        console.error("Friend list container not found!");
        return;
      }
  
      friendListContainer.innerHTML = friends
        .map(
          (friend) => `
          <div class="friend-item" data-friend-id="${friend.id}">
            <img src="${friend.profile_picture || 'default-avatar.jpg'}" class="friend-avatar" />
            <div class="friend-info">
              <div class="friend-name">${friend.nickname}</div>
              <div class="friend-status">${friend.status || "Offline"}</div>
            </div>
          </div>`
        )
        .join("");
  
      // Attach click event listeners to friend items
      document.querySelectorAll(".friend-item").forEach((friendItem) => {
        friendItem.addEventListener("click", () => {
          const friendId = friendItem.dataset.friendId;
          const friendName = friendItem.querySelector(".friend-name").textContent;
          const friendAvatar = friendItem.querySelector(".friend-avatar").src;
  
          console.log(`Starting chat with: ${friendName}`);
  
          // Disconnect any existing WebSocket and initiate a new one
          disconnectWebSocket();
          connectWebSocket(userData.nickname, friendId);
  
          // Update the chat window UI
          document.getElementById("chatUserAvatar").src = friendAvatar;
          document.getElementById("chatUserName").textContent = friendName;
  
          // Show chat window
          document.getElementById("defaultContent").classList.add("d-none");
          document.getElementById("chatWindow").classList.remove("d-none");
  
          // Clear previous messages
          document.getElementById("chat-messages").innerHTML = "";
        });
      });
    }
  
fetchFriendList();
// Optional: Poll for new friend requests every 30 seconds
// setInterval(fetchFriendRequests, 30000);
}