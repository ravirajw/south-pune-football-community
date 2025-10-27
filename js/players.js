// Players page functions

function loadPlayers() {
  const adminsList = document.getElementById("adminsList");
  const playersList = document.getElementById("playersList");
  const adminsSection = document.getElementById("adminsSection");
  const playersSection = document.getElementById("playersSection");
  const noPlayersMessage = document.getElementById("noPlayersMessage");

  if (!adminsList || !playersList) return;

  // Sort function to prioritize logged-in user
  const sortWithCurrentUser = (users) => {
    return users.sort((a, b) => {
      // Check if either user is the logged-in user
      const aIsCurrentUser = currentUser && 
                             a.mobile === currentUser.mobile && 
                             a.countryCode === currentUser.countryCode;
      const bIsCurrentUser = currentUser && 
                             b.mobile === currentUser.mobile && 
                             b.countryCode === currentUser.countryCode;
      
      // Logged-in user always comes first
      if (aIsCurrentUser) return -1;
      if (bIsCurrentUser) return 1;
      
      // Otherwise sort alphabetically
      return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    });
  };

  const admins = sortWithCurrentUser(
    registeredUsers.filter((user) => user.role === CONFIG.roles.superAdmin || user.role === CONFIG.roles.admin)
  );

  const players = sortWithCurrentUser(
    registeredUsers.filter((user) => !user.role || user.role === CONFIG.roles.player)
  );

  if (admins.length === 0 && players.length === 0) {
    adminsList.innerHTML = "";
    playersList.innerHTML = "";
    adminsSection.style.display = "none";
    playersSection.style.display = "none";
    noPlayersMessage.style.display = "block";
    return;
  }

  noPlayersMessage.style.display = "none";

  if (admins.length > 0) {
    adminsSection.style.display = "block";
    adminsList.innerHTML = admins
      .map((admin) => createPlayerCard(admin))
      .join("");
  } else {
    adminsSection.style.display = "none";
  }

  if (players.length > 0) {
    playersSection.style.display = "block";
    playersList.innerHTML = players
      .map((player) => createPlayerCard(player))
      .join("");
  } else {
    playersSection.style.display = "none";
  }
}

function createPlayerCard(player) {
  const avatarHTML =
    player.avatar && player.avatar !== CONFIG.defaultAvatar
      ? `<img src="${player.avatar}" alt="${player.name}">`
      : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>`;

  // Convert positions to shortcuts
  const getPositionShortcut = (position) => {
    const shortcuts = {
      'Goalkeeper': 'GK',
      'Defender': 'D',
      'Midfielder': 'M',
      'Forward': 'F'
    };
    return shortcuts[position] || position;
  };

  const positionsHTML =
    player.positions && player.positions.length > 0
      ? player.positions
          .map((pos) => `<span class="position-shortcut">${getPositionShortcut(pos)}</span>`)
          .join("")
      : '<span class="position-shortcut no-position">-</span>';

  let roleBadgeHTML = "";
  if (player.role === CONFIG.roles.superAdmin || player.role === CONFIG.roles.admin) {
    roleBadgeHTML = '<span class="role-badge admin-badge">⭐ Admin</span>';
  }

  // Check if this is the logged-in user
  const isCurrentUser = currentUser && 
                        player.mobile === currentUser.mobile && 
                        player.countryCode === currentUser.countryCode;
  
  const youBadgeHTML = isCurrentUser ? '<span class="role-badge you-badge">You</span>' : '';

  // Make player row clickable
  const onClick = `onclick="showPlayerDetail('${player.countryCode}', '${player.mobile}')"`;

  return `
    <div class="player-list-item ${isCurrentUser ? 'current-user' : ''}" ${onClick}>
      <div class="player-list-avatar">
        ${avatarHTML}
      </div>
      <div class="player-list-info">
        <div class="player-list-name">
          ${player.name}
          ${youBadgeHTML}
          ${roleBadgeHTML}
        </div>
        <div class="player-list-positions">
          ${positionsHTML}
        </div>
      </div>
    </div>
  `;
}

function filterPlayers(searchQuery) {
  const query = searchQuery.toLowerCase().trim();

  if (!query) {
    loadPlayers();
    return;
  }

  const adminsList = document.getElementById("adminsList");
  const playersList = document.getElementById("playersList");
  const adminsSection = document.getElementById("adminsSection");
  const playersSection = document.getElementById("playersSection");
  const noPlayersMessage = document.getElementById("noPlayersMessage");

  const filteredAdmins = registeredUsers
    .filter(
      (user) =>
        (user.role === CONFIG.roles.superAdmin || user.role === CONFIG.roles.admin) &&
        user.name.toLowerCase().includes(query)
    )
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );

  const filteredPlayers = registeredUsers
    .filter(
      (user) =>
        (!user.role || user.role === CONFIG.roles.player) &&
        user.name.toLowerCase().includes(query)
    )
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );

  if (filteredAdmins.length === 0 && filteredPlayers.length === 0) {
    adminsList.innerHTML = "";
    playersList.innerHTML = "";
    adminsSection.style.display = "none";
    playersSection.style.display = "none";
    noPlayersMessage.style.display = "block";
    noPlayersMessage.innerHTML =
      "<p>No players found matching your search.</p>";
  } else {
    noPlayersMessage.style.display = "none";

    if (filteredAdmins.length > 0) {
      adminsSection.style.display = "block";
      adminsList.innerHTML = filteredAdmins
        .map((admin) => createPlayerCard(admin))
        .join("");
    } else {
      adminsSection.style.display = "none";
    }

    if (filteredPlayers.length > 0) {
      playersSection.style.display = "block";
      playersList.innerHTML = filteredPlayers
        .map((player) => createPlayerCard(player))
        .join("");
    } else {
      playersSection.style.display = "none";
    }
  }
}
