import Highlight from '../models/Highlight.js';
import Story from '../models/Story.js';
import User from '../models/User.js';

export const createHighlight = async (req, res) => {
  try {
    const { userId } = req;
    const { title, storyIds } = req.body;

    if (!title || !storyIds || !Array.isArray(storyIds) || storyIds.length === 0) {
      return res.status(400).json({ 
        message: 'Title and story IDs are required' 
      });
    }

    const stories = await Story.find({
      _id: { $in: storyIds },
      user: userId
    });

    if (stories.length === 0) {
      return res.status(400).json({ 
        message: 'No valid stories found' 
      });
    }

    const coverImage = stories[0].imageUrl;

    const highlight = new Highlight({
      user: userId,
      title,
      stories: storyIds,
      coverImage
    });

    await highlight.save();

    res.status(201).json({
      message: 'Highlight created successfully',
      highlight: {
        id: highlight._id,
        title: highlight.title,
        coverImage: highlight.coverImage,
        storiesCount: highlight.stories.length
      }
    });
  } catch (error) {
    console.error('Create highlight error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
};

export const getUserHighlights = async (req, res) => {
  try {
    const { userId } = req.params;

    const highlights = await Highlight.find({ user: userId })
      .populate('stories', 'imageUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({
      highlights: highlights.map(highlight => ({
        id: highlight._id,
        title: highlight.title,
        coverImage: highlight.coverImage || (highlight.stories[0]?.imageUrl || null),
        storiesCount: highlight.stories.length
      }))
    });
  } catch (error) {
    console.error('Get highlights error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
};

export const getHighlightStories = async (req, res) => {
  try {
    const { highlightId } = req.params;

    const highlight = await Highlight.findById(highlightId)
      .populate('stories', 'imageUrl createdAt')
      .populate('user', 'username profilePhoto');

    if (!highlight) {
      return res.status(404).json({ 
        message: 'Highlight not found' 
      });
    }

    res.status(200).json({
      highlight: {
        id: highlight._id,
        title: highlight.title,
        user: {
          id: highlight.user._id,
          username: highlight.user.username,
          profilePhoto: highlight.user.profilePhoto
        },
        stories: highlight.stories.map(story => ({
          id: story._id,
          imageUrl: story.imageUrl,
          createdAt: story.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Get highlight stories error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
};

export const deleteHighlight = async (req, res) => {
  try {
    const { highlightId } = req.params;
    const { userId } = req;

    const highlight = await Highlight.findById(highlightId);
    if (!highlight) {
      return res.status(404).json({ 
        message: 'Highlight not found' 
      });
    }

    if (highlight.user.toString() !== userId) {
      return res.status(403).json({ 
        message: 'You can only delete your own highlights' 
      });
    }

    await Highlight.findByIdAndDelete(highlightId);

    res.status(200).json({ 
      message: 'Highlight deleted successfully' 
    });
  } catch (error) {
    console.error('Delete highlight error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
};

