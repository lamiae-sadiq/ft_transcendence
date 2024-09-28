export function initPlayPage() {
  /*------------------------------------- NEW CODE ADDED -------------- */

    let selectedButton = null;
    // console.log("ffffff");
    // document.getElementById('confirm-button').addEventListener('click', function () {
    //     if (selectedButton) {
    //         const selection = selectedButton.getAttribute('data-selection');
    //         alert('Selection confirmed for ' + selection);
    //         // Redirect to another page based on the selected button
    //         window.location.href = 'https://example.com/' + selection; // Update URL accordingly
    //     } else {
    //         alert('Please select an option first.');
    //     }
    // });

    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
      card.addEventListener('click', function() {
        // Remove 'active' class from all cards
        cards.forEach(c => c.classList.remove('active'));
  
        // Add 'active' class to the clicked card
        this.classList.add('active');
      });
    });
    /**
 * ------------------------------------------------------------------
 */
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
          let profilePicture = decryptImage(userData.profile_picture, userData);
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
