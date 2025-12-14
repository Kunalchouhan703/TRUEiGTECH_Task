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
      .select('username email profilePhoto')
      .limit(20);

    const currentUser = await User.findById(userId).select('following');

    res.status(200).json({
      users: users.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email,
        profilePhoto: user.profilePhoto,
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

export const getSuggestions = async (req, res) => {
  try {
    const { userId } = req;

    const currentUser = await User.findById(userId).select('following');
    if (!currentUser) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    const followingIds = currentUser.following.map(id => id.toString());
    followingIds.push(userId);

    const suggestions = await User.find({
      _id: { $nin: followingIds }
    })
      .select('username email profilePhoto')
      .limit(10)
      .sort({ createdAt: -1 });

    res.status(200).json({
      suggestions: suggestions.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email,
        profilePhoto: user.profilePhoto,
        isFollowing: false
      }))
    });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
};
