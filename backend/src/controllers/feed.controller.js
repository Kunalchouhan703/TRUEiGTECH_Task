/**
 * Feed Controller
 * 
 * Handles feed-related operations.
 * Feed shows posts from users that the current user follows.
 */

import Post from '../models/Post.js';
import User from '../models/User.js';

/**
 * Get Feed
 * 
 * Retrieves posts from users that the current user follows.
 * Posts are sorted by newest first and limited to 50 for performance.
 * 
 * @route GET /api/feed
 * @access Private
 */
export const getFeed = async (req, res) => {
  try {
    const { userId } = req; // Current user (from auth middleware)

    // Get current user with following list
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    // Get posts from users that current user follows
    // Using $in operator for efficient querying
    // Sorted by newest first, limited to 50 posts
    const posts = await Post.find({
      user: { $in: currentUser.following }
    })
      .populate('user', 'username') // Populate user info
      .populate('likes', 'username') // Populate likes info
      .sort({ createdAt: -1 }) // Newest first
      .limit(50); // Limit for performance

    // Return formatted posts with like status
    res.status(200).json({
      posts: posts.map(post => ({
        id: post._id,
        user: {
          id: post.user._id,
          username: post.user.username
        },
        imageUrl: post.imageUrl,
        caption: post.caption,
        likes: post.likes.map(like => ({
          id: like._id,
          username: like.username
        })),
        likesCount: post.likes.length,
        isLiked: post.likes.some(like => like._id.toString() === userId),
        createdAt: post.createdAt
      }))
    });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
};
