// Admin management functions

function makeAdmin(countryCode, mobile) {
  if (!currentUser || currentUser.role !== CONFIG.roles.superAdmin) {
    showNotification(CONFIG.messages.error.superAdminOnly, "error");
    return;
  }

  const player = registeredUsers.find(
    (u) => u.countryCode === countryCode && u.mobile === mobile
  );

  if (player) {
    player.role = CONFIG.roles.admin;
    saveRegisteredUsers();
    loadPlayers();
    showNotification(CONFIG.messages.success.madeAdmin.replace("{name}", player.name));
  }
}

function removeAdmin(countryCode, mobile) {
  if (!currentUser || currentUser.role !== CONFIG.roles.superAdmin) {
    showNotification(CONFIG.messages.error.superAdminOnly, "error");
    return;
  }

  const player = registeredUsers.find(
    (u) => u.countryCode === countryCode && u.mobile === mobile
  );

  if (player) {
    player.role = CONFIG.roles.player;
    saveRegisteredUsers();
    loadPlayers();
    showNotification(CONFIG.messages.success.removedAdmin.replace("{name}", player.name));
  }
}

// Make functions globally accessible for onclick handlers
window.makeAdmin = makeAdmin;
window.removeAdmin = removeAdmin;
