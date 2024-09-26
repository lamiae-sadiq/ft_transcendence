export function initProfilPage() {
    const editProfileBtn = document.getElementById('editProfileBtn');
    const achievementsContainer = document.getElementById('achievementsContainer');
    const friendsContainer = document.getElementById('friendsContainer');

    // Edit Profile Button Click Event
    editProfileBtn.addEventListener('click', function() {
        alert('Edit profile functionality to be implemented');
    });

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
        
      }
    } catch (err) {
      console.err(err);
    }
  }
  fetchUserData();
  /*------------------------------------- NEW CODE ADDED -------------- */

    // Mock achievements data
    const achievements = [
        { name: 'Master Strategist', icon: 'https://i.pravatar.cc/160?img=3' },
        { name: 'Level 50 Warrior', icon: 'https://i.pravatar.cc/160?img=3' },
        { name: '1000 Games Played', icon: 'https://i.pravatar.cc/160?img=3' },
        { name: 'Tournament Winner', icon: 'https://i.pravatar.cc/160?img=3' },
        { name: 'Legendary Player', icon: 'https://i.pravatar.cc/160?img=3' },
        { name: 'Social Butterfly', icon: 'https://i.pravatar.cc/160?img=3' }
    ];

    // Populate Achievements
    achievements.forEach(achievement => {
        const div = document.createElement('div');
        div.className = 'achievement-item';
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
        { name: 'Alice', status: 'online', picture: 'https://i.pravatar.cc/160?img=3' },
        { name: 'Bob', status: 'offline', picture: 'https://i.pravatar.cc/160?img=3' },
        { name: 'Charlie', status: 'online', picture: 'https://i.pravatar.cc/160?img=3' },
        { name: 'David', status: 'offline', picture: 'https://i.pravatar.cc/160?img=3' },
        { name: 'Eve', status: 'online', picture: 'https://i.pravatar.cc/160?img=3' },
        { name: 'Frank', status: 'offline', picture: 'https://i.pravatar.cc/160?img=3' }
    ];

    // Sort friends by status (online first)
    friends.sort((a, b) => (a.status === 'offline') - (b.status === 'offline'));

    // Populate Friends List
    friends.forEach(friend => {
        const div = document.createElement('div');
        div.className = 'friend-item';
        div.innerHTML = `
            <img src="${friend.picture}" alt="${friend.name}" class="friend-picture">
            <div>
                <p class="friend-name">${friend.name}</p>
                <span class="friend-status ${friend.status}">
                    <span class="status-indicator"></span>
                    ${friend.status.charAt(0).toUpperCase() + friend.status.slice(1)}
                </span>
            </div>
        `;
        friendsContainer.appendChild(div);
    });

    // Match History (last 10 games)

    const matchData = [
        { player: { name: "Player1", icon: "https://picsum.photos/50?random=1", score: 10 }, enemy: { name: "Enemy1", icon: "https://picsum.photos/50?random=2", score: 8 } },
        { player: { name: "Player1", icon: "https://picsum.photos/50?random=1", score: 7 }, enemy: { name: "Enemy2", icon: "https://picsum.photos/50?random=3", score: 9 } },
        { player: { name: "Player1", icon: "https://picsum.photos/50?random=1", score: 12 }, enemy: { name: "Enemy3", icon: "https://picsum.photos/50?random=4", score: 6 } },
        { player: { name: "Player1", icon: "https://picsum.photos/50?random=1", score: 8 }, enemy: { name: "Enemy4", icon: "https://picsum.photos/50?random=5", score: 8 } },
        { player: { name: "Player1", icon: "https://picsum.photos/50?random=1", score: 15 }, enemy: { name: "Enemy5", icon: "https://picsum.photos/50?random=6", score: 13 } },
        { player: { name: "Player1", icon: "https://picsum.photos/50?random=1", score: 9 }, enemy: { name: "Enemy6", icon: "https://picsum.photos/50?random=7", score: 11 } },
        { player: { name: "Player1", icon: "https://picsum.photos/50?random=1", score: 14 }, enemy: { name: "Enemy7", icon: "https://picsum.photos/50?random=8", score: 10 } },
        { player: { name: "Player1", icon: "https://picsum.photos/50?random=1", score: 6 }, enemy: { name: "Enemy8", icon: "https://picsum.photos/50?random=9", score: 7 } },
        { player: { name: "Player1", icon: "https://picsum.photos/50?random=1", score: 11 }, enemy: { name: "Enemy9", icon: "https://picsum.photos/50?random=10", score: 9 } },
        { player: { name: "Player1", icon: "https://picsum.photos/50?random=1", score: 13 }, enemy: { name: "Enemy10", icon: "https://picsum.photos/50?random=11", score: 12 } },
    ];

    function createMatchCard(match) {
        const playerWon = match.player.score > match.enemy.score;
        const card = document.createElement('div');
        card.className = 'match-card';
        card.innerHTML = `
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-12 col-sm-5 d-flex flex-column flex-sm-row align-items-center justify-content-start mb-3 mb-sm-0">
                        <img src="${match.player.icon}" alt="" class="player-icon mb-2 mb-sm-0 me-sm-2">
                        <h5 class="player-name ${playerWon ? 'winner' : 'loser'}">${match.player.name}</h5>
                    </div>
                    <div class="col-12 col-sm-2 text-center mb-3 mb-sm-0">
                        <div class="score">${match.player.score} - ${match.enemy.score}</div>
                    </div>
                    <div class="col-12 col-sm-5 d-flex flex-column flex-sm-row align-items-center justify-content-end">
                        <h5 class="enemy-name ${playerWon ? 'loser' : 'winner'} mb-2 mb-sm-0 me-sm-2">${match.enemy.name}</h5>
                        <img src="${match.enemy.icon}" alt="" class="enemy-icon">
                    </div>
                </div>
            </div>
        `;
        return card;
    }

    function displayMatchHistory() {
        const matchHistoryContainer = document.getElementById('matchHistory');
        matchHistoryContainer.innerHTML = '';

        // Get the last 10 games from matchData
        const recentMatches = matchData.slice(-10);

        recentMatches.forEach(match => {
            const matchCard = createMatchCard(match);
            matchHistoryContainer.appendChild(matchCard);
        });
    }

    displayMatchHistory();
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