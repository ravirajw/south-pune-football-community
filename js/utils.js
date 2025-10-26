// Utility functions

// Check if user exists by mobile number
function userExists(countryCode, mobile) {
  return registeredUsers.find(
    (user) => user.countryCode === countryCode && user.mobile === mobile
  );
}

// Save registered users to localStorage
function saveRegisteredUsers() {
  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
}

// Modal utilities
function openModal(modal) {
  modal.classList.add("active");
  modal.style.display = "flex";
}

function closeModal(modal) {
  modal.classList.remove("active");
  modal.style.display = "none";
}

// Show notification
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.textContent = message;

  const bgColor = type === "error" ? "#f44336" : "#4CAF50";

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

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Add animations for notifications
const notificationStyle = document.createElement("style");
notificationStyle.textContent = `
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
document.head.appendChild(notificationStyle);
