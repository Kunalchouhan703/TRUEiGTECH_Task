import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CreateStory = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
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

        await api.post('/stories', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await api.post('/stories', {
          imageUrl
        });
      }

      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create story');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <h1>Create Story</h1>
      <div className="create-post-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Upload Method</label>
            <div className="upload-method-buttons">
              <button
                type="button"
                className={`upload-method-button ${uploadMethod === 'file' ? 'active' : ''}`}
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
                className={`upload-method-button ${uploadMethod === 'url' ? 'active' : ''}`}
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

          {error && <div className="error-message">{error}</div>}
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Story'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateStory;

