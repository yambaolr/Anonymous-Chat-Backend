import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getMessagesByRoom, sendMessage } from '../controllers/chatController.js';

const router = express.Router();

// GET messages for a specific room
router.get('/:roomId/messages', protect, getMessagesByRoom);

// POST a new message to a specific room
router.post('/:roomId/messages', protect, sendMessage);

export default router;
