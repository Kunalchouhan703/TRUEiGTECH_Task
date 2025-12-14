import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Search = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followingStates, setFollowingStates] = useState({});
  const [searchHistory, setSearchHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history);
  }, []);

  useEffect(() => {
    const searchUsers = async () => {
      if (!query.trim()) {
        setUsers([]);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/search/users?query=${encodeURIComponent(query)}`);
        setUsers(response.data.users);
        
        const states = {};
        response.data.users.forEach(user => {
          states[user.id] = user.isFollowing;
        });
        setFollowingStates(states);

        if (query.trim() && response.data.users.length > 0) {
          const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
          const newHistory = [
            { query: query.trim(), timestamp: Date.now() },
            ...history.filter(item => item.query !== query.trim())
          ].slice(0, 10);
          localStorage.setItem('searchHistory', JSON.stringify(newHistory));
          setSearchHistory(newHistory);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

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
    } catch (err) {
      console.error('Follow/unfollow error:', err);
    }
  };

  return (
    <div className="feed-container">
      <h1 style={{ 
        marginBottom: '30px', 
        fontSize: '24px',
        fontWeight: '400',
        color: '#262626'
      }}>
        Search Users
      </h1>
      <div className="form-group" style={{ marginBottom: '24px' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Search by username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ fontSize: '16px', padding: '14px 16px' }}
        />
      </div>

      {loading && <div className="loading">Searching...</div>}

      {!loading && !query && (
        <div style={{ marginBottom: '24px' }}>
          {searchHistory.length > 0 && (
            <>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#262626' }}>
                Recent Searches
              </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {searchHistory.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px',
                  background: 'white',
                  border: '1px solid #dbdbdb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onClick={() => setQuery(item.query)}
              >
                <span style={{ fontSize: '14px', color: '#262626' }}>{item.query}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newHistory = searchHistory.filter((_, i) => i !== idx);
                    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
                    setSearchHistory(newHistory);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#8e8e8e',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
            </>
          )}
          {searchHistory.length === 0 && (
            <div className="empty-state" style={{ padding: '40px 20px' }}>
              <div className="empty-state-text" style={{ marginBottom: '16px' }}>
                No recent searches
              </div>
              <div className="empty-state-text" style={{ fontSize: '14px' }}>
                Start searching for users above
              </div>
            </div>
          )}
        </div>
      )}

      {!loading && query && users.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-title">No users found</div>
          <div className="empty-state-text">Try a different search term</div>
        </div>
      )}

      {!loading && users.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {users.map(user => (
            <div
              key={user.id}
              style={{
                background: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                onClick={() => navigate(`/profile/${user.id}`)}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#dbdbdb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'white'
                  }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>{user.username}</div>
                  <div style={{ fontSize: '12px', color: '#8e8e8e' }}>{user.email}</div>
                </div>
              </div>
              <button
                className={`profile-button ${followingStates[user.id] ? 'unfollow' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFollow(user.id, followingStates[user.id]);
                }}
                style={{ minWidth: '100px' }}
              >
                {followingStates[user.id] ? 'Unfollow' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
