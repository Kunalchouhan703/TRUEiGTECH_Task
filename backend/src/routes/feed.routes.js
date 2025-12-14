import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { getFeed } from '../controllers/feed.controller.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getFeed);

export default router;
