import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  caption: {
    type: String,
    default: '',
    maxlength: [500, 'Caption cannot exceed 500 characters']
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

postSchema.index({ user: 1, createdAt: -1 });

const Post = mongoose.model('Post', postSchema);

export default Post;
