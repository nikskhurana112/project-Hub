import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    status: {
      type: String,
      required: [true, 'Task status is required'],
      enum: {
        values: ['Todo', 'In Progress', 'Done'],
        message: 'Status must be one of: Todo, In Progress, Done',
      },
      default: 'Todo',
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);
export default Task;
