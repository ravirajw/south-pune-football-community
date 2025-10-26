// Main application initialization and event listeners

// DOM Elements - defined globally for access across modules
const authButtons = document.getElementById("authButtons");
const userProfile = document.getElementById("userProfile");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const userProfileBtn = document.getElementById("userProfileBtn");
const userName = document.getElementById("userName");
const userAvatar = document.getElementById("userAvatar");

const loginModal = document.getElementById("loginModal");
const registerModal = document.getElementById("registerModal");
const profileModal = document.getElementById("profileModal");
const closeLogin = document.getElementById("closeLogin");
const closeRegister = document.getElementById("closeRegister");
const closeProfile = document.getElementById("closeProfile");

const loginMobileForm = document.getElementById("loginMobileForm");
const loginOtpForm = document.getElementById("loginOtpForm");
const loginSendOtpBtn = document.getElementById("loginSendOtpBtn");
const loginResendOtpBtn = document.getElementById("loginResendOtpBtn");
const loginOtpInputs = document.querySelectorAll(".login-otp-input");
const loginOtpError = document.getElementById("loginOtpError");

const registerStep1 = document.getElementById("registerStep1");
const registerStep2 = document.getElementById("registerStep2");
const stepIndicator1 = document.getElementById("stepIndicator1");
const stepIndicator2 = document.getElementById("stepIndicator2");
const mobileForm = document.getElementById("mobileForm");
const otpForm = document.getElementById("otpForm");
const profileForm = document.getElementById("profileForm");
const sendOtpBtn = document.getElementById("sendOtpBtn");
const resendOtpBtn = document.getElementById("resendOtpBtn");
const otpInputs = document.querySelectorAll(".otp-input");
const otpError = document.getElementById("otpError");
const positionError = document.getElementById("positionError");

const profileViewMode = document.getElementById("profileViewMode");
const profileEditMode = document.getElementById("profileEditMode");
const editProfileBtn = document.getElementById("editProfileBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const editProfileForm = document.getElementById("editProfileForm");
const logoutBtnProfile = document.getElementById("logoutBtnProfile");

const navTabs = document.querySelectorAll(".nav-tab");
const contentSections = document.querySelectorAll(".content-section");

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();
  loadRegisteredUsers();
  setupAuthListeners();
  setupNavigationListeners();
});

function setupAuthListeners() {
  loginBtn.addEventListener("click", () => {
    openModal(loginModal);
  });

  registerBtn.addEventListener("click", () => {
    resetRegistrationFlow();
    openModal(registerModal);
  });

  closeLogin.addEventListener("click", () => {
    closeModal(loginModal);
    resetLoginFlow();
  });

  closeRegister.addEventListener("click", () => {
    closeModal(registerModal);
    resetRegistrationFlow();
  });

  closeProfile.addEventListener("click", () => {
    closeModal(profileModal);
    showProfileView();
  });

  window.addEventListener("click", (e) => {
    if (e.target === loginModal) {
      closeModal(loginModal);
      resetLoginFlow();
    }
    if (e.target === registerModal) {
      closeModal(registerModal);
      resetRegistrationFlow();
    }
    if (e.target === profileModal) {
      closeModal(profileModal);
      showProfileView();
    }
  });

  loginMobileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleLoginSendOtp();
  });

  loginOtpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleLoginVerifyOtp();
  });

  loginResendOtpBtn.addEventListener("click", () => {
    handleLoginResendOtp();
  });

  setupLoginOtpInputs();

  mobileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSendOtp();
  });

  otpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleVerifyOtp();
  });

  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleCompleteRegistration();
  });

  resendOtpBtn.addEventListener("click", () => {
    handleResendOtp();
  });

  setupOtpInputs();

  document.getElementById("uploadPhotoBtn").addEventListener("click", () => {
    document.getElementById("profilePictureFile").click();
  });

  document
    .getElementById("profilePictureFile")
    .addEventListener("change", handleFileUpload);
  document
    .getElementById("profilePictureUrl")
    .addEventListener("input", handleUrlInput);

  userProfileBtn.addEventListener("click", () => {
    showProfileView();
    openModal(profileModal);
  });

  editProfileBtn.addEventListener("click", showProfileEdit);
  cancelEditBtn.addEventListener("click", showProfileView);
  logoutBtnProfile.addEventListener("click", handleLogout);

  editProfileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSaveProfile();
  });

  document
    .getElementById("editUploadPhotoBtn")
    .addEventListener("click", () => {
      document.getElementById("editProfilePictureFile").click();
    });

  document
    .getElementById("editProfilePictureFile")
    .addEventListener("change", handleEditFileUpload);
  document
    .getElementById("editProfilePictureUrl")
    .addEventListener("input", handleEditUrlInput);
}
