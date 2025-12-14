import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import {
  createPost,
  likePost,
  unlikePost,
  addComment,
  getComments,
  deleteComment,
  getUserPosts,
  getPostById,
  deletePost,
  updatePostCaption
} from '../controllers/post.controller.js';

const router = express.Router();

router.use(authenticate);

router.post('/', upload.single('image'), createPost);
router.get('/user/:userId', getUserPosts);
router.delete('/comments/:commentId', deleteComment);
router.get('/:postId/comments', getComments);
router.put('/:postId/caption', updatePostCaption);
router.post('/:postId/like', likePost);
router.post('/:postId/unlike', unlikePost);
router.post('/:postId/comment', addComment);
router.get('/:postId', getPostById);
router.delete('/:postId', deletePost);

export default router;
