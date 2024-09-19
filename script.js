document.addEventListener('DOMContentLoaded', function() {
    const editProfileBtn = document.getElementById('editProfileBtn');
    const achievementsContainer = document.getElementById('achievementsContainer');
    const friendsContainer = document.getElementById('friendsContainer');

    // Edit Profile Button Click Event
    editProfileBtn.addEventListener('click', function() {
        alert('Edit profile functionality to be implemented');
    });

    // Mock achievements data
    const achievements = [
        { name: 'Master Strategist', icon: '/placeholder.svg?height=50&width=50' },
        { name: 'Level 50 Warrior', icon: '/placeholder.svg?height=50&width=50' },
        { name: '1000 Games Played', icon: '/placeholder.svg?height=50&width=50' },
        { name: 'Tournament Winner', icon: '/placeholder.svg?height=50&width=50' },
        { name: 'Legendary Player', icon: '/placeholder.svg?height=50&width=50' },
        { name: 'Social Butterfly', icon: '/placeholder.svg?height=50&width=50' }
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
        { name: 'Alice', status: 'online', picture: '/placeholder.svg?height=50&width=50' },
        { name: 'Bob', status: 'offline', picture: '/placeholder.svg?height=50&width=50' },
        { name: 'Charlie', status: 'online', picture: '/placeholder.svg?height=50&width=50' },
        { name: 'David', status: 'offline', picture: '/placeholder.svg?height=50&width=50' },
        { name: 'Eve', status: 'online', picture: '/placeholder.svg?height=50&width=50' },
        { name: 'Frank', status: 'offline', picture: '/placeholder.svg?height=50&width=50' }
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
});