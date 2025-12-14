/**
 * Authentication Middleware
 * 
 * This middleware verifies JWT tokens and attaches user ID to requests.
 * Protects routes that require authentication.
 */

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Authentication Middleware
 * 
 * Verifies JWT token from Authorization header.
 * If valid, attaches userId to request object.
 * If invalid or missing, returns 401 Unauthorized.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    // Format: "Bearer <token>"
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({ 
        message: 'No token provided, authorization denied' 
      });
    }

    // Verify token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user ID to request object for use in controllers
    req.userId = decoded.userId;
    
    // Continue to next middleware/route handler
    next();
  } catch (error) {
    // Token is invalid or expired
    res.status(401).json({ 
      message: 'Token is not valid' 
    });
  }
};
