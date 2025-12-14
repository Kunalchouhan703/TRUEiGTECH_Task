import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import {
  createStory,
  getStories,
  getUserStories,
  deleteStory
} from '../controllers/story.controller.js';

const router = express.Router();

router.use(authenticate);

router.post('/', upload.single('image'), createStory);

router.get('/', getStories);

router.get('/user/:userId', getUserStories);

router.delete('/:storyId', deleteStory);

export default router;

