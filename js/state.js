// Global state management
// All application state variables

let isLoggedIn = false;
let currentUser = null;
let currentTab = "tournaments";
let registrationData = {
  mobile: "",
  countryCode: "+91",
  name: "",
  profilePicture: "",
  positions: [],
};
let loginData = {
  mobile: "",
  countryCode: "+91",
};
let otpTimer = null;
let otpTimeRemaining = CONFIG.OTP_TIMER_DURATION;
let loginOtpTimer = null;
let loginOtpTimeRemaining = CONFIG.OTP_TIMER_DURATION;
let registeredUsers = [];
