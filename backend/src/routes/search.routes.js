import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { searchUsers, getSuggestions } from '../controllers/search.controller.js';

const router = express.Router();

router.use(authenticate);

router.get('/users', searchUsers);
router.get('/suggestions', getSuggestions);

export default router;
