import express from 'express';
import {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import protect from '../middleware/protect.js';

const router = express.Router();

// Apply protect middleware to ALL routes in this file
router.use(protect);

// @route GET /api/projects  |  POST /api/projects
router.route('/').get(getProjects).post(createProject);

// @route GET /api/projects/:id  |  PUT /api/projects/:id  |  DELETE /api/projects/:id
router.route('/:id').get(getProjectById).put(updateProject).delete(deleteProject);

export default router;
