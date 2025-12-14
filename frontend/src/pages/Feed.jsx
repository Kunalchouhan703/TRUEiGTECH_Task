import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentTexts, setCommentTexts] = useState({}); // Store comment input for each post
  const [comments, setComments] = useState({}); // Store comments for each post
  const [loadingComments, setLoadingComments] = useState({});
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const response = await api.get('/feed');
      setPosts(response.data.posts);
      
      // Initialize comment texts and fetch comments for each post
      const initialCommentTexts = {};
      response.data.posts.forEach(post => {
        initialCommentTexts[post.id] = '';
      });
      setCommentTexts(initialCommentTexts);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId) => {
    if (comments[postId]) return; // Already loaded

    try {
      setLoadingComments(prev => ({ ...prev, [postId]: true }));
      const response = await api.get(`/posts/${postId}/comments`);
      setComments(prev => ({ ...prev, [postId]: response.data.comments }));
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoadingComments(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleLike = async (postId, isLiked) => {
    try {
      if (isLiked) {
        await api.post(`/posts/${postId}/unlike`);
      } else {
        await api.post(`/posts/${postId}/like`);
      }
      
      // Update post in state
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              isLiked: !isLiked,
              likesCount: isLiked ? post.likesCount - 1 : post.likesCount + 1
            };
          }
          return post;
        })
      );
    } catch (err) {
      console.error('Failed to like/unlike:', err);
    }
  };

  const handleAddComment = async (postId) => {
    const text = commentTexts[postId]?.trim();
    if (!text) return;

    try {
      const response = await api.post(`/posts/${postId}/comment`, { text });
      
      // Add comment to state
      setComments(prev => ({
        ...prev,
        [postId]: [response.data.comment, ...(prev[postId] || [])]
      }));
      
      // Clear input
      setCommentTexts(prev => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'JUST NOW';
    if (minutes < 60) return `${minutes} MINUTES AGO`;
    if (hours < 24) return `${hours} HOURS AGO`;
    if (days < 7) return `${days} DAYS AGO`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return <div className="loading">Loading feed...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">No posts yet</div>
        <div className="empty-state-text">
          Follow some users to see their posts in your feed!
        </div>
      </div>
    );
  }

  return (
    <div className="feed-container">
      {posts.map(post => (
        <div key={post.id} className="post-card">
          <div className="post-header">
            <a
              href={`/profile/${post.user.id}`}
              className="post-username"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/profile/${post.user.id}`);
              }}
            >
              {post.user.username}
            </a>
          </div>
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/post/${post.id}`)}
          >
            <img src={post.imageUrl} alt={post.caption} className="post-image" />
          </div>
          <div className="post-actions">
            <button
              className={`post-action-button ${post.isLiked ? 'liked' : ''}`}
              onClick={() => handleLike(post.id, post.isLiked)}
            >
              {post.isLiked ? '❤️' : '🤍'}
            </button>
          </div>
          {post.likesCount > 0 && (
            <div className="post-likes">{post.likesCount} likes</div>
          )}
          <div className="post-caption">
            <span className="post-caption-username">{post.user.username}</span>
            {post.caption}
          </div>
          <div className="comments-section">
            <div className="comments-list">
              {comments[post.id]?.map(comment => (
                <div key={comment.id} className="comment-item">
                  <span className="comment-username">{comment.user.username}</span>
                  <span className="comment-text">{comment.text}</span>
                </div>
              ))}
              {loadingComments[post.id] && (
                <div className="loading">Loading comments...</div>
              )}
            </div>
            <div className="comment-form">
              <input
                type="text"
                className="comment-input"
                placeholder="Add a comment..."
                value={commentTexts[post.id] || ''}
                onChange={(e) =>
                  setCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))
                }
                onFocus={() => fetchComments(post.id)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddComment(post.id);
                  }
                }}
              />
              <button
                className="comment-button"
                onClick={() => handleAddComment(post.id)}
                disabled={!commentTexts[post.id]?.trim()}
              >
                Post
              </button>
            </div>
          </div>
          <div className="post-time">{formatTime(post.createdAt)}</div>
        </div>
      ))}
    </div>
  );
};

export default Feed;

