/**
 * Comment Model
 * 
 * Defines the Comment schema for MongoDB.
 * Represents comments on posts.
 */

import mongoose from 'mongoose';

/**
 * Comment Schema
 * 
 * Fields:
 * - user: Reference to User who made the comment
 * - post: Reference to Post this comment belongs to
 * - text: Comment text (max 500 characters)
 * - createdAt: Comment creation timestamp
 */
const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Post is required']
  },
  text: {
    type: String,
    required: [true, 'Comment text is required'],
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Index for efficient querying
 * - post: 1 (ascending) - for finding all comments on a post
 * - createdAt: -1 (descending) - for sorting by newest first
 * 
 * This index improves performance when loading comments for a post
 */
commentSchema.index({ post: 1, createdAt: -1 });

// Create and export Comment model
const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
