// Admin management functions

function makeAdmin(countryCode, mobile) {
  if (!currentUser || currentUser.role !== CONFIG.ROLES.SUPER_ADMIN) {
    showNotification(CONFIG.MESSAGES.ERROR.SUPER_ADMIN_ONLY, "error");
    return;
  }

  const player = registeredUsers.find(
    (u) => u.countryCode === countryCode && u.mobile === mobile
  );

  if (player) {
    player.role = CONFIG.ROLES.ADMIN;
    saveRegisteredUsers();
    loadPlayers();
    showNotification(CONFIG.MESSAGES.SUCCESS.MADE_ADMIN.replace("{name}", player.name));
  }
}

function removeAdmin(countryCode, mobile) {
  if (!currentUser || currentUser.role !== CONFIG.ROLES.SUPER_ADMIN) {
    showNotification(CONFIG.MESSAGES.ERROR.SUPER_ADMIN_ONLY, "error");
    return;
  }

  const player = registeredUsers.find(
    (u) => u.countryCode === countryCode && u.mobile === mobile
  );

  if (player) {
    player.role = CONFIG.ROLES.PLAYER;
    saveRegisteredUsers();
    loadPlayers();
    showNotification(CONFIG.MESSAGES.SUCCESS.REMOVED_ADMIN.replace("{name}", player.name));
  }
}

// Make functions globally accessible for onclick handlers
window.makeAdmin = makeAdmin;
window.removeAdmin = removeAdmin;
