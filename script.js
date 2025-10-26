// Authentication state management
let isLoggedIn = false;
let currentUser = null;
let registrationData = {
    mobile: '',
    countryCode: '+91',
    name: '',
    profilePicture: '',
    positions: []
};
let otpTimer = null;
let otpTimeRemaining = 30;

// DOM Elements
const authButtons = document.getElementById('authButtons');
const userProfile = document.getElementById('userProfile');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const userProfileBtn = document.getElementById('userProfileBtn');
const userName = document.getElementById('userName');
const userAvatar = document.getElementById('userAvatar');

// Modal elements
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const profileModal = document.getElementById('profileModal');
const closeLogin = document.getElementById('closeLogin');
const closeRegister = document.getElementById('closeRegister');
const closeProfile = document.getElementById('closeProfile');
const loginForm = document.getElementById('loginForm');

// Registration step elements
const registerStep1 = document.getElementById('registerStep1');
const registerStep2 = document.getElementById('registerStep2');
const stepIndicator1 = document.getElementById('stepIndicator1');
const stepIndicator2 = document.getElementById('stepIndicator2');
const mobileForm = document.getElementById('mobileForm');
const otpForm = document.getElementById('otpForm');
const profileForm = document.getElementById('profileForm');
const sendOtpBtn = document.getElementById('sendOtpBtn');
const resendOtpBtn = document.getElementById('resendOtpBtn');
const otpInputs = document.querySelectorAll('.otp-input');
const otpError = document.getElementById('otpError');
const positionError = document.getElementById('positionError');

// Profile modal elements
const profileViewMode = document.getElementById('profileViewMode');
const profileEditMode = document.getElementById('profileEditMode');
const editProfileBtn = document.getElementById('editProfileBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const editProfileForm = document.getElementById('editProfileForm');
const logoutBtnProfile = document.getElementById('logoutBtnProfile');

// Navigation elements
const navTabs = document.querySelectorAll('.nav-tab');
const contentSections = document.querySelectorAll('.content-section');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Check if user was previously logged in (using localStorage)
    checkLoginStatus();
    
    // Setup event listeners
    setupAuthListeners();
    setupNavigationListeners();
});

// Check login status from localStorage
function checkLoginStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isLoggedIn = true;
        updateAuthUI();
    }
}

// Setup authentication event listeners
function setupAuthListeners() {
    // Login button click
    loginBtn.addEventListener('click', () => {
        openModal(loginModal);
    });

    // Register button click
    registerBtn.addEventListener('click', () => {
        resetRegistrationFlow();
        openModal(registerModal);
    });

    // Close modal buttons
    closeLogin.addEventListener('click', () => {
        closeModal(loginModal);
    });

    closeRegister.addEventListener('click', () => {
        closeModal(registerModal);
        resetRegistrationFlow();
    });

    closeProfile.addEventListener('click', () => {
        closeModal(profileModal);
        showProfileView();
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            closeModal(loginModal);
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

    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin();
    });

    // Mobile form submission (Step 1)
    mobileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSendOtp();
    });

    // OTP form submission
    otpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleVerifyOtp();
    });

    // Profile form submission (Step 2)
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleCompleteRegistration();
    });

    // Resend OTP button
    resendOtpBtn.addEventListener('click', () => {
        handleResendOtp();
    });

    // OTP input handling
    setupOtpInputs();

    // Profile picture upload
    document.getElementById('uploadPhotoBtn').addEventListener('click', () => {
        document.getElementById('profilePictureFile').click();
    });

    document.getElementById('profilePictureFile').addEventListener('change', handleFileUpload);
    document.getElementById('profilePictureUrl').addEventListener('input', handleUrlInput);

    // User profile button click (show profile)
    userProfileBtn.addEventListener('click', () => {
        showProfileView();
        openModal(profileModal);
    });

    // Profile modal actions
    editProfileBtn.addEventListener('click', showProfileEdit);
    cancelEditBtn.addEventListener('click', showProfileView);
    logoutBtnProfile.addEventListener('click', handleLogout);

    // Edit profile form submission
    editProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSaveProfile();
    });

    // Edit profile picture upload
    document.getElementById('editUploadPhotoBtn').addEventListener('click', () => {
        document.getElementById('editProfilePictureFile').click();
    });

    document.getElementById('editProfilePictureFile').addEventListener('change', handleEditFileUpload);
    document.getElementById('editProfilePictureUrl').addEventListener('input', handleEditUrlInput);
}

// Setup navigation tab listeners
function setupNavigationListeners() {
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
}

// Switch between navigation tabs
function switchTab(tabName) {
    // Remove active class from all tabs and sections
    navTabs.forEach(tab => tab.classList.remove('active'));
    contentSections.forEach(section => section.classList.remove('active'));

    // Add active class to selected tab and section
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    const selectedSection = document.getElementById(tabName);

    if (selectedTab && selectedSection) {
        selectedTab.classList.add('active');
        selectedSection.classList.add('active');
    }
}

// Open modal
function openModal(modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
}

// Close modal
function closeModal(modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
}

// Handle login
function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // In a real application, you would validate credentials with a backend
    // For demo purposes, we'll simulate a successful login
    if (email && password) {
        currentUser = {
            name: email.split('@')[0],
            email: email,
            avatar: 'https://via.placeholder.com/40'
        };

        isLoggedIn = true;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        updateAuthUI();
        closeModal(loginModal);
        loginForm.reset();
        
        showNotification('Login successful!');
    }
}

// Registration Step 1: Send OTP
function handleSendOtp() {
    const mobile = document.getElementById('mobileNumber').value;
    const countryCode = document.getElementById('countryCode').value;

    if (mobile.length !== 10) {
        showNotification('Please enter a valid 10-digit mobile number', 'error');
        return;
    }

    // Save mobile number
    registrationData.mobile = mobile;
    registrationData.countryCode = countryCode;

    // Show OTP form
    mobileForm.style.display = 'none';
    otpForm.style.display = 'block';
    document.getElementById('displayMobile').textContent = `${countryCode} ${mobile}`;

    // Start OTP timer
    startOtpTimer();

    // In production, send OTP to backend
    showNotification('OTP sent successfully!');
}

// Setup OTP inputs
function setupOtpInputs() {
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            const value = e.target.value;
            
            // Only allow numbers
            if (!/^\d*$/.test(value)) {
                e.target.value = '';
                return;
            }

            // Move to next input
            if (value && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            // Handle backspace
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });

        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').slice(0, 4);
            
            if (/^\d+$/.test(pastedData)) {
                pastedData.split('').forEach((char, i) => {
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

// Handle OTP verification
function handleVerifyOtp() {
    const otp = Array.from(otpInputs).map(input => input.value).join('');

    if (otp.length !== 4) {
        showOtpError('Please enter complete OTP');
        return;
    }

    // Development: Only accept 0000
    if (otp === '0000') {
        hideOtpError();
        clearOtpTimer();
        showNotification('Mobile verified successfully!');
        
        // Move to step 2
        goToStep(2);
    } else {
        showOtpError('Invalid OTP. Please enter 0000 (development mode)');
        otpInputs.forEach(input => {
            input.value = '';
            input.classList.add('error');
            setTimeout(() => input.classList.remove('error'), 400);
        });
        otpInputs[0].focus();
    }
}

// Handle resend OTP
function handleResendOtp() {
    // Clear previous inputs
    otpInputs.forEach(input => input.value = '');
    otpInputs[0].focus();
    hideOtpError();

    // Restart timer
    startOtpTimer();

    // In production, send new OTP to backend
    showNotification('OTP resent successfully!');
}

// Start OTP timer
function startOtpTimer() {
    otpTimeRemaining = 30;
    resendOtpBtn.disabled = true;
    updateTimerDisplay();

    otpTimer = setInterval(() => {
        otpTimeRemaining--;
        updateTimerDisplay();

        if (otpTimeRemaining <= 0) {
            clearOtpTimer();
            resendOtpBtn.disabled = false;
            resendOtpBtn.innerHTML = 'Resend OTP';
        }
    }, 1000);
}

// Clear OTP timer
function clearOtpTimer() {
    if (otpTimer) {
        clearInterval(otpTimer);
        otpTimer = null;
    }
}

// Update timer display
function updateTimerDisplay() {
    document.getElementById('otpTimer').textContent = otpTimeRemaining;
}

// Show OTP error
function showOtpError(message) {
    otpError.textContent = message;
    otpError.style.display = 'block';
}

// Hide OTP error
function hideOtpError() {
    otpError.style.display = 'none';
}

// Handle file upload
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            registrationData.profilePicture = event.target.result;
            showProfilePreview(event.target.result);
        };
        reader.readAsDataURL(file);
        document.getElementById('profilePictureUrl').value = '';
    }
}

// Handle URL input
function handleUrlInput(e) {
    const url = e.target.value;
    if (url) {
        registrationData.profilePicture = url;
        showProfilePreview(url);
    } else {
        document.getElementById('profilePreview').innerHTML = '';
    }
}

// Show profile preview
function showProfilePreview(src) {
    const preview = document.getElementById('profilePreview');
    preview.innerHTML = `<img src="${src}" alt="Profile Preview">`;
}

// Handle complete registration
function handleCompleteRegistration() {
    const name = document.getElementById('registerName').value;
    const positions = Array.from(document.querySelectorAll('input[name="position"]:checked'))
        .map(checkbox => checkbox.value);

    if (!name.trim()) {
        showNotification('Please enter your name', 'error');
        return;
    }

    if (positions.length === 0) {
        positionError.textContent = 'Please select at least one position';
        positionError.style.display = 'block';
        return;
    }

    positionError.style.display = 'none';

    // Save registration data
    registrationData.name = name;
    registrationData.positions = positions;

    // Create user and auto-login
    currentUser = {
        name: registrationData.name,
        mobile: `${registrationData.countryCode} ${registrationData.mobile}`,
        avatar: registrationData.profilePicture || 'https://via.placeholder.com/40',
        positions: registrationData.positions
    };

    isLoggedIn = true;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    updateAuthUI();
    closeModal(registerModal);
    resetRegistrationFlow();
    
    showNotification('Registration successful! Welcome to South Pune Football Community!', 'success');
}

// Go to registration step
function goToStep(stepNumber) {
    if (stepNumber === 1) {
        registerStep1.classList.add('active');
        registerStep2.classList.remove('active');
        stepIndicator1.classList.add('active');
        stepIndicator2.classList.remove('active');
    } else if (stepNumber === 2) {
        registerStep1.classList.remove('active');
        registerStep2.classList.add('active');
        stepIndicator1.classList.remove('active');
        stepIndicator2.classList.add('active');
    }
}

// Reset registration flow
function resetRegistrationFlow() {
    // Reset to step 1
    goToStep(1);

    // Clear forms
    mobileForm.reset();
    otpForm.reset();
    profileForm.reset();
    
    // Reset visibility
    mobileForm.style.display = 'block';
    otpForm.style.display = 'none';

    // Clear OTP inputs
    otpInputs.forEach(input => input.value = '');
    hideOtpError();

    // Clear timer
    clearOtpTimer();

    // Clear registration data
    registrationData = {
        mobile: '',
        countryCode: '+91',
        name: '',
        profilePicture: '',
        positions: []
    };

    // Clear profile preview
    document.getElementById('profilePreview').innerHTML = '';
    
    // Clear position checkboxes
    document.querySelectorAll('input[name="position"]').forEach(cb => cb.checked = false);
}

// Handle register (legacy - removed)
function handleRegister() {
    // This function is no longer used
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        isLoggedIn = false;
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateAuthUI();
        closeModal(profileModal);
        showNotification('Logged out successfully!');
    }
}

// Update authentication UI based on login status
function updateAuthUI() {
    if (isLoggedIn && currentUser) {
        // Hide auth buttons, show user profile
        authButtons.style.display = 'none';
        userProfile.style.display = 'block';
        userName.textContent = currentUser.name;
        
        // Update avatar
        const avatarDiv = document.getElementById('userAvatar');
        if (currentUser.avatar && currentUser.avatar !== 'https://via.placeholder.com/40') {
            avatarDiv.innerHTML = `<img src="${currentUser.avatar}" alt="${currentUser.name}">`;
        } else {
            avatarDiv.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
            `;
        }
    } else {
        // Show auth buttons, hide user profile
        authButtons.style.display = 'flex';
        userProfile.style.display = 'none';
    }
}

// Show profile view mode
function showProfileView() {
    profileViewMode.style.display = 'block';
    profileEditMode.style.display = 'none';
    
    if (currentUser) {
        // Update profile picture
        const profilePicDisplay = document.getElementById('profilePicDisplay');
        if (currentUser.avatar && currentUser.avatar !== 'https://via.placeholder.com/40') {
            profilePicDisplay.innerHTML = `<img src="${currentUser.avatar}" alt="${currentUser.name}">`;
        } else {
            profilePicDisplay.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
            `;
        }
        
        // Update name
        document.getElementById('displayName').textContent = currentUser.name;
        
        // Update mobile
        document.getElementById('displayMobileProfile').textContent = currentUser.mobile || 'Not provided';
        
        // Update positions
        const positionsDisplay = document.getElementById('displayPositions');
        if (currentUser.positions && currentUser.positions.length > 0) {
            positionsDisplay.innerHTML = currentUser.positions
                .map(pos => `<span class="position-badge">${pos}</span>`)
                .join('');
        } else {
            positionsDisplay.innerHTML = '<p>No positions selected</p>';
        }
    }
}

// Show profile edit mode
function showProfileEdit() {
    profileViewMode.style.display = 'none';
    profileEditMode.style.display = 'block';
    
    if (currentUser) {
        // Populate edit form
        document.getElementById('editName').value = currentUser.name;
        
        // Show current profile picture
        if (currentUser.avatar && currentUser.avatar !== 'https://via.placeholder.com/40') {
            document.getElementById('editProfilePreview').innerHTML = 
                `<img src="${currentUser.avatar}" alt="Profile Preview">`;
        }
        
        // Check current positions
        document.querySelectorAll('input[name="editPosition"]').forEach(checkbox => {
            checkbox.checked = currentUser.positions && currentUser.positions.includes(checkbox.value);
        });
    }
}

// Handle edit profile file upload
function handleEditFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            registrationData.profilePicture = event.target.result;
            document.getElementById('editProfilePreview').innerHTML = 
                `<img src="${event.target.result}" alt="Profile Preview">`;
        };
        reader.readAsDataURL(file);
        document.getElementById('editProfilePictureUrl').value = '';
    }
}

// Handle edit URL input
function handleEditUrlInput(e) {
    const url = e.target.value;
    if (url) {
        registrationData.profilePicture = url;
        document.getElementById('editProfilePreview').innerHTML = 
            `<img src="${url}" alt="Profile Preview">`;
    } else {
        document.getElementById('editProfilePreview').innerHTML = '';
    }
}

// Handle save profile
function handleSaveProfile() {
    const name = document.getElementById('editName').value;
    const positions = Array.from(document.querySelectorAll('input[name="editPosition"]:checked'))
        .map(checkbox => checkbox.value);

    if (!name.trim()) {
        showNotification('Please enter your name', 'error');
        return;
    }

    if (positions.length === 0) {
        document.getElementById('editPositionError').textContent = 'Please select at least one position';
        document.getElementById('editPositionError').style.display = 'block';
        return;
    }

    document.getElementById('editPositionError').style.display = 'none';

    // Update user data
    currentUser.name = name;
    currentUser.positions = positions;
    
    // Update profile picture if changed
    if (registrationData.profilePicture) {
        currentUser.avatar = registrationData.profilePicture;
        registrationData.profilePicture = '';
    }

    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update UI
    updateAuthUI();
    showProfileView();
    
    showNotification('Profile updated successfully!');
}

// Show notification (simple alert for now)
function showNotification(message, type = 'success') {
    // Create a simple notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    
    const bgColor = type === 'error' ? '#f44336' : '#4CAF50';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 350px;
    `;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Mobile menu touch improvements
if ('ontouchstart' in window) {
    navTabs.forEach(tab => {
        tab.style.webkitTapHighlightColor = 'transparent';
    });
}
