// Authentication state management
let isLoggedIn = false;
let currentUser = null;

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
const closeLogin = document.getElementById('closeLogin');
const closeRegister = document.getElementById('closeRegister');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

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
        openModal(registerModal);
    });

    // Close modal buttons
    closeLogin.addEventListener('click', () => {
        closeModal(loginModal);
    });

    closeRegister.addEventListener('click', () => {
        closeModal(registerModal);
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            closeModal(loginModal);
        }
        if (e.target === registerModal) {
            closeModal(registerModal);
        }
    });

    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin();
    });

    // Register form submission
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleRegister();
    });

    // User profile button click (logout)
    userProfileBtn.addEventListener('click', () => {
        if (confirm('Do you want to logout?')) {
            handleLogout();
        }
    });
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

// Handle registration
function handleRegister() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    // In a real application, you would create an account with a backend
    // For demo purposes, we'll simulate a successful registration
    if (name && email && password) {
        currentUser = {
            name: name,
            email: email,
            avatar: 'https://via.placeholder.com/40'
        };

        isLoggedIn = true;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        updateAuthUI();
        closeModal(registerModal);
        registerForm.reset();
        
        showNotification('Registration successful!');
    }
}

// Handle logout
function handleLogout() {
    isLoggedIn = false;
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    showNotification('Logged out successfully!');
}

// Update authentication UI based on login status
function updateAuthUI() {
    if (isLoggedIn && currentUser) {
        // Hide auth buttons, show user profile
        authButtons.style.display = 'none';
        userProfile.style.display = 'block';
        userName.textContent = currentUser.name;
        userAvatar.src = currentUser.avatar;
    } else {
        // Show auth buttons, hide user profile
        authButtons.style.display = 'flex';
        userProfile.style.display = 'none';
    }
}

// Show notification (simple alert for now)
function showNotification(message) {
    // Create a simple notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
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
