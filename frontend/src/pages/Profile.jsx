import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editProfilePhoto, setEditProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [highlights, setHighlights] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isOwnProfile = (currentUser.id || currentUser._id) === userId;

  useEffect(() => {
    fetchProfile();
    fetchPosts();
    if (isOwnProfile) {
      fetchHighlights();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/${userId}`);
      setProfile(response.data.user);
      setIsFollowing(response.data.user.isFollowing || false);
      setEditUsername(response.data.user.username);
      setEditBio(response.data.user.bio || '');
      setProfilePhotoPreview(response.data.user.profilePhoto);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await api.get(`/posts/user/${userId}`);
      setPosts(response.data.posts || []);
    } catch (err) {
      console.error('Failed to load posts:', err);
      setPosts([]);
    }
  };

  const fetchHighlights = async () => {
    try {
      const response = await api.get(`/highlights/user/${userId}`);
      setHighlights(response.data.highlights || []);
    } catch (err) {
      console.error('Failed to load highlights:', err);
      setHighlights([]);
    }
  };

  const handleFollow = async () => {
    if (loadingAction) return;

    try {
      setLoadingAction(true);
      if (isFollowing) {
        await api.post(`/users/${userId}/unfollow`);
      } else {
        await api.post(`/users/${userId}/follow`);
      }
      await fetchProfile();
    } catch (err) {
      console.error('Failed to follow/unfollow:', err);
      alert(err.response?.data?.message || 'Failed to follow/unfollow user');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      setEditProfilePhoto(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true);
      const formData = new FormData();
      formData.append('username', editUsername);
      formData.append('bio', editBio);
      if (editProfilePhoto) {
        formData.append('profilePhoto', editProfilePhoto);
        formData.append('type', 'profile');
      }

      const response = await api.put('/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setProfile(prev => ({
        ...prev,
        username: response.data.user.username,
        bio: response.data.user.bio,
        profilePhoto: response.data.user.profilePhoto
      }));

      if (isOwnProfile) {
        const updatedUser = { ...currentUser, username: response.data.user.username };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      setShowEditProfile(false);
      setEditProfilePhoto(null);
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : '?';
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error || !profile) {
    return (
      <div className="feed-container">
        <div className="error-message" style={{ marginTop: '20px' }}>{error || 'Profile not found'}</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar" style={{ position: 'relative' }}>
          {profile.profilePhoto ? (
            <img
              src={profile.profilePhoto}
              alt={profile.username}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          ) : (
            getInitials(profile.username)
          )}
        </div>
        <div className="profile-info">
          <div className="profile-username">{profile.username}</div>
          {profile.bio && (
            <div style={{ marginBottom: '12px', fontSize: '14px', color: '#262626' }}>
              {profile.bio}
            </div>
          )}
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="profile-stat-number">{posts.length}</span> posts
            </div>
            <div
              className="profile-stat"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowFollowers(true)}
            >
              <span className="profile-stat-number">{profile.followers?.length || profile.followersCount || 0}</span> followers
            </div>
            <div
              className="profile-stat"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowFollowing(true)}
            >
              <span className="profile-stat-number">{profile.following?.length || profile.followingCount || 0}</span> following
            </div>
          </div>
          {!isOwnProfile && (
            <div className="profile-actions">
              <button
                className={`profile-button ${isFollowing ? 'unfollow' : ''}`}
                onClick={handleFollow}
                disabled={loadingAction}
              >
                {loadingAction
                  ? '...'
                  : isFollowing
                  ? 'Unfollow'
                  : 'Follow'}
              </button>
            </div>
          )}
          {isOwnProfile && (
            <div className="profile-actions" style={{ flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
              <button
                className="profile-button"
                onClick={() => setShowEditProfile(true)}
              >
                Edit Profile
              </button>
              <button
                className="profile-button"
                onClick={() => navigate('/create-post')}
              >
                Create Post
              </button>
            </div>
          )}
        </div>
      </div>
      {isOwnProfile && highlights.length > 0 && (
        <div style={{ marginBottom: '44px', borderBottom: '1px solid #dbdbdb', paddingBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '8px 0' }}>
            {highlights.map(highlight => (
              <div
                key={highlight.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  minWidth: '80px',
                  cursor: 'pointer'
                }}
                onClick={() => navigate(`/highlights/${highlight.id}`)}
              >
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: highlight.coverImage ? `url(${highlight.coverImage})` : '#dbdbdb',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '2px solid #dbdbdb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    color: 'white',
                    fontWeight: '600'
                  }}
                >
                  {!highlight.coverImage && '📌'}
                </div>
                <div style={{ fontSize: '12px', color: '#262626', textAlign: 'center' }}>
                  {highlight.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-title">No posts yet</div>
        </div>
      ) : (
        <div className="profile-posts">
          {posts.map(post => (
            <div
              key={post.id}
              className="profile-post-item"
              onClick={() => navigate(`/post/${post.id}`)}
              title={post.caption}
            >
              <img
                src={post.imageUrl}
                alt={post.caption}
                className="profile-post-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300?text=Image+Not+Found';
                }}
              />
            </div>
          ))}
        </div>
      )}

      {showFollowers && (
        <div className="modal-overlay" onClick={() => setShowFollowers(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Followers</h2>
              <button onClick={() => setShowFollowers(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {profile.followers && profile.followers.length > 0 ? (
                profile.followers.map(follower => (
                  <div
                    key={follower.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #efefef'
                    }}
                    onClick={() => {
                      navigate(`/profile/${follower.id}`);
                      setShowFollowers(false);
                    }}
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
                      {follower.username.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{follower.username}</div>
                  </div>
                ))
              ) : (
                <div className="empty-state-text">No followers yet</div>
              )}
            </div>
          </div>
        </div>
      )}

      {showFollowing && (
        <div className="modal-overlay" onClick={() => setShowFollowing(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Following</h2>
              <button onClick={() => setShowFollowing(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {profile.following && profile.following.length > 0 ? (
                profile.following.map(following => (
                  <div
                    key={following.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #efefef'
                    }}
                    onClick={() => {
                      navigate(`/profile/${following.id}`);
                      setShowFollowing(false);
                    }}
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
                      {following.username.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{following.username}</div>
                  </div>
                ))
              ) : (
                <div className="empty-state-text">Not following anyone yet</div>
              )}
            </div>
          </div>
        </div>
      )}

      {showEditProfile && (
        <div className="modal-overlay" onClick={() => setShowEditProfile(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Profile</h2>
            <button className="modal-close-button" onClick={() => setShowEditProfile(false)}>
              ×
            </button>
            
            <div className="edit-profile-form">
              <div className="edit-profile-photo-container">
                <div className="edit-profile-photo-preview">
                  {profilePhotoPreview ? (
                    <img
                      src={profilePhotoPreview}
                      alt="Preview"
                    />
                  ) : (
                    getInitials(editUsername)
                  )}
                </div>
                <div className="edit-profile-file-input">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhotoChange}
                    style={{ fontSize: '14px', width: '100%' }}
                  />
                  <div className="edit-profile-file-hint">
                    JPG, PNG or GIF. Max size 5MB
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-input"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  minLength={3}
                  maxLength={30}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea
                  className="form-textarea"
                  placeholder="Write something about yourself..."
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  maxLength={150}
                  rows={3}
                />
                <div style={{ fontSize: '12px', color: '#8e8e8e', marginTop: '4px', textAlign: 'right' }}>
                  {editBio.length}/150
                </div>
              </div>

              <div className="edit-profile-actions">
                <button
                  className="edit-profile-cancel"
                  onClick={() => setShowEditProfile(false)}
                  disabled={savingProfile}
                >
                  Cancel
                </button>
                <button
                  className="edit-profile-save"
                  onClick={handleSaveProfile}
                  disabled={savingProfile || !editUsername.trim()}
                >
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

