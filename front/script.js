// /*------------------------------------- NEW CODE ADDED -------------- */
async function fetchUserData() {
  let token = sessionStorage.getItem('accessToken');
  try {
    let response = await fetch("http://0.0.0.0:8000/userinfo/", {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      method: "POST",
    });
    if (response.ok) {
      let userData = await response.json();
      updateUserDisplay(userData);
    } else {
      console.error('Failed to fetch user data:', response.statusText); // Error handling
    }
  } catch (err) {
    console.error('Error fetching user data:', err);
  }
}

function renderUser(userData) {
  return `
    <button class="user btn p-2">
      <div class="d-flex align-items-center gap-5">
        <!-- Profile Image -->
        <div class="users-container">
          <img src="./src/assets/home/border.png" alt="" class="users-border">
          <img src="${userData.img}" alt="Profile Image" class="rounded-circle users">
          <p class="level">${userData.level}</p>
        </div>
        
        <!-- User Name -->
        <div class="UserProfile">
          <a href="#profil" class="text-white text-decoration-none"><strong>${userData.name}</strong></a>
        </div>
        
        <!-- Notification Icon -->
        <div class="Notifications">
          <i class="bi bi-bell-fill text-white"></i>
        </div>
      </div>
    </button>
  `;
}

function updateUserDisplay(userData) {
  let userContainer = document.getElementById("user-container");
  userContainer.innerHTML = renderUser(userData);
}

fetchUserData();


