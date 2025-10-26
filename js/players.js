// Players page functions

function loadPlayers() {
  const adminsList = document.getElementById("adminsList");
  const playersList = document.getElementById("playersList");
  const adminsSection = document.getElementById("adminsSection");
  const playersSection = document.getElementById("playersSection");
  const noPlayersMessage = document.getElementById("noPlayersMessage");

  if (!adminsList || !playersList) return;

  const admins = registeredUsers
    .filter((user) => user.role === "super_admin" || user.role === "admin")
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );

  const players = registeredUsers
    .filter((user) => !user.role || user.role === "player")
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
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
    player.avatar && player.avatar !== "https://via.placeholder.com/40"
      ? `<img src="${player.avatar}" alt="${player.name}">`
      : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>`;

  const positionsHTML =
    player.positions && player.positions.length > 0
      ? player.positions
          .map((pos) => `<span class="player-position-badge">${pos}</span>`)
          .join("")
      : '<span class="player-position-badge">No Position</span>';

  let roleBadgeHTML = "";
  if (player.role === "super_admin" || player.role === "admin") {
    roleBadgeHTML = '<span class="role-badge admin-badge">⭐ Admin</span>';
  }

  let adminControlsHTML = "";
  if (
    currentUser &&
    currentUser.role === "super_admin" &&
    player.role !== "super_admin"
  ) {
    const isMobile =
      player.mobile === currentUser.mobile &&
      player.countryCode === currentUser.countryCode;
    if (!isMobile) {
      if (player.role === "admin") {
        adminControlsHTML = `
          <button class="admin-control-btn remove-admin-btn" onclick="removeAdmin('${player.countryCode}', '${player.mobile}')">
            Remove Admin
          </button>
        `;
      } else {
        adminControlsHTML = `
          <button class="admin-control-btn make-admin-btn" onclick="makeAdmin('${player.countryCode}', '${player.mobile}')">
            Make Admin
          </button>
        `;
      }
    }
  }

  return `
    <div class="player-card">
      <div class="player-avatar">
        ${avatarHTML}
      </div>
      ${roleBadgeHTML}
      <div class="player-name">${player.name}</div>
      <div class="player-positions">
        ${positionsHTML}
      </div>
      ${adminControlsHTML}
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
        (user.role === "super_admin" || user.role === "admin") &&
        user.name.toLowerCase().includes(query)
    )
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );

  const filteredPlayers = registeredUsers
    .filter(
      (user) =>
        (!user.role || user.role === "player") &&
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
