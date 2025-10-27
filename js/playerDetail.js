// Player Detail View Module
// Handles displaying individual player details and admin actions

let currentPlayerDetail = null;

// Show player detail modal
function showPlayerDetail(countryCode, mobile) {
  const player = registeredUsers.find(
    (u) => u.countryCode === countryCode && u.mobile === mobile
  );

  if (!player) return;

  currentPlayerDetail = player;
  const modal = document.getElementById("playerDetailModal");
  
  // Make sure view mode is shown and edit mode is hidden
  document.getElementById("playerDetailViewMode").style.display = "block";
  document.getElementById("playerDetailEditMode").style.display = "none";
  
  // Populate player information
  populatePlayerDetail(player);
  
  // Show/hide admin actions based on user role
  updatePlayerDetailActions(player);
  
  openModal(modal);
}

// Populate player detail view
function populatePlayerDetail(player) {
  // Check if viewing own profile
  const isSelf = currentUser && 
                 player.mobile === currentUser.mobile && 
                 player.countryCode === currentUser.countryCode;
  
  // Avatar
  const avatarContainer = document.getElementById("playerDetailAvatar");
  if (player.avatar && player.avatar !== CONFIG.defaultAvatar) {
    avatarContainer.innerHTML = `<img src="${player.avatar}" alt="${player.name}">`;
  } else {
    avatarContainer.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
      </svg>
    `;
  }

  // Name
  document.getElementById("playerDetailName").textContent = player.name;

  // Role badge
  const roleBadgeContainer = document.getElementById("playerDetailRoleBadge");
  if (player.role === CONFIG.roles.superAdmin || player.role === CONFIG.roles.admin) {
    roleBadgeContainer.innerHTML = '<span class="role-badge admin-badge">⭐ Admin</span>';
    roleBadgeContainer.style.display = "block";
  } else {
    roleBadgeContainer.style.display = "none";
  }

  // Phone number (visible to self OR admins/super admins)
  const phoneRow = document.getElementById("playerDetailPhoneRow");
  const phoneContainer = document.getElementById("playerDetailPhone");
  if (isSelf || (currentUser && (currentUser.role === CONFIG.roles.superAdmin || currentUser.role === CONFIG.roles.admin))) {
    phoneContainer.textContent = `${player.countryCode} ${player.mobile}`;
    phoneRow.style.display = "flex";
  } else {
    phoneRow.style.display = "none";
  }

  // Positions
  const positionsContainer = document.getElementById("playerDetailPositions");
  if (player.positions && player.positions.length > 0) {
    positionsContainer.innerHTML = player.positions
      .map((pos) => `<span class="position-badge">${pos}</span>`)
      .join("");
  } else {
    positionsContainer.innerHTML = "<p>No positions selected</p>";
  }
}

// Update admin action buttons visibility
function updatePlayerDetailActions(player) {
  const selfActionsContainer = document.getElementById("playerDetailSelfActions");
  const adminActionsContainer = document.getElementById("playerDetailAdminActions");
  const adminToggleBtn = document.getElementById("playerDetailAdminToggle");
  
  // Check if viewing own profile
  const isSelf = currentUser && 
                 player.mobile === currentUser.mobile && 
                 player.countryCode === currentUser.countryCode;
  
  // Check if player is super admin
  const isSuperAdmin = player.role === CONFIG.roles.superAdmin;
  
  // Check if current user is admin or super admin
  const isAdmin = currentUser && 
                  (currentUser.role === CONFIG.roles.superAdmin || 
                   currentUser.role === CONFIG.roles.admin);

  // Show self actions if viewing own profile
  if (isSelf) {
    selfActionsContainer.style.display = "block";
    adminActionsContainer.style.display = "none";
  } 
  // Show admin actions if admin viewing others (not super admin)
  else if (isAdmin && !isSuperAdmin) {
    selfActionsContainer.style.display = "none";
    adminActionsContainer.style.display = "block";
    
    // Show/hide admin toggle button
    if (currentUser.role === CONFIG.roles.superAdmin) {
      adminToggleBtn.style.display = "block";
      if (player.role === CONFIG.roles.admin) {
        adminToggleBtn.textContent = "Remove Admin";
        adminToggleBtn.className = "btn btn-secondary";
      } else {
        adminToggleBtn.textContent = "Make Admin";
        adminToggleBtn.className = "btn btn-primary";
      }
    } else {
      adminToggleBtn.style.display = "none";
    }
  } 
  // Hide all actions
  else {
    selfActionsContainer.style.display = "none";
    adminActionsContainer.style.display = "none";
  }
}

// Handle admin toggle
function handlePlayerDetailAdminToggle() {
  if (!currentPlayerDetail) return;

  if (currentPlayerDetail.role === CONFIG.roles.admin) {
    removeAdmin(currentPlayerDetail.countryCode, currentPlayerDetail.mobile);
  } else {
    makeAdmin(currentPlayerDetail.countryCode, currentPlayerDetail.mobile);
  }

  // Refresh detail view
  showPlayerDetail(currentPlayerDetail.countryCode, currentPlayerDetail.mobile);
}

// Handle delete player with optional block
function handlePlayerDetailDelete() {
  if (!currentPlayerDetail) return;

  const player = currentPlayerDetail;
  
  // Show custom delete confirmation modal
  showDeleteConfirmModal(player);
}

// Show delete confirmation modal
function showDeleteConfirmModal(player) {
  const modal = document.getElementById("deleteConfirmModal");
  const playerNameSpan = document.getElementById("deletePlayerName");
  const checkbox = document.getElementById("deleteBlockCheckbox");
  const blockInfo = document.getElementById("blockInfoText");
  const confirmBtn = document.getElementById("confirmDeleteBtn");
  const deleteOptions = document.querySelector(".delete-options");
  
  // Set player name
  playerNameSpan.textContent = player.name;
  
  // Check if it's self-deletion
  const isSelf = currentUser && 
                 player.mobile === currentUser.mobile && 
                 player.countryCode === currentUser.countryCode;
  
  // Hide block option for self-deletion
  if (isSelf) {
    deleteOptions.style.display = "none";
    confirmBtn.textContent = "Delete";
    confirmBtn.style.backgroundColor = "#ff9800";
  } else {
    deleteOptions.style.display = "block";
    
    // Reset checkbox
    checkbox.checked = false;
    blockInfo.style.display = "none";
    confirmBtn.textContent = "Delete";
    confirmBtn.style.backgroundColor = "#ff9800";
    
    // Add checkbox change handler
    checkbox.onchange = function() {
      if (this.checked) {
        blockInfo.style.display = "block";
        confirmBtn.textContent = "Delete & Block";
        confirmBtn.style.backgroundColor = "#f44336";
      } else {
        blockInfo.style.display = "none";
        confirmBtn.textContent = "Delete";
        confirmBtn.style.backgroundColor = "#ff9800";
      }
    };
  }
  
  // Show modal
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
}

// Close delete confirmation modal
function closeDeleteConfirmModal() {
  const modal = document.getElementById("deleteConfirmModal");
  modal.style.display = "none";
}

// Confirm delete player
function confirmDeletePlayer() {
  if (!currentPlayerDetail) return;

  const checkbox = document.getElementById("deleteBlockCheckbox");
  const shouldBlock = checkbox.checked;
  
  const player = currentPlayerDetail;
  
  // Check if user is deleting themselves
  const isSelf = currentUser && 
                 player.mobile === currentUser.mobile && 
                 player.countryCode === currentUser.countryCode;

  if (shouldBlock) {
    // Block and delete
    blockPlayerFromDetail(player.countryCode, player.mobile);
  } else {
    // Just delete
    deletePlayerFromDetail(player.countryCode, player.mobile);
  }

  // Close both modals
  closeDeleteConfirmModal();
  closeModal(document.getElementById("playerDetailModal"));
  
  // If user deleted themselves, log them out
  if (isSelf) {
    setTimeout(() => {
      logout();
    }, 500);
  }
}

// Delete player without blocking (internal function)
function deletePlayerFromDetail(countryCode, mobile) {
  const player = registeredUsers.find(
    (u) => u.countryCode === countryCode && u.mobile === mobile
  );

  if (!player) return;

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

// Block player (includes deletion) (internal function)
function blockPlayerFromDetail(countryCode, mobile) {
  const player = registeredUsers.find(
    (u) => u.countryCode === countryCode && u.mobile === mobile
  );

  if (!player) return;

  // Add to blocked list
  const blockIdentifier = `${countryCode}:${mobile}`;
  if (!blockedUsers.includes(blockIdentifier)) {
    blockedUsers.push(blockIdentifier);
    saveBlockedUsers();
  }

  // Remove from registered users (delete)
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

// Enter edit mode
function enterEditMode() {
  if (!currentPlayerDetail) return;
  
  const player = currentPlayerDetail;
  const viewMode = document.getElementById("playerDetailViewMode");
  const editMode = document.getElementById("playerDetailEditMode");
  
  // Populate edit form
  const editAvatar = document.getElementById("playerDetailEditAvatar");
  if (player.avatar && player.avatar !== CONFIG.defaultAvatar) {
    editAvatar.innerHTML = `<img src="${player.avatar}" alt="${player.name}">`;
  } else {
    editAvatar.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
      </svg>
    `;
  }
  
  document.getElementById("playerDetailEditName").value = player.name;
  
  // Set positions
  const positionCheckboxes = document.querySelectorAll('input[name="editPositions"]');
  positionCheckboxes.forEach(checkbox => {
    checkbox.checked = player.positions && player.positions.includes(checkbox.value);
  });
  
  // Handle avatar upload
  const avatarInput = document.getElementById("playerDetailAvatarInput");
  avatarInput.onchange = function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        editAvatar.innerHTML = `<img src="${event.target.result}" alt="Avatar">`;
        currentPlayerDetail.tempAvatar = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Switch to edit mode
  viewMode.style.display = "none";
  editMode.style.display = "block";
  
  // Attach form submit handler
  const editForm = document.getElementById('playerDetailEditForm');
  if (editForm) {
    // Remove any existing listener
    editForm.onsubmit = handlePlayerDetailEdit;
  }
}

// Cancel edit mode
function cancelEditMode() {
  const viewMode = document.getElementById("playerDetailViewMode");
  const editMode = document.getElementById("playerDetailEditMode");
  
  delete currentPlayerDetail.tempAvatar;
  
  viewMode.style.display = "block";
  editMode.style.display = "none";
}

// Handle edit form submission
function handlePlayerDetailEdit(e) {
  e.preventDefault();
  
  console.log("Form submitted");
  
  if (!currentPlayerDetail || !currentUser) {
    console.log("Missing currentPlayerDetail or currentUser");
    return;
  }
  
  const name = document.getElementById("playerDetailEditName").value.trim();
  const selectedPositions = Array.from(document.querySelectorAll('input[name="editPositions"]:checked'))
    .map(checkbox => checkbox.value);
  
  console.log("Name:", name, "Positions:", selectedPositions);
  
  // Validation
  if (!name) {
    showNotification("Please enter your name", "error");
    return;
  }
  
  if (selectedPositions.length === 0) {
    showNotification("Please select at least one position", "error");
    return;
  }
  
  // Update user
  const userIndex = registeredUsers.findIndex(
    u => u.mobile === currentUser.mobile && u.countryCode === currentUser.countryCode
  );
  
  console.log("User index:", userIndex);
  
  if (userIndex !== -1) {
    registeredUsers[userIndex].name = name;
    registeredUsers[userIndex].positions = selectedPositions;
    
    if (currentPlayerDetail.tempAvatar) {
      registeredUsers[userIndex].avatar = currentPlayerDetail.tempAvatar;
      delete currentPlayerDetail.tempAvatar;
    }
    
    saveRegisteredUsers();
    
    // Update current user
    currentUser.name = name;
    currentUser.positions = selectedPositions;
    if (registeredUsers[userIndex].avatar) {
      currentUser.avatar = registeredUsers[userIndex].avatar;
    }
    localStorage.setItem(CONFIG.storageKeys.currentUser, JSON.stringify(currentUser));
    
    // Update UI
    updateAuthUI();
    
    // Refresh players list if on players tab
    if (typeof loadPlayers === 'function') {
      loadPlayers();
    }
    
    // Show success message
    showNotification("Profile updated successfully!");
    
    // Switch back to view mode
    cancelEditMode();
    
    // Refresh the player detail view
    populatePlayerDetail(currentUser);
    updatePlayerDetailActions(currentUser);
  }
}

// Make functions globally accessible
window.showPlayerDetail = showPlayerDetail;
window.handlePlayerDetailAdminToggle = handlePlayerDetailAdminToggle;
window.handlePlayerDetailDelete = handlePlayerDetailDelete;
window.closeDeleteConfirmModal = closeDeleteConfirmModal;
window.confirmDeletePlayer = confirmDeletePlayer;
window.enterEditMode = enterEditMode;
window.cancelEditMode = cancelEditMode;
