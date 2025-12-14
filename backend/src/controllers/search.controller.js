import User from '../models/User.js';

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const { userId } = req;

    if (!query || query.trim() === '') {
      return res.status(200).json({ 
        users: [] 
      });
    }

    const users = await User.find({
      username: { $regex: query, $options: 'i' },
      _id: { $ne: userId }
    })
      .select('username email')
      .limit(20);

    const currentUser = await User.findById(userId).select('following');

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
