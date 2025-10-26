// Authentication functions

// Migrate old role values from snake_case to camelCase
function migrateRoleValues() {
  const roleMap = {
    'super_admin': 'superAdmin',
    'admin': 'admin',
    'player': 'player'
  };

  // Migrate registered users
  registeredUsers.forEach(user => {
    if (user.role && roleMap[user.role]) {
      user.role = roleMap[user.role];
    }
  });

  // Migrate current user if logged in
  if (currentUser && currentUser.role && roleMap[currentUser.role]) {
    currentUser.role = roleMap[currentUser.role];
    localStorage.setItem(CONFIG.storageKeys.currentUser, JSON.stringify(currentUser));
  }
}

// Check login status from localStorage
function checkLoginStatus() {
  const savedUser = localStorage.getItem(CONFIG.storageKeys.currentUser);
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    isLoggedIn = true;
    updateAuthUI();
  }
}

// Load registered users from localStorage
function loadRegisteredUsers() {
  const users = localStorage.getItem(CONFIG.storageKeys.registeredUsers);
  if (users) {
    registeredUsers = JSON.parse(users);
    const needsMigration = registeredUsers.some(user => user.role && user.role.includes('_'));
    if (needsMigration) {
      migrateRoleValues(); // Migrate old role values
      saveRegisteredUsers(); // Save migrated data
    }
  }
  initializeSuperAdmin();
}

// Initialize super admin user
function initializeSuperAdmin() {
  const superAdminExists = registeredUsers.find(
    (user) => user.mobile === CONFIG.superAdmin.mobile && user.countryCode === CONFIG.superAdmin.countryCode
  );

  if (!superAdminExists) {
    registeredUsers.push({ ...CONFIG.superAdmin });
    saveRegisteredUsers();
  } else if (!superAdminExists.role) {
    superAdminExists.role = CONFIG.roles.superAdmin;
    saveRegisteredUsers();
  }
}

// Login functions
function handleLoginSendOtp() {
  const mobile = document.getElementById("loginMobileNumber").value;
  const countryCode = document.getElementById("loginCountryCode").value;

  if (mobile.length !== CONFIG.validation.mobileLength) {
    showNotification(CONFIG.messages.error.invalidMobile, "error");
    return;
  }

  const user = userExists(countryCode, mobile);
  if (!user) {
    showNotification(CONFIG.messages.error.userNotFound, "error");
    setTimeout(() => {
      closeModal(loginModal);
      resetLoginFlow();
      resetRegistrationFlow();
      openModal(registerModal);
    }, 2000);
    return;
  }

  loginData.mobile = mobile;
  loginData.countryCode = countryCode;

  loginMobileForm.style.display = "none";
  loginOtpForm.style.display = "block";
  document.getElementById(
    "loginDisplayMobile"
  ).textContent = `${countryCode} ${mobile}`;

  startLoginOtpTimer();
  showNotification(CONFIG.messages.success.otpSent);
}

function setupLoginOtpInputs() {
  loginOtpInputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
      const value = e.target.value;

      if (!/^\d*$/.test(value)) {
        e.target.value = "";
        return;
      }

      if (value && index < loginOtpInputs.length - 1) {
        loginOtpInputs[index + 1].focus();
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !e.target.value && index > 0) {
        loginOtpInputs[index - 1].focus();
      }
    });

    input.addEventListener("paste", (e) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text").slice(0, 4);

      if (/^\d+$/.test(pastedData)) {
        pastedData.split("").forEach((char, i) => {
          if (loginOtpInputs[i]) {
            loginOtpInputs[i].value = char;
          }
        });
        if (pastedData.length === 4) {
          loginOtpInputs[3].focus();
        }
      }
    });
  });
}

function handleLoginVerifyOtp() {
  const otp = Array.from(loginOtpInputs)
    .map((input) => input.value)
    .join("");

  if (otp.length !== CONFIG.validation.otpLength) {
    showLoginOtpError(CONFIG.messages.error.incompleteOtp);
    return;
  }

  if (otp === CONFIG.devOtp) {
    hideLoginOtpError();
    clearLoginOtpTimer();

    const user = userExists(loginData.countryCode, loginData.mobile);
    if (user) {
      currentUser = { ...user };
      if (!currentUser.role) {
        currentUser.role = CONFIG.roles.player;
      }
      isLoggedIn = true;
      localStorage.setItem(CONFIG.storageKeys.currentUser, JSON.stringify(currentUser));

      updateAuthUI();
      closeModal(loginModal);
      resetLoginFlow();

      showNotification(CONFIG.messages.success.login.replace("{name}", currentUser.name));

      if (currentTab === "players") {
        loadPlayers();
      }
    }
  } else {
    showLoginOtpError(CONFIG.messages.error.invalidOtpDev);
    loginOtpInputs.forEach((input) => {
      input.value = "";
      input.classList.add("error");
      setTimeout(() => input.classList.remove("error"), 400);
    });
    loginOtpInputs[0].focus();
  }
}

function handleLoginResendOtp() {
  loginOtpInputs.forEach((input) => (input.value = ""));
  loginOtpInputs[0].focus();
  hideLoginOtpError();
  startLoginOtpTimer();
  showNotification(CONFIG.messages.success.otpResent);
}

function startLoginOtpTimer() {
  loginOtpTimeRemaining = CONFIG.otpTimerDuration;
  loginResendOtpBtn.disabled = true;
  updateLoginTimerDisplay();

  loginOtpTimer = setInterval(() => {
    loginOtpTimeRemaining--;
    updateLoginTimerDisplay();

    if (loginOtpTimeRemaining <= 0) {
      clearLoginOtpTimer();
      loginResendOtpBtn.disabled = false;
      loginResendOtpBtn.innerHTML = "Resend OTP";
    }
  }, 1000);
}

function clearLoginOtpTimer() {
  if (loginOtpTimer) {
    clearInterval(loginOtpTimer);
    loginOtpTimer = null;
  }
}

function updateLoginTimerDisplay() {
  document.getElementById("loginOtpTimer").textContent = loginOtpTimeRemaining;
}

function showLoginOtpError(message) {
  loginOtpError.textContent = message;
  loginOtpError.style.display = "block";
}

function hideLoginOtpError() {
  loginOtpError.style.display = "none";
}

function resetLoginFlow() {
  if (loginMobileForm) loginMobileForm.reset();
  if (loginOtpForm) loginOtpForm.reset();

  if (loginMobileForm) loginMobileForm.style.display = "block";
  if (loginOtpForm) loginOtpForm.style.display = "none";

  loginOtpInputs.forEach((input) => (input.value = ""));
  hideLoginOtpError();
  clearLoginOtpTimer();

  loginData = {
    mobile: "",
    countryCode: "+91",
  };
}
