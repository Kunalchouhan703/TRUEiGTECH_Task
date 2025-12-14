import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Layout = ({ children }) => {
  const [stories, setStories] = useState([]);
  const [loadingStories, setLoadingStories] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [followingStates, setFollowingStates] = useState({});
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchStories();
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      setLoadingSuggestions(true);
      const response = await api.get('/search/suggestions');
      setSuggestions(response.data.suggestions || []);
      
      const states = {};
      response.data.suggestions.forEach(user => {
        states[user.id] = user.isFollowing;
      });
      setFollowingStates(states);
    } catch (err) {
      console.error('Failed to load suggestions:', err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleFollow = async (userId, isFollowing) => {
    try {
      if (isFollowing) {
        await api.post(`/users/${userId}/unfollow`);
      } else {
        await api.post(`/users/${userId}/follow`);
      }
      
      setFollowingStates(prev => ({
        ...prev,
        [userId]: !isFollowing
      }));
      
      await fetchSuggestions();
    } catch (err) {
      console.error('Follow/unfollow error:', err);
    }
  };

  const fetchStories = async () => {
    try {
      setLoadingStories(true);
      const response = await api.get('/stories');
      setStories(response.data.stories || []);
    } catch (err) {
      console.error('Failed to load stories:', err);
    } finally {
      setLoadingStories(false);
    }
  };

  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : '?';
  };

  return (
    <div className="app-layout">
      <aside className="sidebar left-sidebar">
        <div className="sidebar-content">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Stories</h3>
            {loadingStories ? (
              <div className="sidebar-loading">Loading...</div>
            ) : stories.length > 0 ? (
              <div className="stories-container">
                {stories.slice(0, 5).map((storyGroup, idx) => (
                  <div
                    key={idx}
                    className="story-item"
                    onClick={() => navigate(`/stories/${storyGroup.user.id}`)}
                  >
                    <div className="story-avatar">
                      {storyGroup.user.profilePhoto ? (
                        <img src={storyGroup.user.profilePhoto} alt={storyGroup.user.username} />
                      ) : (
                        getInitials(storyGroup.user.username)
                      )}
                    </div>
                    <div className="story-username">{storyGroup.user.username}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="sidebar-empty">No stories</div>
            )}
          </div>
          <div className="sidebar-section">
            <h3 className="sidebar-title">Quick Actions</h3>
            <div className="sidebar-actions">
              <button
                className="sidebar-button"
                onClick={() => navigate('/create-post')}
              >
                Create Post
              </button>
              <button
                className="sidebar-button"
                onClick={() => navigate('/stories/create')}
              >
                Add Story
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>

      <aside className="sidebar right-sidebar">
        <div className="sidebar-content">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Suggestions</h3>
            <div className="sidebar-suggestions">
              <button
                className="explore-button"
                onClick={() => setShowSuggestions(!showSuggestions)}
              >
                {showSuggestions ? 'Hide' : 'Explore'} Suggestions
              </button>
              {showSuggestions && (
                <div className="suggestions-list">
                  {loadingSuggestions ? (
                    <div className="sidebar-loading">Loading...</div>
                  ) : suggestions.length > 0 ? (
                    suggestions.map(suggestion => (
                      <div key={suggestion.id} className="suggestion-user-item">
                        <div
                          className="suggestion-user-info"
                          onClick={() => navigate(`/profile/${suggestion.id}`)}
                        >
                          <div className="suggestion-user-avatar">
                            {suggestion.profilePhoto ? (
                              <img src={suggestion.profilePhoto} alt={suggestion.username} />
                            ) : (
                              getInitials(suggestion.username)
                            )}
                          </div>
                          <div className="suggestion-user-details">
                            <div className="suggestion-username">{suggestion.username}</div>
                            <div className="suggestion-subtitle">New to Instagram</div>
                          </div>
                        </div>
                        <button
                          className={`suggestion-follow-button ${followingStates[suggestion.id] ? 'following' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFollow(suggestion.id, followingStates[suggestion.id]);
                          }}
                        >
                          {followingStates[suggestion.id] ? 'Following' : 'Follow'}
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="sidebar-empty">No suggestions</div>
                  )}
                </div>
              )}
            </div>
          </div>
          {user.id && (
            <div className="sidebar-section">
              <div
                className="sidebar-user"
                onClick={() => navigate(`/profile/${user.id}`)}
              >
                <div className="sidebar-user-avatar">
                  {getInitials(user.username)}
                </div>
                <div className="sidebar-user-info">
                  <div className="sidebar-user-name">{user.username}</div>
                  <div className="sidebar-user-link">View Profile</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default Layout;

