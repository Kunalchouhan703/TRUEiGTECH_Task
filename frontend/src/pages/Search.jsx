import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Search = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followingStates, setFollowingStates] = useState({});
  const navigate = useNavigate();

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
      <h1 style={{ marginBottom: '20px' }}>Search Users</h1>
      <div className="form-group" style={{ marginBottom: '20px' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Search by username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ fontSize: '16px', padding: '12px' }}
        />
      </div>

      {loading && <div className="loading">Searching...</div>}

      {!loading && query && users.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-text">No users found</div>
        </div>
      )}

      {!loading && users.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {users.map(user => (
            <div
              key={user.id}
              style={{
                background: 'white',
                border: '1px solid #dbdbdb',
                borderRadius: '4px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
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
