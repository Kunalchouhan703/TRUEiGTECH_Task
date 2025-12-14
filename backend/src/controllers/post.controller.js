import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';

export const createPost = async (req, res) => {
  try {
    const { userId } = req;
    
    let imageUrl = req.body.imageUrl;
    
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    if (!imageUrl) {
      return res.status(400).json({ 
        message: 'Image URL or file is required' 
      });
    }

    const caption = req.body.caption || '';

    const post = new Post({
      user: userId,
      imageUrl,
      caption: caption,
      likes: []
    });

    await post.save();

    await post.populate('user', 'username');

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

export const likePost = async (req, res) => {
  try {
    const { userId } = req;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        message: 'Post not found' 
      });
    }

    if (post.likes.includes(userId)) {
      return res.status(400).json({ 
        message: 'Post already liked' 
      });
    }

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

export const unlikePost = async (req, res) => {
  try {
    const { userId } = req;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        message: 'Post not found' 
      });
    }

    if (!post.likes.includes(userId)) {
      return res.status(400).json({ 
        message: 'Post not liked yet' 
      });
    }

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

export const addComment = async (req, res) => {
  try {
    const { userId } = req;
    const { postId } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ 
        message: 'Comment text is required' 
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        message: 'Post not found' 
      });
    }

    const comment = new Comment({
      user: userId,
      post: postId,
      text: text.trim()
    });

    await comment.save();

    await comment.populate('user', 'username');

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

export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const currentUserId = req.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        message: 'Post not found' 
      });
    }

    const comments = await Comment.find({ post: postId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

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

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req;

    const comment = await Comment.findById(commentId).populate('post', 'user');
    
    if (!comment) {
      return res.status(404).json({ 
        message: 'Comment not found' 
      });
    }

    const isCommentOwner = comment.user.toString() === userId;
    const isPostOwner = comment.post.user.toString() === userId;

    if (!isCommentOwner && !isPostOwner) {
      return res.status(403).json({ 
        message: 'You can only delete your own comments or comments on your posts' 
      });
    }

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

export const updatePostCaption = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req;
    const { caption } = req.body;

    if (caption === undefined) {
      return res.status(400).json({ 
        message: 'Caption is required' 
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        message: 'Post not found' 
      });
    }

    if (post.user.toString() !== userId) {
      return res.status(403).json({ 
        message: 'You can only edit your own posts' 
      });
    }

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

export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const currentUserId = req.userId;

    const post = await Post.findById(postId)
      .populate('user', 'username')
      .populate('likes', 'username');

    if (!post) {
      return res.status(404).json({ 
        message: 'Post not found' 
      });
    }

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

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        message: 'Post not found' 
      });
    }

    if (post.user.toString() !== userId) {
      return res.status(403).json({ 
        message: 'You can only delete your own posts' 
      });
    }

    await Comment.deleteMany({ post: postId });

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

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    const posts = await Post.find({ user: userId })
      .populate('user', 'username')
      .populate('likes', 'username')
      .sort({ createdAt: -1 });

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
