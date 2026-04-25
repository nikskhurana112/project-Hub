import express from 'express';

const router = express.Router();

// ---------------------------------------------------------------------------
// All handlers will be imported from src/controllers/userController.js
// ---------------------------------------------------------------------------

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public

// @route   POST /api/users/login
// @desc    Authenticate user and return JWT
// @access  Public

// @route   GET  /api/users/dashboard
// @desc    Get the currently authenticated user's profile
// @access  Private (requires JWT)

export default router;
