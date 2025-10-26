// Profile management functions

function handleLogout() {
  if (confirm("Are you sure you want to logout?")) {
    isLoggedIn = false;
    currentUser = null;
    localStorage.removeItem("currentUser");
    updateAuthUI();
    closeModal(profileModal);
    showNotification("Logged out successfully!");

    if (currentTab === "players") {
      loadPlayers();
    }
  }
}

function updateAuthUI() {
  if (isLoggedIn && currentUser) {
    authButtons.style.display = "none";
    userProfile.style.display = "block";
    userName.textContent = currentUser.name;

    const avatarDiv = document.getElementById("userAvatar");
    if (
      currentUser.avatar &&
      currentUser.avatar !== "https://via.placeholder.com/40"
    ) {
      avatarDiv.innerHTML = `<img src="${currentUser.avatar}" alt="${currentUser.name}">`;
    } else {
      avatarDiv.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>
      `;
    }
  } else {
    authButtons.style.display = "flex";
    userProfile.style.display = "none";
  }
}

function showProfileView() {
  profileViewMode.style.display = "block";
  profileEditMode.style.display = "none";

  if (currentUser) {
    const profilePicDisplay = document.getElementById("profilePicDisplay");
    if (
      currentUser.avatar &&
      currentUser.avatar !== "https://via.placeholder.com/40"
    ) {
      profilePicDisplay.innerHTML = `<img src="${currentUser.avatar}" alt="${currentUser.name}">`;
    } else {
      profilePicDisplay.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>
      `;
    }

    document.getElementById("displayName").textContent = currentUser.name;

    const mobileDisplay = currentUser.countryCode
      ? `${currentUser.countryCode} ${currentUser.mobile}`
      : currentUser.mobile || "Not provided";
    document.getElementById("displayMobileProfile").textContent = mobileDisplay;

    const positionsDisplay = document.getElementById("displayPositions");
    if (currentUser.positions && currentUser.positions.length > 0) {
      positionsDisplay.innerHTML = currentUser.positions
        .map((pos) => `<span class="position-badge">${pos}</span>`)
        .join("");
    } else {
      positionsDisplay.innerHTML = "<p>No positions selected</p>";
    }
  }
}

function showProfileEdit() {
  profileViewMode.style.display = "none";
  profileEditMode.style.display = "block";

  if (currentUser) {
    document.getElementById("editName").value = currentUser.name;

    if (
      currentUser.avatar &&
      currentUser.avatar !== "https://via.placeholder.com/40"
    ) {
      document.getElementById(
        "editProfilePreview"
      ).innerHTML = `<img src="${currentUser.avatar}" alt="Profile Preview">`;
    }

    document
      .querySelectorAll('input[name="editPosition"]')
      .forEach((checkbox) => {
        checkbox.checked =
          currentUser.positions &&
          currentUser.positions.includes(checkbox.value);
      });
  }
}

function handleEditFileUpload(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      registrationData.profilePicture = event.target.result;
      document.getElementById(
        "editProfilePreview"
      ).innerHTML = `<img src="${event.target.result}" alt="Profile Preview">`;
    };
    reader.readAsDataURL(file);
    document.getElementById("editProfilePictureUrl").value = "";
  }
}

function handleEditUrlInput(e) {
  const url = e.target.value;
  if (url) {
    registrationData.profilePicture = url;
    document.getElementById(
      "editProfilePreview"
    ).innerHTML = `<img src="${url}" alt="Profile Preview">`;
  } else {
    document.getElementById("editProfilePreview").innerHTML = "";
  }
}

function handleSaveProfile() {
  const name = document.getElementById("editName").value;
  const positions = Array.from(
    document.querySelectorAll('input[name="editPosition"]:checked')
  ).map((checkbox) => checkbox.value);

  if (!name.trim()) {
    showNotification("Please enter your name", "error");
    return;
  }

  if (positions.length === 0) {
    document.getElementById("editPositionError").textContent =
      "Please select at least one position";
    document.getElementById("editPositionError").style.display = "block";
    return;
  }

  document.getElementById("editPositionError").style.display = "none";

  // Update current user
  currentUser.name = name;
  currentUser.positions = positions;

  if (registrationData.profilePicture) {
    currentUser.avatar = registrationData.profilePicture;
    registrationData.profilePicture = "";
  }

  // Update user in registeredUsers array
  const userIndex = registeredUsers.findIndex(
    (u) => u.countryCode === currentUser.countryCode && u.mobile === currentUser.mobile
  );

  if (userIndex !== -1) {
    registeredUsers[userIndex].name = currentUser.name;
    registeredUsers[userIndex].positions = currentUser.positions;
    registeredUsers[userIndex].avatar = currentUser.avatar;
  }

  // Save both to localStorage
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  saveRegisteredUsers();

  updateAuthUI();
  showProfileView();

  showNotification("Profile updated successfully!");

  // Refresh Players page if currently on Players tab
  if (currentTab === "players") {
    loadPlayers();
  }
}
