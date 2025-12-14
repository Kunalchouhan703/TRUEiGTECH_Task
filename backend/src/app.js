/**
 * Express Application Configuration
 * 
 * This file sets up the Express application with middleware,
 * routes, and error handling.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import route handlers
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import feedRoutes from './routes/feed.routes.js';
import searchRoutes from './routes/search.routes.js';

// Load environment variables
dotenv.config();

// Get directory name for ES modules (needed for static file serving)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express application
const app = express();

// ==================== MIDDLEWARE ====================

// Enable CORS (Cross-Origin Resource Sharing) for frontend
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
// Images are accessible at: http://localhost:5000/uploads/filename.jpg
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ==================== ROUTES ====================

// Authentication routes (signup, login)
app.use('/api/auth', authRoutes);

// User routes (profile, follow, unfollow)
app.use('/api/users', userRoutes);

// Post routes (create, like, comment, delete)
app.use('/api/posts', postRoutes);

// Feed routes (get posts from followed users)
app.use('/api/feed', feedRoutes);

// Search routes (search users)
app.use('/api/search', searchRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// ==================== ERROR HANDLING ====================

// 404 handler - Route not found
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;
