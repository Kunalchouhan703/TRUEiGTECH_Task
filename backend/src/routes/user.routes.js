import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { 
  followUser, 
  unfollowUser, 
  getUserProfile, 
  updateProfile 
} from '../controllers/user.controller.js';

const router = express.Router();

router.use(authenticate);

router.put('/profile', upload.single('profilePhoto'), updateProfile);
router.get('/:userId', getUserProfile);
router.post('/:targetUserId/follow', followUser);
router.post('/:targetUserId/unfollow', unfollowUser);

export default router;
