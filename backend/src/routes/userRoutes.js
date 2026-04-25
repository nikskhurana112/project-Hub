import express from 'express';
import { register, login, getMe } from '../controllers/userController.js';
import protect from '../middleware/protect.js';

const router = express.Router();

// @route   POST /api/users/register  — Public
router.post('/register', register);

// @route   POST /api/users/login     — Public
router.post('/login', login);

// @route   GET  /api/users/dashboard — Private (protect runs first, then getMe)
router.get('/dashboard', protect, getMe);

export default router;
