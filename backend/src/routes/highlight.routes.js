import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  createHighlight,
  getUserHighlights,
  getHighlightStories,
  deleteHighlight
} from '../controllers/highlight.controller.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createHighlight);

router.get('/user/:userId', getUserHighlights);

router.get('/:highlightId', getHighlightStories);

router.delete('/:highlightId', deleteHighlight);

export default router;

