/**
 * Search Routes
 * 
 * Protected routes for search operations:
 * - GET /api/search/users?query=<username> - Search users by username
 * 
 * All routes require authentication.
 */

import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { searchUsers } from '../controllers/search.controller.js';

const router = express.Router();

// ==================== MIDDLEWARE ====================

// All routes require authentication
router.use(authenticate);

// ==================== ROUTES ====================

// Search users by username
router.get('/users', searchUsers);

export default router;
