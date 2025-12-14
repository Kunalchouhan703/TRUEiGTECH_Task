import User from '../models/User.js';

export const followUser = async (req, res) => {
  try {
    const { userId } = req;
    const { targetUserId } = req.params;

    if (userId === targetUserId) {
      return res.status(400).json({ 
        message: 'You cannot follow yourself' 
      });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    const currentUser = await User.findById(userId);

    if (currentUser.following.includes(targetUserId)) {
      return res.status(400).json({ 
        message: 'You are already following this user' 
      });
    }

    currentUser.following.push(targetUserId);
    await currentUser.save();

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

export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req;
    const { targetUserId } = req.params;

    const currentUser = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    if (!currentUser.following.includes(targetUserId)) {
      return res.status(400).json({ 
        message: 'You are not following this user' 
      });
    }

    currentUser.following = currentUser.following.filter(
      id => id.toString() !== targetUserId
    );
    await currentUser.save();

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

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;

    const user = await User.findById(userId)
      .select('-password')
      .populate('followers', 'username')
      .populate('following', 'username');

    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    const isFollowing = user.followers.some(
      follower => follower._id.toString() === currentUserId
    );

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

export const updateProfile = async (req, res) => {
  try {
    const { userId } = req;
    const { username, bio } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    if (username && username !== user.username) {
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

    if (bio !== undefined) {
      user.bio = bio.trim();
    }

    if (req.file) {
      user.profilePhoto = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    await user.save();

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
