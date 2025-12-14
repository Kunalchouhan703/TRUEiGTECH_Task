import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CreatePost = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('file');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setImageFile(file);
      setImageUrl('');
      setError('');
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (uploadMethod === 'file' && !imageFile) {
      setError('Please select an image file');
      return;
    }
    if (uploadMethod === 'url' && !imageUrl) {
      setError('Please provide an image URL');
      return;
    }

    setLoading(true);

    try {
      if (uploadMethod === 'file' && imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('caption', caption);

        await api.post('/posts', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await api.post('/posts', {
          imageUrl,
          caption
        });
      }

      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <h1 style={{ marginBottom: '20px' }}>Create New Post</h1>
      <div className="create-post-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Upload Method</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button
                type="button"
                className={`profile-button ${uploadMethod === 'file' ? '' : 'unfollow'}`}
                onClick={() => {
                  setUploadMethod('file');
                  setImageUrl('');
                  setImagePreview(null);
                }}
              >
                Upload from Device
              </button>
              <button
                type="button"
                className={`profile-button ${uploadMethod === 'url' ? '' : 'unfollow'}`}
                onClick={() => {
                  setUploadMethod('url');
                  setImageFile(null);
                  setImagePreview(null);
                }}
              >
                Use Image URL
              </button>
            </div>
          </div>

          {uploadMethod === 'file' ? (
            <div className="form-group">
              <label className="form-label">Select Image</label>
              <input
                type="file"
                accept="image/*"
                className="form-input"
                onChange={handleFileChange}
                required={uploadMethod === 'file'}
              />
              {imagePreview && (
                <div style={{ marginTop: '10px' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '4px' }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required={uploadMethod === 'url'}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Caption</label>
            <textarea
              className="form-textarea"
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={500}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
