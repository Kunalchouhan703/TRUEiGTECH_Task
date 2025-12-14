import Story from '../models/Story.js';
import User from '../models/User.js';

export const createStory = async (req, res) => {
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

    const story = new Story({
      user: userId,
      imageUrl,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    await story.save();

    await story.populate('user', 'username profilePhoto');

    res.status(201).json({
      message: 'Story created successfully',
      story: {
        id: story._id,
        user: {
          id: story.user._id,
          username: story.user.username,
          profilePhoto: story.user.profilePhoto
        },
        imageUrl: story.imageUrl,
        createdAt: story.createdAt,
        expiresAt: story.expiresAt
      }
    });
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
};

export const getStories = async (req, res) => {
  try {
    const { userId } = req;

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    const followingIds = currentUser.following.map(id => id.toString());
    followingIds.push(userId);

    const stories = await Story.find({
      user: { $in: followingIds },
      expiresAt: { $gt: new Date() }
    })
      .populate('user', 'username profilePhoto')
      .sort({ createdAt: -1 });

    const storiesByUser = {};
    stories.forEach(story => {
      const userId = story.user._id.toString();
      if (!storiesByUser[userId]) {
        storiesByUser[userId] = {
          user: {
            id: story.user._id,
            username: story.user.username,
            profilePhoto: story.user.profilePhoto
          },
          stories: []
        };
      }
      storiesByUser[userId].stories.push({
        id: story._id,
        imageUrl: story.imageUrl,
        createdAt: story.createdAt
      });
    });

    res.status(200).json({
      stories: Object.values(storiesByUser)
    });
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
};

export const getUserStories = async (req, res) => {
  try {
    const { userId } = req.params;

    const stories = await Story.find({
      user: userId,
      expiresAt: { $gt: new Date() }
    })
      .populate('user', 'username profilePhoto')
      .sort({ createdAt: -1 });

    res.status(200).json({
      stories: stories.map(story => ({
        id: story._id,
        user: {
          id: story.user._id,
          username: story.user.username,
          profilePhoto: story.user.profilePhoto
        },
        imageUrl: story.imageUrl,
        createdAt: story.createdAt
      }))
    });
  } catch (error) {
    console.error('Get user stories error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
};

export const deleteStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { userId } = req;

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ 
        message: 'Story not found' 
      });
    }

    if (story.user.toString() !== userId) {
      return res.status(403).json({ 
        message: 'You can only delete your own stories' 
      });
    }

    await Story.findByIdAndDelete(storyId);

    res.status(200).json({ 
      message: 'Story deleted successfully' 
    });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
};

