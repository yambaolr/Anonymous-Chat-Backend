import express from 'express';
import { getRooms, createRoom, deleteRoom } from '../controllers/roomController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all rooms
router.get('/', getRooms);

// POST create a new room, only for admin users
router.post('/', protect, createRoom);

// DELETE a room by id, only for admin users
router.delete('/:roomId', protect, deleteRoom);

export default router;