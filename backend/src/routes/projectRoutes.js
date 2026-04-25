import express from 'express';

const router = express.Router();

// ---------------------------------------------------------------------------
// All handlers will be imported from src/controllers/projectController.js
// All routes are Private (require valid JWT via protect middleware)
// ---------------------------------------------------------------------------

// @route   GET    /api/projects
// @desc    Get all projects belonging to the authenticated user
// @access  Private

// @route   POST   /api/projects
// @desc    Create a new project
// @access  Private

// @route   GET    /api/projects/:id
// @desc    Get a single project by ID
// @access  Private

// @route   PUT    /api/projects/:id
// @desc    Update a project by ID
// @access  Private

// @route   DELETE /api/projects/:id
// @desc    Delete a project by ID
// @access  Private

export default router;
