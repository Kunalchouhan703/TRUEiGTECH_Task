/**
 * Post Controller
 * 
 * Handles all post-related operations:
 * - Create, read, update, delete posts
 * - Like/unlike posts
 * - Add, get, delete comments
 * - Get user's posts
 */

import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';

/**
 * Create a New Post
 * 
 * Creates a new post with image (from file upload or URL) and optional caption.
 * Supports both file uploads and image URLs.
 * 
 * @route POST /api/posts
 * @access Private
 */
export const createPost = async (req, res) => {
  try {
    const { userId } = req; // Current user (from auth middleware)
    
    // Support both file upload and URL
    let imageUrl = req.body.imageUrl;
    
    // If file was uploaded, generate full URL
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    // Validate that image URL or file is provided
    if (!imageUrl) {
      return res.status(400).json({ 
        message: 'Image URL or file is required' 
      });
    }

    const caption = req.body.caption || '';

    // Create new post
    const post = new Post({
      user: userId,
      imageUrl,
      caption: caption,
      likes: []
    });

    await post.save();

    // Populate user information
    await post.populate('user', 'username');

    // Return created post
    res.status(201).json({
      message: 'Post created successfully',
      post: {
        id: post._id,
        user: {
          id: post.user._id,
          username: post.user.username
        },
        imageUrl: post.imageUrl,
        caption: post.caption,
        likes: [],
        likesCount: 0,
        createdAt: post.createdAt
      }
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
};

/**
 * Like a Post
 * 
 * Adds current user to post's likes array.
 * Prevents duplicate likes.
 * 
 * @route POST /api/posts/:postId/like
 * @access Private
 */
export const likePost = async (req, res) => {
  try {
    const { userId } = req; // Current user (from auth middleware)
    const { postId } = req.params;

    // Find post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        message: 'Post not found' 
      });
    }

    // Check if already liked (prevent duplicate likes)
    if (post.likes.includes(userId)) {
      return res.status(400).json({ 
        message: 'Post already liked' 
      });
    }

    // Add user to likes array
    post.likes.push(userId);
    await post.save();

    res.status(200).json({
      message: 'Post liked successfully',
      likesCount: post.likes.length
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
};

/**
 * Unlike a Post
 * 
 * Removes current user from post's likes array.
 * 
 * @route POST /api/posts/:postId/unlike
 * @access Private
 */
export const unlikePost = async (req, res) => {
  try {
    const { userId } = req; // Current user (from auth middleware)
    const { postId } = req.params;

    // Find post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        message: 'Post not found' 
      });
    }

    // Check if post is liked
    if (!post.likes.includes(userId)) {
      return res.status(400).json({ 
        message: 'Post not liked yet' 
      });
    }

    // Remove user from likes array
    post.likes = post.likes.filter(
      id => id.toString() !== userId
    );
    await post.save();

    res.status(200).json({
      message: 'Post unliked successfully',
      likesCount: post.likes.length
    });
  } catch (error) {
    console.error('Unlike post error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
};

/**
 * Add Comment to a Post
 * 
 * Creates a new comment on a post.
 * 
 * @route POST /api/posts/:postId/comment
 * @access Private
 */
export const addComment = async (req, res) => {
  try {
    const { userId } = req; // Current user (from auth middleware)
    const { postId } = req.params;
    const { text } = req.body;

    // Validate comment text
    if (!text || text.trim() === '') {
      return res.status(400).json({ 
        message: 'Comment text is required' 
      });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        message: 'Post not found' 
      });
    }

    // Create new comment
    const comment = new Comment({
      user: userId,
      post: postId,
      text: text.trim()
    });

    await comment.save();

    // Populate user information
    await comment.populate('user', 'username');

    // Return created comment
    res.status(201).json({
      message: 'Comment added successfully',
      comment: {
        id: comment._id,
        user: {
          id: comment.user._id,
          username: comment.user.username
        },
        text: comment.text,
        createdAt: comment.createdAt
      }
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
};

/**
 * Get Comments for a Post
 * 
 * Retrieves all comments for a specific post, sorted by newest first.
 * Includes ownership information for frontend permissions.
 * 
 * @route GET /api/posts/:postId/comments
 * @access Private
 */
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const currentUserId = req.userId; // Current logged-in user

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        message: 'Post not found' 
      });
    }

    // Get all comments for this post (newest first)
    const comments = await Comment.find({ post: postId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    // Return comments with ownership information
    res.status(200).json({
      comments: comments.map(comment => ({
        id: comment._id,
        user: {
          id: comment.user._id,
          username: comment.user.username
        },
        text: comment.text,
        createdAt: comment.createdAt,
        isOwner: comment.user._id.toString() === currentUserId,
        postOwner: post.user.toString() === currentUserId
      }))
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
};

/**
 * Delete a Comment
 * 
 * Deletes a comment. Only comment owner or post owner can delete.
 * 
 * @route DELETE /api/posts/comments/:commentId
 * @access Private
 */
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req; // Current user (from auth middleware)

    // Find comment and populate post information
    const comment = await Comment.findById(commentId).populate('post', 'user');
    
    if (!comment) {
      return res.status(404).json({ 
        message: 'Comment not found' 
      });
    }

    // Check permissions: comment owner OR post owner can delete
    const isCommentOwner = comment.user.toString() === userId;
    const isPostOwner = comment.post.user.toString() === userId;

    if (!isCommentOwner && !isPostOwner) {
      return res.status(403).json({ 
        message: 'You can only delete your own comments or comments on your posts' 
      });
    }

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ 
      message: 'Comment deleted successfully' 
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
};

/**
 * Update Post Caption
 * 
 * Updates the caption of a post. Only post owner can update.
 * 
 * @route PUT /api/posts/:postId/caption
 * @access Private
 */
export const updatePostCaption = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req; // Current user (from auth middleware)
    const { caption } = req.body;

    // Validate input
    if (caption === undefined) {
      return res.status(400).json({ 
        message: 'Caption is required' 
      });
    }

    // Find post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        message: 'Post not found' 
      });
    }

    // Check if user owns the post
    if (post.user.toString() !== userId) {
      return res.status(403).json({ 
        message: 'You can only edit your own posts' 
      });
    }

    // Update caption
    post.caption = caption.trim();
    await post.save();

    res.status(200).json({
      message: 'Caption updated successfully',
      post: {
        id: post._id,
        caption: post.caption
      }
    });
  } catch (error) {
    console.error('Update caption error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
};

/**
 * Get a Single Post by ID
 * 
 * Retrieves detailed information about a specific post,
 * including user info, likes, and ownership status.
 * 
 * @route GET /api/posts/:postId
 * @access Private
 */
export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const currentUserId = req.userId; // Current logged-in user

    // Find post and populate user and likes
    const post = await Post.findById(postId)
      .populate('user', 'username')
      .populate('likes', 'username');

    if (!post) {
      return res.status(404).json({ 
        message: 'Post not found' 
      });
    }

    // Return formatted post data
    res.status(200).json({
      post: {
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
        isLiked: post.likes.some(like => like._id.toString() === currentUserId),
        isOwner: post.user._id.toString() === currentUserId,
        createdAt: post.createdAt
      }
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
};

/**
 * Delete a Post
 * 
 * Deletes a post and all associated comments.
 * Only post owner can delete.
 * 
 * @route DELETE /api/posts/:postId
 * @access Private
 */
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req; // Current user (from auth middleware)

    // Find post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        message: 'Post not found' 
      });
    }

    // Check if user owns the post
    if (post.user.toString() !== userId) {
      return res.status(403).json({ 
        message: 'You can only delete your own posts' 
      });
    }

    // Delete all comments associated with this post
    await Comment.deleteMany({ post: postId });

    // Delete the post
    await Post.findByIdAndDelete(postId);

    res.status(200).json({ 
      message: 'Post deleted successfully' 
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
};

/**
 * Get User's Posts
 * 
 * Retrieves all posts created by a specific user,
 * sorted by newest first.
 * 
 * @route GET /api/posts/user/:userId
 * @access Private
 */
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId; // Current logged-in user

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    // Get all posts by this user (newest first)
    const posts = await Post.find({ user: userId })
      .populate('user', 'username')
      .populate('likes', 'username')
      .sort({ createdAt: -1 });

    // Return formatted posts
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
        isLiked: post.likes.some(like => like._id.toString() === currentUserId),
        createdAt: post.createdAt
      }))
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
};
