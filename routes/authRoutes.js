import express from 'express';
import { getTempToken } from '../controllers/authController.js';

const router = express.Router();

// POST route to generate a temporary token based on nickname and password
router.post('/temp-token', getTempToken);

export default router;
