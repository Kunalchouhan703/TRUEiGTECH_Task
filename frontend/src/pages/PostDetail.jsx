import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [editingCaption, setEditingCaption] = useState(false);
  const [captionText, setCaptionText] = useState('');
  const [savingCaption, setSavingCaption] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [postId]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/posts/${postId}`);
      setPost(response.data.post);
      setCaptionText(response.data.post.caption || '');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const response = await api.get(`/posts/${postId}/comments`);
      setComments(response.data.comments || []);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleLike = async () => {
    if (!post) return;

    try {
      if (post.isLiked) {
        await api.post(`/posts/${postId}/unlike`);
      } else {
        await api.post(`/posts/${postId}/like`);
      }
      
      await fetchPost();
    } catch (err) {
      console.error('Failed to like/unlike:', err);
    }
  };

  const handleAddComment = async () => {
    const text = commentText.trim();
    if (!text) return;

    try {
      const response = await api.post(`/posts/${postId}/comment`, { text });
      
      await fetchComments();
      
      setCommentText('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await api.delete(`/posts/comments/${commentId}`);
      
      await fetchComments();
    } catch (err) {
      console.error('Failed to delete comment:', err);
      alert(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  const handleEditCaption = async () => {
    if (captionText.trim() === post.caption) {
      setEditingCaption(false);
      return;
    }

    try {
      setSavingCaption(true);
      await api.put(`/posts/${postId}/caption`, { caption: captionText.trim() });
      
      setPost(prev => ({ ...prev, caption: captionText.trim() }));
      setEditingCaption(false);
    } catch (err) {
      console.error('Failed to update caption:', err);
      alert(err.response?.data?.message || 'Failed to update caption');
    } finally {
      setSavingCaption(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setDeleting(true);
      await api.delete(`/posts/${postId}`);
      
      navigate('/feed');
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert(err.response?.data?.message || 'Failed to delete post');
    } finally {
      setDeleting(false);
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
    return <div className="loading">Loading post...</div>;
  }

  if (error || !post) {
    return (
      <div className="feed-container">
        <div className="error-message">{error || 'Post not found'}</div>
        <button className="auth-button" onClick={() => navigate('/feed')} style={{ marginTop: '20px' }}>
          Go to Feed
        </button>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <div className="post-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="post-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
          {post.isOwner && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              style={{
                background: '#ed4956',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '12px',
                cursor: deleting ? 'not-allowed' : 'pointer',
                opacity: deleting ? 0.6 : 1
              }}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>
        <img src={post.imageUrl} alt={post.caption} className="post-image" />
        <div className="post-actions">
          <button
            className={`post-action-button ${post.isLiked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            {post.isLiked ? '❤️' : '🤍'}
          </button>
        </div>
        {post.likesCount > 0 && (
          <div
            className="post-likes"
            style={{ cursor: 'pointer' }}
            onClick={() => setShowLikes(true)}
          >
            {post.likesCount} {post.likesCount === 1 ? 'like' : 'likes'}
          </div>
        )}
        <div className="post-caption">
          <span className="post-caption-username">{post.user.username}</span>
          {editingCaption && post.isOwner ? (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginTop: '4px' }}>
              <textarea
                value={captionText}
                onChange={(e) => setCaptionText(e.target.value)}
                style={{
                  flex: 1,
                  border: '1px solid #dbdbdb',
                  borderRadius: '4px',
                  padding: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  minHeight: '60px'
                }}
                maxLength={500}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button
                  onClick={handleEditCaption}
                  disabled={savingCaption}
                  style={{
                    background: '#0095f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    cursor: savingCaption ? 'not-allowed' : 'pointer'
                  }}
                >
                  {savingCaption ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setCaptionText(post.caption);
                    setEditingCaption(false);
                  }}
                  disabled={savingCaption}
                  style={{
                    background: '#efefef',
                    color: '#262626',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    cursor: savingCaption ? 'not-allowed' : 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <span>
              {post.caption}
              {post.isOwner && (
                <button
                  onClick={() => setEditingCaption(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0095f6',
                    fontSize: '12px',
                    cursor: 'pointer',
                    marginLeft: '8px',
                    textDecoration: 'underline'
                  }}
                >
                  Edit
                </button>
              )}
            </span>
          )}
        </div>
        <div className="comments-section">
          <div className="comments-list">
            {loadingComments ? (
              <div className="loading">Loading comments...</div>
            ) : comments.length > 0 ? (
              comments.map(comment => (
                <div key={comment.id} className="comment-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
                    <span className="comment-username">{comment.user.username}</span>
                    <span className="comment-text">{comment.text}</span>
                  </div>
                  {(comment.isOwner || comment.postOwner) && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ed4956',
                        fontSize: '12px',
                        cursor: 'pointer',
                        padding: '0 4px'
                      }}
                      title="Delete comment"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div style={{ padding: '12px', color: '#8e8e8e', fontSize: '14px' }}>
                No comments yet
              </div>
            )}
          </div>
          <div className="comment-form">
            <input
              type="text"
              className="comment-input"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddComment();
                }
              }}
            />
            <button
              className="comment-button"
              onClick={handleAddComment}
              disabled={!commentText.trim()}
            >
              Post
            </button>
          </div>
        </div>
        <div className="post-time">{formatTime(post.createdAt)}</div>
      </div>

      {/* Likes Modal */}
      {showLikes && (
        <div className="modal-overlay" onClick={() => setShowLikes(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Likes</h2>
              <button onClick={() => setShowLikes(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {post.likes && post.likes.length > 0 ? (
                post.likes.map(like => (
                  <div
                    key={like.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #efefef'
                    }}
                    onClick={() => {
                      navigate(`/profile/${like.id}`);
                      setShowLikes(false);
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
                      {like.username.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{like.username}</div>
                  </div>
                ))
              ) : (
                <div className="empty-state-text">No likes yet</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;

