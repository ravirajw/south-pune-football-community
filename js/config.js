// Application Configuration
// Central place for all constants and settings

const CONFIG = {
  // Development settings
  DEV_OTP: "0000",
  OTP_TIMER_DURATION: 30,

  // Super Admin configuration
  SUPER_ADMIN: {
    name: "Raviraj Wadhwa",
    mobile: "7038780055",
    countryCode: "+91",
    avatar: "https://via.placeholder.com/40",
    positions: ["Goalkeeper"],
    role: "super_admin",
  },

  // User roles
  ROLES: {
    SUPER_ADMIN: "super_admin",
    ADMIN: "admin",
    PLAYER: "player",
  },

  // Available positions
  POSITIONS: [
    "Goalkeeper",
    "Defender",
    "Midfielder",
    "Forward",
  ],

  // Country codes for phone numbers
  COUNTRY_CODES: [
    { code: "+91", flag: "🇮🇳", country: "India" },
    { code: "+1", flag: "🇺🇸", country: "USA" },
    { code: "+44", flag: "🇬🇧", country: "UK" },
    { code: "+971", flag: "🇦🇪", country: "UAE" },
  ],

  // LocalStorage keys
  STORAGE_KEYS: {
    CURRENT_USER: "currentUser",
    REGISTERED_USERS: "registeredUsers",
  },

  // Validation rules
  VALIDATION: {
    MOBILE_LENGTH: 10,
    OTP_LENGTH: 4,
    MIN_NAME_LENGTH: 2,
    MIN_POSITIONS: 1,
  },

  // UI Messages
  MESSAGES: {
    SUCCESS: {
      LOGIN: "Welcome back, {name}!",
      REGISTER: "Registration successful! Welcome to South Pune Football Community!",
      LOGOUT: "Logged out successfully!",
      PROFILE_UPDATED: "Profile updated successfully!",
      OTP_SENT: "OTP sent successfully!",
      OTP_RESENT: "OTP resent successfully!",
      MOBILE_VERIFIED: "Mobile verified successfully!",
      ADMIN_ADDED: "{name} is now an admin!",
      ADMIN_REMOVED: "Admin role removed from {name}",
    },
    ERROR: {
      INVALID_MOBILE: "Please enter a valid 10-digit mobile number",
      USER_NOT_FOUND: "User not found! Please register first.",
      INVALID_OTP: "Invalid OTP. Please enter 0000 (development mode)",
      INCOMPLETE_OTP: "Please enter complete OTP",
      EMPTY_NAME: "Please enter your name",
      NO_POSITIONS: "Please select at least one position",
      ADMIN_ONLY: "Only super admin can make admins",
      REMOVE_ADMIN_ONLY: "Only super admin can remove admins",
    },
  },

  // Default avatar
  DEFAULT_AVATAR: "https://via.placeholder.com/40",

  // Notification settings
  NOTIFICATION: {
    DURATION: 3000, // milliseconds
    ANIMATION_DURATION: 300, // milliseconds
  },
};

// Freeze config to prevent modifications
Object.freeze(CONFIG);
Object.freeze(CONFIG.SUPER_ADMIN);
Object.freeze(CONFIG.ROLES);
Object.freeze(CONFIG.POSITIONS);
Object.freeze(CONFIG.COUNTRY_CODES);
Object.freeze(CONFIG.STORAGE_KEYS);
Object.freeze(CONFIG.VALIDATION);
Object.freeze(CONFIG.MESSAGES);
Object.freeze(CONFIG.MESSAGES.SUCCESS);
Object.freeze(CONFIG.MESSAGES.ERROR);
Object.freeze(CONFIG.NOTIFICATION);
