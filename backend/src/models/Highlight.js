import mongoose from 'mongoose';

const highlightSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: [30, 'Title cannot exceed 30 characters']
  },
  stories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story'
  }],
  coverImage: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

highlightSchema.index({ user: 1, createdAt: -1 });

const Highlight = mongoose.model('Highlight', highlightSchema);

export default Highlight;

