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
    const dummydata =
    { id: 1, name: "Alex", level: 42, wins: 150, img: "https://i.pravatar.cc/160?img=1" };

  function renderUser() {
    return `
    <button class="user btn p-2">
      <div class="d-flex align-items-center gap-5">
        <!-- Profile Image -->
        <div class="ProfileImage">
          <img src="${dummydata.img}" alt="Profile Image" class="rounded-circle" style="width: 40px; height: 40px;">
        </div>
        
        <!-- User Name -->
        <div class="UserProfile">
          <a href="#profil" class="text-white text-decoration-none"><strong>${dummydata.name}</strong></a>
        </div>
        
        <!-- Notification Icon -->
        <div class="Notifications">
          <i class="bi bi-bell-fill text-white"></i>
        </div>
      </div>
    </button>
    `;
  }
  function user() {
    let user = document.getElementById("user-container");
    user.innerHTML = `${renderUser()}`;
  }
  user();
}
