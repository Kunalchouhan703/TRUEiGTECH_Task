/**
 * User Routes
 * 
 * Protected routes for user operations:
 * - PUT /api/users/profile - Update current user's profile
 * - GET /api/users/:userId - Get user profile
 * - POST /api/users/:targetUserId/follow - Follow a user
 * - POST /api/users/:targetUserId/unfollow - Unfollow a user
 * 
 * All routes require authentication.
 */

import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { 
  followUser, 
  unfollowUser, 
  getUserProfile, 
  updateProfile 
} from '../controllers/user.controller.js';

const router = express.Router();

// ==================== MIDDLEWARE ====================

// All routes require authentication
router.use(authenticate);

// ==================== ROUTES ====================

// Update current user's profile (must come before /:userId to avoid route conflict)
router.put('/profile', upload.single('profilePhoto'), updateProfile);

// Get user profile by ID
router.get('/:userId', getUserProfile);

// Follow a user
router.post('/:targetUserId/follow', followUser);

// Unfollow a user
router.post('/:targetUserId/unfollow', unfollowUser);

export default router;
