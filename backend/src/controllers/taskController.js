import Task from '../models/Task.js';
import Project from '../models/Project.js';

// ── @desc    Get all tasks for a specific project ─────────────────────────────
// ── @route   GET /api/tasks/:projectId ───────────────────────────────────────
// ── @access  Private ─────────────────────────────────────────────────────────
const getTasks = async (req, res, next) => {
  try {
    // Step 1 — Verify the project exists and belongs to this user
    const project = await Project.findOne({
      _id: req.params.projectId,
      user: req.user._id,
    });

    if (!project) {
      res.status(404);
      return next(new Error('Project not found'));
    }

    // Step 2 — Fetch all tasks scoped to this project + user
    const tasks = await Task.find({
      project: req.params.projectId,
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

// ── @desc    Create a task inside a project ───────────────────────────────────
// ── @route   POST /api/tasks/:projectId ──────────────────────────────────────
// ── @access  Private ─────────────────────────────────────────────────────────
const createTask = async (req, res, next) => {
  try {
    const { title, status } = req.body;

    // Step 1 — Verify the project exists and belongs to this user
    const project = await Project.findOne({
      _id: req.params.projectId,
      user: req.user._id,
    });

    if (!project) {
      res.status(404);
      return next(new Error('Project not found'));
    }

    // Step 2 — Create the task. Mongoose enforces: title required, status enum
    const task = await Task.create({
      title,
      status,                        // defaults to 'Todo' if not provided
      project: req.params.projectId,
      user: req.user._id,
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// ── @desc    Update a task's title and/or status ─────────────────────────────
// ── @route   PUT /api/tasks/:id ──────────────────────────────────────────────
// ── @access  Private ─────────────────────────────────────────────────────────
const updateTask = async (req, res, next) => {
  try {
    const { title, status } = req.body;

    // Ownership check — only update if the task belongs to this user
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      res.status(404);
      return next(new Error('Task not found'));
    }

    // Only update fields that were actually sent
    if (title !== undefined) task.title = title;
    if (status !== undefined) task.status = status;
    // Mongoose validates status enum automatically on save — invalid value → 400

    await task.save();

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// ── @desc    Delete a task ────────────────────────────────────────────────────
// ── @route   DELETE /api/tasks/:id ───────────────────────────────────────────
// ── @access  Private ─────────────────────────────────────────────────────────
const deleteTask = async (req, res, next) => {
  try {
    // Ownership check
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      res.status(404);
      return next(new Error('Task not found'));
    }

    await task.deleteOne();

    res.status(200).json({ success: true, message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};

export { getTasks, createTask, updateTask, deleteTask };
