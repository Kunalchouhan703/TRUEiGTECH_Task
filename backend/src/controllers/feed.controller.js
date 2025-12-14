import Post from '../models/Post.js';
import User from '../models/User.js';

export const getFeed = async (req, res) => {
  try {
    const { userId } = req;

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    const posts = await Post.find({
      user: { $in: currentUser.following }
    })
      .populate('user', 'username')
      .populate('likes', 'username')
      .sort({ createdAt: -1 })
      .limit(50);

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
