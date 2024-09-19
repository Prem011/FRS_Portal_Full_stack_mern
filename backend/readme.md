<!-- /client
│
├── /public               # Public directory for index.html, static assets
│
├── /src
│   ├── /assets            # Images, logos, and other static assets
│   ├── /components        # Reusable components (UI, etc.)
│   │   ├── FriendList.jsx  # Friend list component
│   │   ├── FriendRequests.jsx # Friend request component
│   │   ├── FriendRecommendations.jsx # Recommended friends component
│   │   ├── SearchBar.jsx   # Search user component
│   │   ├── Navbar.jsx      # Navbar to display login status
│   │
│   ├── /contexts          # Contexts for global state management
│   │   ├── AuthContext.js  # Context for authentication
│   │   ├── FriendContext.js # Context for managing friends, requests, and recommendations
│   │   ├── SearchContext.js # Context for user search
│   │
│   ├── /hooks             # Custom hooks
│   │   ├── useAuth.js      # Hook to handle authentication
│   │   ├── useFriends.js   # Hook to handle friend-related functions
│   │   ├── useSearch.js    # Hook to handle search
│   │
│   ├── /pages             # Pages of the application
│   │   ├── LoginPage.jsx   # Login page
│   │   ├── RegisterPage.jsx # Register page
│   │   ├── Dashboard.jsx   # Main user dashboard page
│   │   ├── ProfilePage.jsx # User profile page
│   │   ├── SearchPage.jsx  # Search results page
│   │
│   ├── /services          # API service files to manage backend calls
│   │   ├── authService.js  # API requests for authentication
│   │   ├── friendService.js # API requests for friend-related actions
│   │   ├── searchService.js # API requests for search
│   │
│   ├── App.jsx            # Main app component with routing
│   ├── index.jsx          # Entry point for React app
│   ├── vite.config.js     # Vite config for development
│
├── /server                # Backend code
│   ├── /controllers       # Logic for request handling
│   │   ├── authController.js    # Handles login, registration
│   │   ├── friendController.js  # Handles friend requests and recommendations
│   │   ├── searchController.js  # Handles search functionality
│   │
│   ├── /models            # Mongoose models
│   │   ├── User.js         # User schema and model definition
│   │
│   ├── /routes            # Express routes
│   │   ├── authRoutes.js   # Authentication routes
│   │   ├── friendRoutes.js # Friend management routes
│   │   ├── searchRoutes.js # Search routes
│   │
│   ├── /utils             # Utility functions and middleware
│   │   ├── authMiddleware.js # Middleware to protect routes
│   │   ├── errorHandler.js   # Custom error handling
│   │
│   ├── server.js          # Entry point for the Express backend
│   ├── .env               # Environment variables (port, DB URI, etc.)
│
├── package.json           # Node package manager file for backend
└── package.json           # Node package manager file for frontend -->

import { createContext, useState, useEffect } from 'react';
import { loginService, registerService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const userData = await loginService(credentials);
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    // Implement logic to clear cookies or token if using JWT
  };

  const register = async (newUser) => {
    const userData = await registerService(newUser);
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
