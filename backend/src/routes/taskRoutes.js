import express from 'express';

const router = express.Router();

// ---------------------------------------------------------------------------
// All handlers will be imported from src/controllers/taskController.js
// All routes are Private (require valid JWT via protect middleware)
// Status values are strictly: "Todo" | "In Progress" | "Done"
// ---------------------------------------------------------------------------

// @route   GET    /api/tasks/:projectId
// @desc    Get all tasks belonging to a specific project
// @access  Private

// @route   POST   /api/tasks/:projectId
// @desc    Add a new task to a project
// @access  Private

// @route   PUT    /api/tasks/:id
// @desc    Update a task's details or status
// @access  Private

// @route   DELETE /api/tasks/:id
// @desc    Delete a task by ID
// @access  Private

export default router;
