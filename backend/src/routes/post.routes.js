/**
 * Post Routes
 * 
 * Protected routes for post operations:
 * - POST /api/posts - Create a new post
 * - GET /api/posts/user/:userId - Get all posts by a user
 * - GET /api/posts/:postId - Get a single post
 * - DELETE /api/posts/:postId - Delete a post
 * - POST /api/posts/:postId/like - Like a post
 * - POST /api/posts/:postId/unlike - Unlike a post
 * - POST /api/posts/:postId/comment - Add comment to post
 * - GET /api/posts/:postId/comments - Get comments for a post
 * - DELETE /api/posts/comments/:commentId - Delete a comment
 * - PUT /api/posts/:postId/caption - Update post caption
 * 
 * All routes require authentication.
 * 
 * Note: Route order matters! More specific routes must come before parameterized routes.
 */

import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import {
  createPost,
  likePost,
  unlikePost,
  addComment,
  getComments,
  deleteComment,
  getUserPosts,
  getPostById,
  deletePost,
  updatePostCaption
} from '../controllers/post.controller.js';

const router = express.Router();

// ==================== MIDDLEWARE ====================

// All routes require authentication
router.use(authenticate);

// ==================== ROUTES ====================
// Note: Order matters! Specific routes before parameterized routes

// Create a new post (supports both file upload and URL)
router.post('/', upload.single('image'), createPost);

// Get all posts by a specific user (must come before /:postId)
router.get('/user/:userId', getUserPosts);

// Delete a comment (must come before /:postId routes)
router.delete('/comments/:commentId', deleteComment);

// Get comments for a post (must come before /:postId)
router.get('/:postId/comments', getComments);

// Update post caption
router.put('/:postId/caption', updatePostCaption);

// Like a post
router.post('/:postId/like', likePost);

// Unlike a post
router.post('/:postId/unlike', unlikePost);

// Add comment to a post
router.post('/:postId/comment', addComment);

// Get a single post by ID
router.get('/:postId', getPostById);

// Delete a post
router.delete('/:postId', deletePost);

export default router;
