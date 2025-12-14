/**
 * Post Model
 * 
 * Defines the Post schema for MongoDB.
 * Represents user posts with images, captions, and likes.
 */

import mongoose from 'mongoose';

/**
 * Post Schema
 * 
 * Fields:
 * - user: Reference to User who created the post
 * - imageUrl: URL to the post image
 * - caption: Post caption/description (max 500 characters)
 * - likes: Array of User IDs who liked this post
 * - createdAt: Post creation timestamp
 */
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

/**
 * Index for efficient querying
 * - user: 1 (ascending) - for finding all posts by a user
 * - createdAt: -1 (descending) - for sorting by newest first
 * 
 * This index improves performance when querying user posts sorted by date
 */
postSchema.index({ user: 1, createdAt: -1 });

// Create and export Post model
const Post = mongoose.model('Post', postSchema);

export default Post;
