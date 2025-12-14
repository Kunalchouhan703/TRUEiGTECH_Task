/**
 * Authentication Routes
 * 
 * Public routes for user authentication:
 * - POST /api/auth/signup - Create new user account
 * - POST /api/auth/login - Login existing user
 */

import express from 'express';
import { signup, login } from '../controllers/auth.controller.js';

const router = express.Router();

// ==================== PUBLIC ROUTES ====================

// User signup - Create new account
router.post('/signup', signup);

// User login - Authenticate existing user
router.post('/login', login);

export default router;
