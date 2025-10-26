// Registration functions

function handleSendOtp() {
  const mobile = document.getElementById("mobileNumber").value;
  const countryCode = document.getElementById("countryCode").value;

  if (mobile.length !== CONFIG.VALIDATION.MOBILE_LENGTH) {
    showNotification(CONFIG.MESSAGES.ERROR.INVALID_MOBILE, "error");
    return;
  }

  registrationData.mobile = mobile;
  registrationData.countryCode = countryCode;

  mobileForm.style.display = "none";
  otpForm.style.display = "block";
  document.getElementById(
    "displayMobile"
  ).textContent = `${countryCode} ${mobile}`;

  startOtpTimer();
  showNotification(CONFIG.MESSAGES.SUCCESS.OTP_SENT);
}

function setupOtpInputs() {
  otpInputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
      const value = e.target.value;

      if (!/^\d*$/.test(value)) {
        e.target.value = "";
        return;
      }

      if (value && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !e.target.value && index > 0) {
        otpInputs[index - 1].focus();
      }
    });

    input.addEventListener("paste", (e) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text").slice(0, 4);

      if (/^\d+$/.test(pastedData)) {
        pastedData.split("").forEach((char, i) => {
          if (otpInputs[i]) {
            otpInputs[i].value = char;
          }
        });
        if (pastedData.length === 4) {
          otpInputs[3].focus();
        }
      }
    });
  });
}

function handleVerifyOtp() {
  const otp = Array.from(otpInputs)
    .map((input) => input.value)
    .join("");

  if (otp.length !== CONFIG.VALIDATION.OTP_LENGTH) {
    showOtpError(CONFIG.MESSAGES.ERROR.INCOMPLETE_OTP);
    return;
  }

  if (otp === CONFIG.DEV_OTP) {
    hideOtpError();
    clearOtpTimer();
    showNotification(CONFIG.MESSAGES.SUCCESS.MOBILE_VERIFIED);
    goToStep(2);
  } else {
    showOtpError(CONFIG.MESSAGES.ERROR.INVALID_OTP_DEV);
    otpInputs.forEach((input) => {
      input.value = "";
      input.classList.add("error");
      setTimeout(() => input.classList.remove("error"), 400);
    });
    otpInputs[0].focus();
  }
}

function handleResendOtp() {
  otpInputs.forEach((input) => (input.value = ""));
  otpInputs[0].focus();
  hideOtpError();
  startOtpTimer();
  showNotification(CONFIG.MESSAGES.SUCCESS.OTP_RESENT);
}

function startOtpTimer() {
  otpTimeRemaining = CONFIG.OTP_TIMER_DURATION;
  resendOtpBtn.disabled = true;
  updateTimerDisplay();

  otpTimer = setInterval(() => {
    otpTimeRemaining--;
    updateTimerDisplay();

    if (otpTimeRemaining <= 0) {
      clearOtpTimer();
      resendOtpBtn.disabled = false;
      resendOtpBtn.innerHTML = "Resend OTP";
    }
  }, 1000);
}

function clearOtpTimer() {
  if (otpTimer) {
    clearInterval(otpTimer);
    otpTimer = null;
  }
}

function updateTimerDisplay() {
  document.getElementById("otpTimer").textContent = otpTimeRemaining;
}

function showOtpError(message) {
  otpError.textContent = message;
  otpError.style.display = "block";
}

function hideOtpError() {
  otpError.style.display = "none";
}

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      registrationData.profilePicture = event.target.result;
      showProfilePreview(event.target.result);
    };
    reader.readAsDataURL(file);
    document.getElementById("profilePictureUrl").value = "";
  }
}

function handleUrlInput(e) {
  const url = e.target.value;
  if (url) {
    registrationData.profilePicture = url;
    showProfilePreview(url);
  } else {
    document.getElementById("profilePreview").innerHTML = "";
  }
}

function showProfilePreview(src) {
  const preview = document.getElementById("profilePreview");
  preview.innerHTML = `<img src="${src}" alt="Profile Preview">`;
}

function handleCompleteRegistration() {
  const name = document.getElementById("registerName").value;
  const positions = Array.from(
    document.querySelectorAll('input[name="position"]:checked')
  ).map((checkbox) => checkbox.value);

  if (!name.trim() || name.trim().length < CONFIG.VALIDATION.MIN_NAME_LENGTH) {
    showNotification(CONFIG.MESSAGES.ERROR.INVALID_NAME, "error");
    return;
  }

  if (positions.length < CONFIG.VALIDATION.MIN_POSITIONS) {
    positionError.textContent = CONFIG.MESSAGES.ERROR.SELECT_POSITION;
    positionError.style.display = "block";
    return;
  }

  positionError.style.display = "none";

  registrationData.name = name;
  registrationData.positions = positions;

  currentUser = {
    name: registrationData.name,
    mobile: registrationData.mobile,
    countryCode: registrationData.countryCode,
    avatar: registrationData.profilePicture || CONFIG.DEFAULT_AVATAR,
    positions: registrationData.positions,
    role: CONFIG.ROLES.PLAYER,
  };

  registeredUsers.push({
    name: currentUser.name,
    mobile: currentUser.mobile,
    countryCode: currentUser.countryCode,
    avatar: currentUser.avatar,
    positions: currentUser.positions,
    role: currentUser.role,
  });
  saveRegisteredUsers();

  isLoggedIn = true;
  localStorage.setItem(CONFIG.STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));

  updateAuthUI();
  closeModal(registerModal);
  resetRegistrationFlow();

  showNotification(
    CONFIG.MESSAGES.SUCCESS.REGISTRATION_SUCCESS,
    "success"
  );

  if (currentTab === "players") {
    loadPlayers();
  }
}

function goToStep(stepNumber) {
  if (stepNumber === 1) {
    registerStep1.classList.add("active");
    registerStep2.classList.remove("active");
    stepIndicator1.classList.add("active");
    stepIndicator2.classList.remove("active");
  } else if (stepNumber === 2) {
    registerStep1.classList.remove("active");
    registerStep2.classList.add("active");
    stepIndicator1.classList.remove("active");
    stepIndicator2.classList.add("active");
  }
}

function resetRegistrationFlow() {
  goToStep(1);

  if (mobileForm) mobileForm.reset();
  if (otpForm) otpForm.reset();
  if (profileForm) profileForm.reset();

  if (mobileForm) mobileForm.style.display = "block";
  if (otpForm) otpForm.style.display = "none";

  otpInputs.forEach((input) => (input.value = ""));
  hideOtpError();
  clearOtpTimer();

  registrationData = {
    mobile: "",
    countryCode: "+91",
    name: "",
    profilePicture: "",
    positions: [],
  };

  document.getElementById("profilePreview").innerHTML = "";
  document
    .querySelectorAll('input[name="position"]')
    .forEach((cb) => (cb.checked = false));
}
