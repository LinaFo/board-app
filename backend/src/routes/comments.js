import express from 'express';
import { auth } from '../middleware/auth.js';
import { getComments, createComment, deleteComment, likeComment } from '../controllers/commentController.js';

const router = express.Router();

router.get('/:adId', getComments);
router.post('/', auth, createComment);
router.delete('/:id', auth, deleteComment);
router.post('/like', auth, likeComment);

export default router;