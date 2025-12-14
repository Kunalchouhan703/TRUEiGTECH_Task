/**
 * Feed Routes
 * 
 * Protected routes for feed operations:
 * - GET /api/feed - Get feed (posts from followed users)
 * 
 * All routes require authentication.
 */

import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { getFeed } from '../controllers/feed.controller.js';

const router = express.Router();

// ==================== MIDDLEWARE ====================

// All routes require authentication
router.use(authenticate);

// ==================== ROUTES ====================

// Get feed - posts from users the current user follows
router.get('/', getFeed);

export default router;
