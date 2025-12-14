/**
 * Navigation Bar Component
 * 
 * Displays the main navigation bar with links to:
 * - Feed
 * - Search
 * - Create Post
 * - Profile
 * - Logout
 */

import { Link, useNavigate } from 'react-router-dom';

/**
 * Navbar Component
 * 
 * Renders the top navigation bar with navigation links and logout button.
 */
const Navbar = () => {
  const navigate = useNavigate();
  
  // Get current user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  /**
   * Handle Logout
   * 
   * Clears authentication data and redirects to login page.
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        {/* Logo/Brand */}
        <Link to="/feed" className="nav-logo">
          Instagram
        </Link>

        {/* Navigation Links */}
        <div className="nav-links">
          <Link to="/feed" className="nav-link">Feed</Link>
          <Link to="/search" className="nav-link">Search</Link>
          <Link to="/create-post" className="nav-link">Create Post</Link>
          
          {/* Profile link - only show if user is logged in */}
          {user.id && (
            <Link to={`/profile/${user.id}`} className="nav-link">
              Profile
            </Link>
          )}
          
          {/* Logout button */}
          <button className="nav-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
