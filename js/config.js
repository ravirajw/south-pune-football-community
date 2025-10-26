// Application Configuration
// Central place for all constants and settings

const CONFIG = {
  // Development settings
  devOtp: "0000",
  otpTimerDuration: 30,

  // Super Admin configuration
  superAdmin: {
    name: "Raviraj Wadhwa",
    mobile: "7038780055",
    countryCode: "+91",
    avatar: "https://via.placeholder.com/40",
    positions: ["Goalkeeper"],
    role: "superAdmin",
  },

  // User roles
  roles: {
    superAdmin: "superAdmin",
    admin: "admin",
    player: "player",
  },

  // Available positions
  positions: [
    "Goalkeeper",
    "Defender",
    "Midfielder",
    "Forward",
  ],

  // Country codes for phone numbers
  countryCodes: [
    { code: "+91", flag: "🇮🇳", country: "India" },
    { code: "+1", flag: "🇺🇸", country: "USA" },
    { code: "+44", flag: "🇬🇧", country: "UK" },
    { code: "+971", flag: "🇦🇪", country: "UAE" },
  ],

  // LocalStorage keys
  storageKeys: {
    currentUser: "currentUser",
    registeredUsers: "registeredUsers",
  },

  // Validation rules
  validation: {
    mobileLength: 10,
    otpLength: 4,
    minNameLength: 2,
    minPositions: 1,
  },

  // UI Messages
  messages: {
    success: {
      login: "Welcome back, {name}!",
      register: "Registration successful! Welcome to South Pune Football Community!",
      logout: "Logged out successfully!",
      profileUpdated: "Profile updated successfully!",
      otpSent: "OTP sent successfully!",
      otpResent: "OTP resent successfully!",
      mobileVerified: "Mobile verified successfully!",
      madeAdmin: "{name} is now an admin!",
      removedAdmin: "Admin role removed from {name}",
    },
    error: {
      invalidMobile: "Please enter a valid 10-digit mobile number",
      userNotFound: "User not found! Please register first.",
      invalidOtpDev: "Invalid OTP. Please enter 0000 (development mode)",
      incompleteOtp: "Please enter complete OTP",
      invalidName: "Please enter your name",
      selectPosition: "Please select at least one position",
      superAdminOnly: "Only super admin can perform this action",
    },
  },

  // Default avatar
  defaultAvatar: "https://via.placeholder.com/40",

  // Notification settings
  notification: {
    duration: 3000, // milliseconds
    animationDuration: 300, // milliseconds
  },
};

// Freeze config to prevent modifications
Object.freeze(CONFIG);
Object.freeze(CONFIG.superAdmin);
Object.freeze(CONFIG.roles);
Object.freeze(CONFIG.positions);
Object.freeze(CONFIG.countryCodes);
Object.freeze(CONFIG.storageKeys);
Object.freeze(CONFIG.validation);
Object.freeze(CONFIG.messages);
Object.freeze(CONFIG.messages.success);
Object.freeze(CONFIG.messages.error);
Object.freeze(CONFIG.notification);
