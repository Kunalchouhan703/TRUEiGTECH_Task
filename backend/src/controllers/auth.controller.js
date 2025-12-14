/**
 * Authentication Controller
 * 
 * Handles user authentication: signup and login.
 * Generates JWT tokens for authenticated users.
 */

import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Generate JWT Token
 * 
 * Creates a JSON Web Token for user authentication.
 * Token expires in 7 days.
 * 
 * @param {string} userId - User ID to encode in token
 * @returns {string} - JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET, 
    { expiresIn: '7d' }
  );
};

/**
 * User Signup
 * 
 * Creates a new user account.
 * Validates input, checks for duplicates, hashes password, and returns JWT token.
 * 
 * @route POST /api/auth/signup
 * @access Public
 */
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: 'Please provide username, email, and password' 
      });
    }

    // Check if user already exists (by email or username)
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Create new user
    // Password will be automatically hashed by User model pre-save hook
    const user = new User({
      username,
      email,
      password,
      followers: [],
      following: []
    });

    await user.save();

    // Generate JWT token for the new user
    const token = generateToken(user._id);

    // Return success response with token and user data (without password)
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: 'Server error during signup' 
    });
  }
};

/**
 * User Login
 * 
 * Authenticates an existing user.
 * Validates credentials and returns JWT token.
 * 
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password' 
      });
    }

    // Find user by email
    // Note: password field is not selected by default in User model
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Verify password using User model method
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Return success response with token and user data (without password)
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login' 
    });
  }
};
