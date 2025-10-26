// Admin management functions

function makeAdmin(countryCode, mobile) {
  if (!currentUser || currentUser.role !== "super_admin") {
    showNotification("Only super admin can make admins", "error");
    return;
  }

  const player = registeredUsers.find(
    (u) => u.countryCode === countryCode && u.mobile === mobile
  );

  if (player) {
    player.role = "admin";
    saveRegisteredUsers();
    loadPlayers();
    showNotification(`${player.name} is now an admin!`);
  }
}

function removeAdmin(countryCode, mobile) {
  if (!currentUser || currentUser.role !== "super_admin") {
    showNotification("Only super admin can remove admins", "error");
    return;
  }

  const player = registeredUsers.find(
    (u) => u.countryCode === countryCode && u.mobile === mobile
  );

  if (player) {
    player.role = "player";
    saveRegisteredUsers();
    loadPlayers();
    showNotification(`Admin role removed from ${player.name}`);
  }
}

// Make functions globally accessible for onclick handlers
window.makeAdmin = makeAdmin;
window.removeAdmin = removeAdmin;
