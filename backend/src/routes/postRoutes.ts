import { Router } from 'express';
import { getAllPosts, createPost } from '../controllers/postController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

// Routes for /api/posts
router.get('/', getAllPosts);
router.post('/', requireAuth, createPost);

export default router;
