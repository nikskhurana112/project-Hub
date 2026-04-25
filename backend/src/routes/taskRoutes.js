import express from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import protect from '../middleware/protect.js';

const router = express.Router();

// Apply protect middleware to ALL routes in this file
router.use(protect);

// @route GET /api/tasks/:projectId  |  POST /api/tasks/:projectId
router.route('/:projectId').get(getTasks).post(createTask);

// @route PUT /api/tasks/:id  |  DELETE /api/tasks/:id
router.route('/:id').put(updateTask).delete(deleteTask);

export default router;
