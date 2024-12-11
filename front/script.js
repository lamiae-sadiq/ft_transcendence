document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const friendListSection = document.getElementById('friendListSection');
    const friendListToggle = document.getElementById('friendListToggle');
    const closeFriendList = document.getElementById('closeFriendList');
    const friendItems = document.querySelectorAll('.friend-item');
    const defaultContent = document.getElementById('defaultContent');
    const chatWindow = document.getElementById('chatWindow');
    const exitChat = document.getElementById('exitChat');
    const userProfile = document.getElementById('userProfile');
    const friendProfile = document.getElementById('friendProfile');
    const searchBtn = document.getElementById('searchBtn');
    const addFriendBtn = document.getElementById('addFriendBtn');
    const searchContainer = document.querySelector('.search-container');
    const addFriendContainer = document.querySelector('.add-friend-container');
    const closeSearch = document.getElementById('closeSearch');
    const closeAddFriend = document.getElementById('closeAddFriend');

    // Friend List Toggle
    // friendListToggle.addEventListener('click', () => {
    //     friendListSection.classList.add('active');
    // });

    closeFriendList.addEventListener('click', () => {
        friendListSection.classList.remove('active');
    });

    // Friend Selection
    friendItems.forEach(friend => {
        friend.addEventListener('click', () => {
            const friendName = friend.querySelector('.friend-name').textContent;
            const friendAvatar = friend.querySelector('.friend-avatar').src;
            const friendBio = friend.dataset.friendBio;

            // Update chat window
            document.getElementById('chatUserAvatar').src = friendAvatar;
            document.getElementById('chatUserName').textContent = friendName;

            // Update friend profile
            document.getElementById('friendProfileAvatar').src = friendAvatar;
            document.getElementById('friendProfileName').textContent = friendName;
            document.getElementById('friendProfileBio').textContent = friendBio;

            // Show chat window and friend profile
            defaultContent.classList.add('d-none');
            chatWindow.classList.remove('d-none');
            userProfile.classList.add('d-none');
            friendProfile.classList.remove('d-none');

            // Close friend list on mobile
            friendListSection.classList.remove('active');
        });
    });

    // Exit Chat
    exitChat.addEventListener('click', () => {
        defaultContent.classList.remove('d-none');
        chatWindow.classList.add('d-none');
        userProfile.classList.remove('d-none');
        friendProfile.classList.add('d-none');
    });

    // Search and Add Friend Toggles
    searchBtn.addEventListener('click', () => {
        searchContainer.classList.remove('d-none');
        addFriendContainer.classList.add('d-none');
    });

    addFriendBtn.addEventListener('click', () => {
        addFriendContainer.classList.remove('d-none');
        searchContainer.classList.add('d-none');
    });

    closeSearch.addEventListener('click', () => {
        searchContainer.classList.add('d-none');
    });

    closeAddFriend.addEventListener('click', () => {
        addFriendContainer.classList.add('d-none');
    });

    const mobileFriendsToggle = document.getElementById('mobileFriendsToggle');

    mobileFriendsToggle.addEventListener('click', () => {
        friendListSection.classList.toggle('active');
    });

});

