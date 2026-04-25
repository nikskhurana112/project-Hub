import Project from '../models/Project.js';
import Task from '../models/Task.js';

// ── @desc    Get all projects for the logged-in user ─────────────────────────
// ── @route   GET /api/projects ───────────────────────────────────────────────
// ── @access  Private ─────────────────────────────────────────────────────────
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

// ── @desc    Create a new project ────────────────────────────────────────────
// ── @route   POST /api/projects ──────────────────────────────────────────────
// ── @access  Private ─────────────────────────────────────────────────────────
const createProject = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    // Attach the logged-in user's ID — enforces data isolation
    const project = await Project.create({
      title,
      description,
      user: req.user._id,
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// ── @desc    Get a single project by ID ──────────────────────────────────────
// ── @route   GET /api/projects/:id ───────────────────────────────────────────
// ── @access  Private ─────────────────────────────────────────────────────────
const getProjectById = async (req, res, next) => {
  try {
    // Ownership check built into the query — can only find YOUR projects
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!project) {
      res.status(404);
      return next(new Error('Project not found'));
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// ── @desc    Update a project ─────────────────────────────────────────────────
// ── @route   PUT /api/projects/:id ───────────────────────────────────────────
// ── @access  Private ─────────────────────────────────────────────────────────
const updateProject = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    // Ownership check — only update if the project belongs to this user
    let project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!project) {
      res.status(404);
      return next(new Error('Project not found'));
    }

    // Only update fields that were actually sent in the request body
    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;

    await project.save();

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// ── @desc    Delete a project and all its tasks ───────────────────────────────
// ── @route   DELETE /api/projects/:id ────────────────────────────────────────
// ── @access  Private ─────────────────────────────────────────────────────────
const deleteProject = async (req, res, next) => {
  try {
    // Ownership check
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!project) {
      res.status(404);
      return next(new Error('Project not found'));
    }

    // Cascade delete — MongoDB has no FK constraints, so we do this manually
    await Task.deleteMany({ project: req.params.id });
    await project.deleteOne();

    res.status(200).json({ success: true, message: 'Project and all its tasks deleted' });
  } catch (error) {
    next(error);
  }
};

export { getProjects, createProject, getProjectById, updateProject, deleteProject };
