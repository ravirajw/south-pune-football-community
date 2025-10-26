// Authentication functions

// Check login status from localStorage
function checkLoginStatus() {
  const savedUser = localStorage.getItem(CONFIG.STORAGE_KEYS.CURRENT_USER);
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    isLoggedIn = true;
    updateAuthUI();
  }
}

// Load registered users from localStorage
function loadRegisteredUsers() {
  const users = localStorage.getItem(CONFIG.STORAGE_KEYS.REGISTERED_USERS);
  if (users) {
    registeredUsers = JSON.parse(users);
  }
  initializeSuperAdmin();
}

// Initialize super admin user
function initializeSuperAdmin() {
  const superAdminExists = registeredUsers.find(
    (user) => user.mobile === CONFIG.SUPER_ADMIN.mobile && user.countryCode === CONFIG.SUPER_ADMIN.countryCode
  );

  if (!superAdminExists) {
    registeredUsers.push({ ...CONFIG.SUPER_ADMIN });
    saveRegisteredUsers();
  } else if (!superAdminExists.role) {
    superAdminExists.role = CONFIG.ROLES.SUPER_ADMIN;
    saveRegisteredUsers();
  }
}

// Login functions
function handleLoginSendOtp() {
  const mobile = document.getElementById("loginMobileNumber").value;
  const countryCode = document.getElementById("loginCountryCode").value;

  if (mobile.length !== CONFIG.VALIDATION.MOBILE_LENGTH) {
    showNotification(CONFIG.MESSAGES.ERROR.INVALID_MOBILE, "error");
    return;
  }

  const user = userExists(countryCode, mobile);
  if (!user) {
    showNotification(CONFIG.MESSAGES.ERROR.USER_NOT_FOUND, "error");
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
  showNotification("OTP sent successfully!");
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

  if (otp.length !== CONFIG.VALIDATION.OTP_LENGTH) {
    showLoginOtpError(CONFIG.MESSAGES.ERROR.INCOMPLETE_OTP);
    return;
  }

  if (otp === CONFIG.DEV_OTP) {
    hideLoginOtpError();
    clearLoginOtpTimer();

    const user = userExists(loginData.countryCode, loginData.mobile);
    if (user) {
      currentUser = { ...user };
      if (!currentUser.role) {
        currentUser.role = CONFIG.ROLES.PLAYER;
      }
      isLoggedIn = true;
      localStorage.setItem(CONFIG.STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));

      updateAuthUI();
      closeModal(loginModal);
      resetLoginFlow();

      showNotification(CONFIG.MESSAGES.SUCCESS.WELCOME_BACK.replace("{name}", currentUser.name));

      if (currentTab === "players") {
        loadPlayers();
      }
    }
  } else {
    showLoginOtpError(CONFIG.MESSAGES.ERROR.INVALID_OTP_DEV);
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
  showNotification(CONFIG.MESSAGES.SUCCESS.OTP_RESENT);
}

function startLoginOtpTimer() {
  loginOtpTimeRemaining = CONFIG.OTP_TIMER_DURATION;
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
