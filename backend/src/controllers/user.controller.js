/**
 * User Controller
 * 
 * Handles user-related operations:
 * - Follow/Unfollow users
 * - Get user profile
 * - Update user profile
 */

import User from '../models/User.js';

/**
 * Follow a User
 * 
 * Adds target user to current user's following list
 * and adds current user to target user's followers list.
 * 
 * @route POST /api/users/:targetUserId/follow
 * @access Private
 */
export const followUser = async (req, res) => {
  try {
    const { userId } = req; // Current user (from auth middleware)
    const { targetUserId } = req.params; // User to follow

    // Prevent users from following themselves
    if (userId === targetUserId) {
      return res.status(400).json({ 
        message: 'You cannot follow yourself' 
      });
    }

    // Check if target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    // Get current user
    const currentUser = await User.findById(userId);

    // Check if already following
    if (currentUser.following.includes(targetUserId)) {
      return res.status(400).json({ 
        message: 'You are already following this user' 
      });
    }

    // Add target user to current user's following list
    currentUser.following.push(targetUserId);
    await currentUser.save();

    // Add current user to target user's followers list
    targetUser.followers.push(userId);
    await targetUser.save();

    res.status(200).json({ 
      message: 'Successfully followed user' 
    });
  } catch (error) {
    console.error('Follow error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
};

/**
 * Unfollow a User
 * 
 * Removes target user from current user's following list
 * and removes current user from target user's followers list.
 * 
 * @route POST /api/users/:targetUserId/unfollow
 * @access Private
 */
export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req; // Current user (from auth middleware)
    const { targetUserId } = req.params; // User to unfollow

    // Get both users
    const currentUser = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    // Check if currently following
    if (!currentUser.following.includes(targetUserId)) {
      return res.status(400).json({ 
        message: 'You are not following this user' 
      });
    }

    // Remove target user from current user's following list
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== targetUserId
    );
    await currentUser.save();

    // Remove current user from target user's followers list
    targetUser.followers = targetUser.followers.filter(
      id => id.toString() !== userId
    );
    await targetUser.save();

    res.status(200).json({ 
      message: 'Successfully unfollowed user' 
    });
  } catch (error) {
    console.error('Unfollow error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
};

/**
 * Get User Profile
 * 
 * Retrieves user profile information including followers, following,
 * profile photo, and bio.
 * 
 * @route GET /api/users/:userId
 * @access Private
 */
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params; // Target user ID
    const currentUserId = req.userId; // Current logged-in user

    // Find user and populate followers/following
    const user = await User.findById(userId)
      .select('-password') // Exclude password from response
      .populate('followers', 'username')
      .populate('following', 'username');

    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    // Check if current user is following this user
    const isFollowing = user.followers.some(
      follower => follower._id.toString() === currentUserId
    );

    // Return formatted user data
    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePhoto: user.profilePhoto,
        bio: user.bio || '',
        followers: user.followers.map(f => ({
          id: f._id,
          username: f.username
        })),
        following: user.following.map(f => ({
          id: f._id,
          username: f.username
        })),
        followersCount: user.followers.length,
        followingCount: user.following.length,
        isFollowing: isFollowing,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
};

/**
 * Update User Profile
 * 
 * Updates current user's profile information:
 * - Username (with uniqueness check)
 * - Bio
 * - Profile photo (if uploaded)
 * 
 * @route PUT /api/users/profile
 * @access Private
 */
export const updateProfile = async (req, res) => {
  try {
    const { userId } = req; // Current user (from auth middleware)
    const { username, bio } = req.body;

    // Find current user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    // Update username if provided and different
    if (username && username !== user.username) {
      // Check if username is already taken by another user
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: userId } 
      });
      
      if (existingUser) {
        return res.status(400).json({ 
          message: 'Username already taken' 
        });
      }
      
      user.username = username;
    }

    // Update bio if provided
    if (bio !== undefined) {
      user.bio = bio.trim();
    }

    // Handle profile photo upload
    if (req.file) {
      // Generate full URL for uploaded image
      user.profilePhoto = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    // Save updated user
    await user.save();

    // Return updated user data
    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePhoto: user.profilePhoto,
        bio: user.bio || ''
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
};
