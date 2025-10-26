# South Pune Football Community

A responsive web application for managing the South Pune Football Community. This simple, mobile-friendly website allows users to browse tournaments, players, leaderboards, and venues.

## Features

### 🏠 Home Page
- **Header**
  - Title: "South Pune Football Community" (top-left)
  - Authentication buttons (top-right):
    - Not logged in: "Login" and "Register" buttons
    - Logged in: User profile button with avatar and name (Register button hidden)

### 📱 Navigation
- **Responsive tabs**: Tournaments, Players, Leaderboard, Venues
- Mobile-friendly with horizontal scrolling on small screens
- Smooth transitions between sections

### 🔐 Authentication
- Login modal with email and password
- Registration modal with name, email, and password
- Persistent login state (stored in localStorage)
- One-click logout from profile button
- Visual notifications for auth actions

### 🎨 Design
- Clean, modern interface
- Green color scheme (football theme)
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions
- Accessible buttons and forms

## Getting Started

### 1. Open the Application
Simply open `index.html` in your web browser:
- Double-click the file, or
- Right-click and select "Open with" → Your preferred browser

### 2. Using the Application

#### To Register:
1. Click the "Register" button in the top-right corner
2. Fill in your name, email, and password
3. Click "Register"
4. You'll be automatically logged in

#### To Login:
1. Click the "Login" button
2. Enter your email and password
3. Click "Login"

#### To Navigate:
- Click on any tab (Tournaments, Players, Leaderboard, Venues) to view that section
- On mobile, swipe horizontally to see all navigation tabs

#### To Logout:
- Click on your profile button (with your name and avatar)
- Confirm logout in the dialog

## File Structure

```
south_pune_football_community/
├── index.html          # Main HTML structure
├── styles.css          # Responsive styling
├── script.js           # Interactive functionality
└── README.md           # This file
```

## Technologies Used

- **HTML5**: Semantic structure
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript**: No frameworks required
- **LocalStorage**: Persistent user sessions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Responsive Breakpoints

- **Desktop**: 1400px max-width container
- **Tablet**: 768px and below
- **Mobile**: 480px and below

## Future Enhancements

- Backend integration for real authentication
- Database for tournaments, players, and venues
- Real-time leaderboard updates
- Venue booking system
- Player profile pages
- Tournament registration
- Match scheduling
- Live scores

## Notes

- This is a front-end demo with simulated authentication
- User data is stored in browser's localStorage
- No backend server required to run
- All data is stored locally in the browser

## Development

To modify the application:

1. **HTML** (`index.html`): Update structure and content
2. **CSS** (`styles.css`): Modify styling and responsive design
3. **JavaScript** (`script.js`): Add or change functionality

## Support

For issues or questions about the South Pune Football Community application, please reach out to the development team.

---

**Version**: 1.0.0  
**Last Updated**: October 26, 2025
