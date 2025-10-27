// Player Management functions - delete and block

// Load blocked users from localStorage
function loadBlockedUsers() {
  const blocked = localStorage.getItem(CONFIG.storageKeys.blockedUsers);
  if (blocked) {
    blockedUsers = JSON.parse(blocked);
  }
}

// Save blocked users to localStorage
function saveBlockedUsers() {
  localStorage.setItem(CONFIG.storageKeys.blockedUsers, JSON.stringify(blockedUsers));
}

// Delete own account (for regular users)
function deleteOwnAccount() {
  if (!currentUser) return;

  // Super admin and admins need special handling
  if (currentUser.role === CONFIG.roles.superAdmin) {
    if (!confirm("Are you sure you want to delete the super admin account? This action cannot be undone!")) {
      return;
    }
  } else if (currentUser.role === CONFIG.roles.admin) {
    showNotification(CONFIG.messages.error.cannotDeleteSelf, "error");
    return;
  }

  if (!confirm("Are you sure you want to delete your account? This action cannot be undone!")) {
    return;
  }

  // Remove from registered users
  const userIndex = registeredUsers.findIndex(
    (u) => u.countryCode === currentUser.countryCode && u.mobile === currentUser.mobile
  );

  if (userIndex !== -1) {
    registeredUsers.splice(userIndex, 1);
    saveRegisteredUsers();
  }

  // Logout
  isLoggedIn = false;
  localStorage.removeItem(CONFIG.storageKeys.currentUser);
  currentUser = null;
  
  updateAuthUI();
  closeModal(profileModal);
  showNotification(CONFIG.messages.success.accountDeleted);

  if (currentTab === "players") {
    loadPlayers();
  }
}

// Delete player (admin/super admin only)
function deletePlayer(countryCode, mobile) {
  if (!currentUser || (currentUser.role !== CONFIG.roles.superAdmin && currentUser.role !== CONFIG.roles.admin)) {
    showNotification(CONFIG.messages.error.superAdminOnly, "error");
    return;
  }

  // Find the player
  const player = registeredUsers.find(
    (u) => u.countryCode === countryCode && u.mobile === mobile
  );

  if (!player) return;

  // Cannot delete super admin
  if (player.role === CONFIG.roles.superAdmin) {
    showNotification(CONFIG.messages.error.cannotBlockSuperAdmin, "error");
    return;
  }

  // Confirm deletion
  if (!confirm(`Are you sure you want to delete ${player.name}? This action cannot be undone!`)) {
    return;
  }

  // Remove from registered users
  const userIndex = registeredUsers.findIndex(
    (u) => u.countryCode === countryCode && u.mobile === mobile
  );

  if (userIndex !== -1) {
    registeredUsers.splice(userIndex, 1);
    saveRegisteredUsers();
    loadPlayers();
    showNotification(CONFIG.messages.success.playerDeleted.replace("{name}", player.name));
  }
}

// Block player (admin/super admin only)
function blockPlayer(countryCode, mobile) {
  if (!currentUser || (currentUser.role !== CONFIG.roles.superAdmin && currentUser.role !== CONFIG.roles.admin)) {
    showNotification(CONFIG.messages.error.superAdminOnly, "error");
    return;
  }

  // Find the player
  const player = registeredUsers.find(
    (u) => u.countryCode === countryCode && u.mobile === mobile
  );

  if (!player) return;

  // Cannot block super admin
  if (player.role === CONFIG.roles.superAdmin) {
    showNotification(CONFIG.messages.error.cannotBlockSuperAdmin, "error");
    return;
  }

  // Confirm blocking
  if (!confirm(`Are you sure you want to block ${player.name}? They will not be able to register again with this mobile number.`)) {
    return;
  }

  // Add to blocked list
  const blockIdentifier = `${countryCode}:${mobile}`;
  if (!blockedUsers.includes(blockIdentifier)) {
    blockedUsers.push(blockIdentifier);
    saveBlockedUsers();
  }

  // Remove from registered users
  const userIndex = registeredUsers.findIndex(
    (u) => u.countryCode === countryCode && u.mobile === mobile
  );

  if (userIndex !== -1) {
    registeredUsers.splice(userIndex, 1);
    saveRegisteredUsers();
    loadPlayers();
    showNotification(CONFIG.messages.success.playerBlocked.replace("{name}", player.name));
  }
}

// Make functions globally accessible for onclick handlers
window.deletePlayer = deletePlayer;
window.blockPlayer = blockPlayer;
window.deleteOwnAccount = deleteOwnAccount;
