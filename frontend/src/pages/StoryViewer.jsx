import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const StoryViewer = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, [userId]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/stories/user/${userId}`);
      setStories(response.data.stories || []);
      setCurrentIndex(0);
    } catch (err) {
      console.error('Failed to load stories:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate('/feed');
    }
  };

  const prevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (loading) {
    return <div className="loading">Loading story...</div>;
  }

  if (stories.length === 0) {
    return (
      <div className="feed-container">
        <div className="empty-state">
          <div className="empty-state-title">No stories available</div>
          <button className="auth-button" onClick={() => navigate('/feed')} style={{ marginTop: '20px' }}>
            Go to Feed
          </button>
        </div>
      </div>
    );
  }

  const currentStory = stories[currentIndex];

  return (
    <div className="story-viewer">
      <div className="story-viewer-container">
        <div className="story-viewer-header">
          <button className="story-close-button" onClick={() => navigate('/feed')}>
            ×
          </button>
        </div>
        <div className="story-progress-bar">
          {stories.map((_, idx) => (
            <div
              key={idx}
              className={`story-progress ${idx <= currentIndex ? 'active' : ''}`}
              style={{ width: `${100 / stories.length}%` }}
            />
          ))}
        </div>
        <div className="story-image-container">
          <img
            src={currentStory.imageUrl}
            alt="Story"
            className="story-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <button className="story-nav-button story-prev" onClick={prevStory}>
            ‹
          </button>
          <button className="story-nav-button story-next" onClick={nextStory}>
            ›
          </button>
        </div>
        <div className="story-viewer-footer">
          <div className="story-info">
            Story {currentIndex + 1} of {stories.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;

