'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getProjects, createProject, deleteProject } from '@/lib/api';
import Sidebar from '@/components/layout/Sidebar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import styles from './projects.module.css';

export default function ProjectsPage() {
  const { token, isReady } = useAuth();
  const router = useRouter();

  const [projects, setProjects]       = useState([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [fetchError, setFetchError]   = useState('');

  // New project modal
  const [modalOpen, setModalOpen]     = useState(false);
  const [title, setTitle]             = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError]   = useState('');
  const [creating, setCreating]       = useState(false);
  const [createError, setCreateError] = useState('');

  // Deleting state per project
  const [deletingId, setDeletingId]   = useState(null);

  /* ── Auth guard ── */
  useEffect(() => {
    if (isReady && !token) router.replace('/login');
  }, [token, isReady, router]);

  /* ── Fetch projects ── */
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setFetchError('');
    try {
      const res = await getProjects();
      setProjects(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setFetchError(err.message || 'Failed to load projects.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) fetchProjects();
  }, [token, fetchProjects]);

  /* ── Create project ── */
  async function handleCreate(e) {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError('Project title is required.');
      return;
    }
    setTitleError('');
    setCreateError('');
    setCreating(true);
    try {
      await createProject({ title: title.trim(), description: description.trim() });
      setTitle('');
      setDescription('');
      setModalOpen(false);
      fetchProjects();
    } catch (err) {
      setCreateError(err.message || 'Failed to create project.');
    } finally {
      setCreating(false);
    }
  }

  /* ── Delete project ── */
  async function handleDelete(id) {
    if (!confirm('Delete this project and all its tasks?')) return;
    setDeletingId(id);
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete project.');
    } finally {
      setDeletingId(null);
    }
  }

  if (!isReady || !token) return null;

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>Projects</h1>
            <p className={styles.pageSubtitle}>
              {projects.length} project{projects.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button onClick={() => setModalOpen(true)}>+ New Project</Button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className={styles.skeletonGrid}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        ) : fetchError ? (
          <div className={styles.errorState}>
            <p>{fetchError}</p>
            <Button variant="secondary" onClick={fetchProjects}>Try Again</Button>
          </div>
        ) : projects.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📁</div>
            <h3>No projects yet</h3>
            <p>Create your first project to get started.</p>
            <Button onClick={() => setModalOpen(true)}>+ New Project</Button>
          </div>
        ) : (
          <div className={styles.grid}>
            {projects.map((project) => (
              <div key={project._id} className={styles.card}>
                <div
                  className={styles.cardBody}
                  onClick={() => router.push(`/projects/${project._id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && router.push(`/projects/${project._id}`)}
                >
                  <div className={styles.cardIcon}>
                    {project.title[0]?.toUpperCase()}
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{project.title}</h3>
                    {project.description && (
                      <p className={styles.cardDesc}>{project.description}</p>
                    )}
                    <p className={styles.cardMeta}>
                      Created {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <svg className={styles.chevron} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className={styles.cardFooter}>
                  <Button
                    variant="danger"
                    isLoading={deletingId === project._id}
                    onClick={() => handleDelete(project._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* New Project Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setTitle(''); setDescription(''); setTitleError(''); setCreateError(''); }}
        title="New Project"
      >
        <form onSubmit={handleCreate} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {createError && (
              <div className={styles.modalError}>{createError}</div>
            )}
            <Input
              id="project-title"
              label="Project Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. E-commerce Redesign"
              error={titleError}
              required
            />
            <Input
              id="project-desc"
              label="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this project about?"
            />
            <Button type="submit" isLoading={creating} fullWidth>
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
