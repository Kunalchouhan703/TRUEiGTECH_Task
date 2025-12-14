/**
 * User Model
 * 
 * Defines the User schema for MongoDB.
 * Handles user authentication, profile information, and social connections.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

/**
 * User Schema
 * 
 * Fields:
 * - username: Unique username (3-30 characters)
 * - email: Unique email address
 * - password: Hashed password (min 6 characters)
 * - followers: Array of User IDs who follow this user
 * - following: Array of User IDs this user follows
 * - profilePhoto: URL to profile photo
 * - bio: User bio/description (max 150 characters)
 * - createdAt: Account creation timestamp
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password in queries by default
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  profilePhoto: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    default: '',
    maxlength: [150, 'Bio cannot exceed 150 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Pre-save hook: Hash password before saving
 * Only hashes if password is modified (not on every save)
 */
userSchema.pre('save', async function(next) {
  // Skip if password is not modified
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance method: Compare password with hashed password
 * 
 * @param {string} candidatePassword - Password to compare
 * @returns {Promise<boolean>} - True if passwords match
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create and export User model
const User = mongoose.model('User', userSchema);

export default User;
