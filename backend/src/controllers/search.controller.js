/**
 * Search Controller
 * 
 * Handles user search functionality.
 * Allows users to search for other users by username.
 */

import User from '../models/User.js';

/**
 * Search Users
 * 
 * Searches for users by username (case-insensitive, partial match).
 * Excludes current user from results.
 * Returns following status for each user.
 * 
 * @route GET /api/search/users?query=<username>
 * @access Private
 */
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const { userId } = req; // Current user (from auth middleware)

    // Return empty array if query is empty
    if (!query || query.trim() === '') {
      return res.status(200).json({ 
        users: [] 
      });
    }

    // Search users by username (case-insensitive, partial match)
    // Exclude current user from results
    const users = await User.find({
      username: { $regex: query, $options: 'i' }, // Case-insensitive regex
      _id: { $ne: userId } // Exclude current user
    })
      .select('username email') // Only return username and email
      .limit(20); // Limit to 20 results

    // Get current user's following list to check follow status
    const currentUser = await User.findById(userId).select('following');

    // Return users with following status
    res.status(200).json({
      users: users.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email,
        isFollowing: currentUser.following.some(
          id => id.toString() === user._id.toString()
        )
      }))
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
};
