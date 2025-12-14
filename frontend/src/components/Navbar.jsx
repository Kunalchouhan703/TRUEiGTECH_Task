import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/feed" className="nav-logo">
          Instagram
        </Link>
        <div className="nav-links">
          <Link to="/feed" className="nav-link">Feed</Link>
          <Link to="/search" className="nav-link">Search</Link>
          <Link to="/create-post" className="nav-link">Create Post</Link>
          {user.id && (
            <Link to={`/profile/${user.id}`} className="nav-link">
              Profile
            </Link>
          )}
          <button className="nav-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
