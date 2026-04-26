import express from 'express';
import { register, login, getMe, logout } from '../controllers/userController.js';
import protect from '../middleware/protect.js';

const router = express.Router();

// @route   POST /api/users/register  — Public
router.post('/register', register);

// @route   POST /api/users/login     — Public
router.post('/login', login);

// @route   GET  /api/users/dashboard — Private
router.get('/dashboard', protect, getMe);

// @route   POST /api/users/logout    — Private (token required to confirm identity)
router.post('/logout', protect, logout);

export default router;
