/*------------------------------------- NEW CODE ADDED -------------- */
async function fetchUserData() {
    let token = sessionStorage.getItem('accessToken');
    try {
      let response = await fetch("http://0.0.0.0:8000/user/", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        method: "POST",
      });
      if (response.ok) {
        let rewind = await response.json();
        /* user data to be rendered here*/
        user(rewind);
      }
    } catch (err) {
      console.error(err);
    }
  }
  // const dummydata =
  //   { id: 1, name: "Alex", level: 42, wins: 150, img: "https://i.pravatar.cc/160?img=1" };

  function renderUser(data) {
    return `
    <button class="user btn p-2">
      <div class="d-flex align-items-center gap-3">
        <!-- Profile Image -->
        <div class="ProfileImage">
          <img src="${data.img}" alt="Profile Image" class="rounded-circle" style="width: 40px; height: 40px;">
        </div>
        
        <!-- User Name -->
        <div class="UserProfile">
          <a href="#profil" class="text-white text-decoration-none"><strong>${data.name}</strong></a>
        </div>
        
        <!-- Notification Icon -->
        <div class="Notifications">
          <i class="bi bi-bell-fill text-white"></i>
        </div>
      </div>
    </button>
    `;
  }
  console.log(dummydata.id, dummydata.name, dummydata.level, dummydata);
  function user(data) {
    let user = document.getElementById("user-container");
    user.innerHTML = `${renderUser(data)}`;
  }
  fetchUserData(); // how will be done !!!