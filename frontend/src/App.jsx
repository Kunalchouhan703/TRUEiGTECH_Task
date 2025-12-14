/**
 * Main App Component
 * 
 * Sets up React Router and defines all application routes.
 * Handles authentication state and protected routes.
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Import page components
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import Search from './pages/Search';
import PostDetail from './pages/PostDetail';

// Import shared components
import Navbar from './components/Navbar';

/**
 * Protected Route Component
 * 
 * Wraps routes that require authentication.
 * Redirects to login if user is not authenticated.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

/**
 * App Component
 * 
 * Main application component that sets up routing and authentication.
 */
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  // Show loading state while checking authentication
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* ==================== PUBLIC ROUTES ==================== */}
        
        {/* Login page - redirect to feed if already authenticated */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/feed" /> : <Login />
          }
        />

        {/* Signup page - redirect to feed if already authenticated */}
        <Route
          path="/signup"
          element={
            isAuthenticated ? <Navigate to="/feed" /> : <Signup />
          }
        />

        {/* ==================== PROTECTED ROUTES ==================== */}
        
        {/* Feed page - shows posts from followed users */}
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Feed />
              </>
            </ProtectedRoute>
          }
        />

        {/* Create post page */}
        <Route
          path="/create-post"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <CreatePost />
              </>
            </ProtectedRoute>
          }
        />

        {/* User profile page */}
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Profile />
              </>
            </ProtectedRoute>
          }
        />

        {/* Search users page */}
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Search />
              </>
            </ProtectedRoute>
          }
        />

        {/* Post detail page */}
        <Route
          path="/post/:postId"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <PostDetail />
              </>
            </ProtectedRoute>
          }
        />

        {/* Default route - redirect to feed */}
        <Route path="/" element={<Navigate to="/feed" />} />
      </Routes>
    </Router>
  );
}

export default App;
