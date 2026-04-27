'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getTasksByProject, createTask, updateTaskStatus, deleteTask } from '@/lib/api';
import Sidebar from '@/components/layout/Sidebar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import StatusBadge from '@/components/ui/StatusBadge';
import styles from './tasks.module.css';

const STATUS_OPTIONS = ['Todo', 'In Progress', 'Done'];

export default function TasksPage() {
  const { token, isReady } = useAuth();
  const router = useRouter();
  const { id: projectId } = useParams();

  const [tasks, setTasks]           = useState([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [fetchError, setFetchError] = useState('');

  // New task modal
  const [modalOpen, setModalOpen]     = useState(false);
  const [taskTitle, setTaskTitle]     = useState('');
  const [taskTitleErr, setTaskTitleErr] = useState('');
  const [creating, setCreating]       = useState(false);
  const [createError, setCreateError] = useState('');

  // Per-task loading states
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  /* ── Auth guard ── */
  useEffect(() => {
    if (isReady && !token) router.replace('/login');
  }, [token, isReady, router]);

  /* ── Fetch tasks ── */
  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    setFetchError('');
    try {
      const res = await getTasksByProject(projectId);
      setTasks(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setFetchError(err.message || 'Failed to load tasks.');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (token && projectId) fetchTasks();
  }, [token, projectId, fetchTasks]);

  /* ── Create task ── */
  async function handleCreate(e) {
    e.preventDefault();
    if (!taskTitle.trim()) {
      setTaskTitleErr('Task title is required.');
      return;
    }
    setTaskTitleErr('');
    setCreateError('');
    setCreating(true);
    try {
      await createTask(projectId, { title: taskTitle.trim() });
      setTaskTitle('');
      setModalOpen(false);
      fetchTasks();
    } catch (err) {
      setCreateError(err.message || 'Failed to create task.');
    } finally {
      setCreating(false);
    }
  }

  /* ── Update status ── */
  async function handleStatusChange(taskId, newStatus) {
    setUpdatingId(taskId);
    try {
      await updateTaskStatus(taskId, newStatus);
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  }

  /* ── Delete task ── */
  async function handleDelete(taskId) {
    if (!confirm('Delete this task?')) return;
    setDeletingId(taskId);
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      alert(err.message || 'Failed to delete task.');
    } finally {
      setDeletingId(null);
    }
  }

  if (!isReady || !token) return null;

  /* ── Task counts by status ── */
  const counts = {
    'Todo':        tasks.filter((t) => t.status === 'Todo').length,
    'In Progress': tasks.filter((t) => t.status === 'In Progress').length,
    'Done':        tasks.filter((t) => t.status === 'Done').length,
  };

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <button className={styles.backBtn} onClick={() => router.push('/projects')}>
              ← Back to Projects
            </button>
            <h1 className={styles.pageTitle}>Tasks</h1>
            <div className={styles.statusSummary}>
              {Object.entries(counts).map(([status, count]) => (
                <span key={status} className={styles.statusCount}>
                  <StatusBadge status={status} /> {count}
                </span>
              ))}
            </div>
          </div>
          <Button onClick={() => setModalOpen(true)}>+ Add Task</Button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className={styles.skeletonList}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        ) : fetchError ? (
          <div className={styles.errorState}>
            <p>{fetchError}</p>
            <Button variant="secondary" onClick={fetchTasks}>Try Again</Button>
          </div>
        ) : tasks.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>✅</div>
            <h3>No tasks yet</h3>
            <p>Add your first task to start tracking work.</p>
            <Button onClick={() => setModalOpen(true)}>+ Add Task</Button>
          </div>
        ) : (
          <div className={styles.taskList}>
            {tasks.map((task) => (
              <div key={task._id} className={styles.taskRow}>
                <div className={styles.taskInfo}>
                  <StatusBadge status={task.status} />
                  <span className={[
                    styles.taskTitle,
                    task.status === 'Done' ? styles.taskDone : '',
                  ].join(' ')}>
                    {task.title}
                  </span>
                </div>

                <div className={styles.taskActions}>
                  {/* Status dropdown */}
                  <select
                    className={styles.statusSelect}
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    disabled={updatingId === task._id}
                    aria-label={`Change status of ${task.title}`}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  {/* Delete */}
                  <Button
                    variant="danger"
                    isLoading={deletingId === task._id}
                    onClick={() => handleDelete(task._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* New Task Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setTaskTitle(''); setTaskTitleErr(''); setCreateError(''); }}
        title="Add Task"
      >
        <form onSubmit={handleCreate} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {createError && (
              <div className={styles.modalError}>{createError}</div>
            )}
            <Input
              id="task-title"
              label="Task Title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Design homepage wireframe"
              error={taskTitleErr}
              required
            />
            <Button type="submit" isLoading={creating} fullWidth>
              Add Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
