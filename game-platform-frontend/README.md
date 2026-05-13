# NEXUS Game Platform - Frontend

A competitive gaming platform frontend built with React, featuring a cyberpunk-themed UI, player dashboard, admin panel, and real-time game integration.

## Tech Stack

- **React 18+**
- **React Router v6** (routing)
- **Axios** (API client)
- **Framer Motion** (animations)
- **Lucide React** (icons)
- **JWT Decode** (token handling)

## Project Structure

```
game-platform-frontend/
├── public/                             # Static assets
├── src/
│   ├── api/
│   │   └── axios.js                    # Axios instance with JWT interceptor
│   ├── components/                     # Reusable UI components
│   │   ├── AdminLayout.jsx             # Admin sidebar layout (cyberpunk)
│   │   ├── CyberpunkModal.jsx         # Modal component
│   │   ├── Layout.jsx                 # Player sidebar layout (cyberpunk)
│   │   ├── LoadingSpinner.jsx         # Loading indicator
│   │   ├── NeonParticles.jsx          # Background particle effect
│   │   └── StatusMessage.jsx          # Success/error message display
│   ├── config/
│   │   └── branding.js                # Application branding configuration
│   ├── pages/                         # Page components
│   │   ├── admin/                     # Admin-only pages
│   │   │   ├── AdminActivities.jsx    # Audit log viewer
│   │   │   ├── AdminAnalytics.jsx     # Analytics dashboard
│   │   │   ├── AdminDashboard.jsx     # Admin overview
│   │   │   ├── AdminGames.jsx        # Game management
│   │   │   └── AdminUsers.jsx         # User management
│   │   ├── auth/                     # Authentication pages
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── games/                    # Game implementations
│   │   │   ├── Chess.jsx
│   │   │   ├── QuizGame.jsx
│   │   │   ├── Snake.jsx
│   │   │   └── Tetris.jsx
│   │   └── user/                     # Player pages
│   │       ├── Achievements.jsx       # User achievements
│   │       ├── Dashboard.jsx          # Player dashboard
│   │       ├── Games.jsx              # Games listing
│   │       ├── Home.jsx               # Landing page (cyberpunk)
│   │       ├── Profile.jsx            # User profile
│   │       ├── QuizStart.jsx          # Quiz category selection
│   │       ├── Rankings.jsx           # Leaderboard
│   │       └── Settings.jsx           # Profile settings
│   ├── routes/
│   │   └── AppRoutes.jsx             # Route configuration with role protection
│   ├── services/                     # API service layer
│   │   ├── auditService.js           # Audit log API calls
│   │   ├── gameService.js            # Game API calls
│   │   ├── scoreService.js           # Score/leaderboard API calls
│   │   ├── statsService.js           # Analytics API calls
│   │   └── userService.js            # User API calls
│   ├── App.css                       # Global styles
│   ├── App.js                        # Root component
│   ├── index.css                     # CSS reset and base styles
│   ├── index.js                      # Application entry point
│   └── ProtectedRoute.jsx            # Route protection component (role-based)
├── package.json                       # Dependencies and scripts
└── README.md                         # This file
```

## Features

### Player Experience
- **Cyberpunk-themed landing page** with animated effects
- **Player dashboard** with games, leaderboard, profile, and settings
- **Game library** with Quiz, Snake, Tetris, and Chess
- **Leaderboard** showing top players by score
- **Profile management** with avatar, username, email editing
- **Achievement system** with badges (BRONZE → DIAMOND)
- **XP and level progression**

### Admin Panel
- **Admin dashboard** with platform overview
- **User management** (view, edit, delete, ban, unban, reset password)
- **Game management** (add, edit, delete, enable/disable games)
- **Analytics dashboard** with charts and statistics
- **Activity audit log** with filtering by action, admin, or date

### Security
- JWT-based authentication
- Role-based route protection (USER, ADMIN)
- Admin cannot access player game routes
- Automatic token refresh on API calls

### Design System
- **Cyberpunk aesthetic** with dark backgrounds, neon accents
- **Orbitron** font for headings (futuristic)
- **Share Tech Mono** for code/technical text
- **Rajdhani** for body text
- Gold (#d4a84b) and cyan (#7eb8d4) color scheme
- Grid background pattern
- Framer Motion animations
- Responsive sidebar navigation

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- Backend API running on `http://localhost:8080`

### Installation

```bash
cd game-platform-frontend
npm install
```

### Configuration

The API base URL is configured in `src/api/axios.js`:

```javascript
const API_BASE_URL = "http://localhost:8080/api";
```

### Running the Application

```bash
npm start
```

The application will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The optimized build will be in the `build/` directory.

## Routing & Access Control

### Public Routes
- `/` - Landing page (Home.jsx)
- `/login` - Login page
- `/register` - Registration page

### Player Routes (USER role only, admins blocked)
- `/dashboard` - Player dashboard
- `/games` - Games listing
- `/rankings` - Leaderboard
- `/achievements` - Achievements
- `/profile` - User profile
- `/settings` - Profile settings
- `/quiz` - Quiz category selection
- `/quiz/play/:category` - Quiz game
- `/snake` - Snake game
- `/tetris` - Tetris game
- `/chess` - Chess game

### Admin Routes (ADMIN role only)
- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/games` - Game management
- `/admin/analytics` - Analytics
- `/admin/activities` - Audit log

## Service Layer

The application uses a service layer pattern to centralize API calls:

```javascript
// Example: userService.js
import api from "../api/axios";

const userService = {
  getMe: () => api.get("/users/me"),
  updateProfile: (data) => api.put("/users/me", data),
  changePassword: (data) => api.put("/users/me/password", data),
  // ... other methods
};

export default userService;
```

## Branding Configuration

Application branding can be customized in `src/config/branding.js`:

```javascript
export const BRANDING = {
  appName: "NEXUS",
  appTagline: "COMPETITIVE GAMING PLATFORM",
  logoText: "NEXUS",
  logoAccent: "US",
  primaryColor: "#d4a84b",
  secondaryColor: "#7eb8d4",
  // ... other branding options
};
```

Admins can override branding via localStorage for runtime customization.

## Components

### Reusable Components

**AdminLayout.jsx**
- Admin sidebar navigation
- Cyberpunk-themed styling
- Role verification (redirects non-admins)

**Layout.jsx**
- Player sidebar navigation
- Grid background pattern
- User menu and logout

**CyberpunkModal.jsx**
- Reusable modal component
- Cyberpunk styling
- Customizable content

**LoadingSpinner.jsx**
- Animated loading indicator
- Consistent styling across app

**StatusMessage.jsx**
- Success/error message display
- Auto-dismiss after timeout

**NeonParticles.jsx**
- Background particle effect
- Used on landing page

## API Integration

All API calls go through the configured axios instance in `src/api/axios.js`, which:
- Includes JWT token in Authorization header
- Handles 401 errors by redirecting to login
- Configured with CORS for backend communication

## Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_APP_NAME=NEXUS
```

## Testing

```bash
npm test
```

## Deployment

### Build for Production

```bash
npm run build
```

### Serve with Express (example)

```bash
npm install -g serve
serve -s build -l 3000
```

### Deploy to Netlify/Vercel

The `build/` folder can be deployed directly to any static hosting service.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License
