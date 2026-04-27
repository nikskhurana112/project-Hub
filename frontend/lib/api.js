/**
 * lib/api.js
 *
 * Central fetch() wrapper for all backend API calls.
 * - Reads base URL from NEXT_PUBLIC_API_URL env variable.
 * - getHeaders() automatically attaches the JWT from localStorage.
 * - Every exported function returns parsed JSON or throws an Error.
 *
 * Usage (from any component):
 *   import { getProjects, createProject } from '@/lib/api';
 *   const projects = await getProjects();
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/** Build headers, attaching JWT if present in localStorage */
function getHeaders() {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('token')
    : null;

  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

/** Parse response — throw a readable error on non-2xx */
async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }
  return data;
}

/* ─────────────────────────────────────────
   AUTH
───────────────────────────────────────── */

/** POST /users/register */
export async function register({ name, email, password }) {
  const res = await fetch(`${BASE_URL}/users/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(res);
}

/** POST /users/login → returns { token, user } */
export async function login({ email, password }) {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

/* ─────────────────────────────────────────
   PROJECTS
───────────────────────────────────────── */

/** GET /projects → returns array of projects */
export async function getProjects() {
  const res = await fetch(`${BASE_URL}/projects`, {
    headers: getHeaders(),
  });
  return handleResponse(res);
}

/** POST /projects */
export async function createProject({ title, description }) {
  const res = await fetch(`${BASE_URL}/projects`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ title, description }),
  });
  return handleResponse(res);
}

/** DELETE /projects/:id */
export async function deleteProject(id) {
  const res = await fetch(`${BASE_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse(res);
}

/* ─────────────────────────────────────────
   TASKS
───────────────────────────────────────── */

/** GET /tasks/:projectId */
export async function getTasksByProject(projectId) {
  const res = await fetch(`${BASE_URL}/tasks/${projectId}`, {
    headers: getHeaders(),
  });
  return handleResponse(res);
}

/** POST /tasks/:projectId */
export async function createTask(projectId, { title }) {
  const res = await fetch(`${BASE_URL}/tasks/${projectId}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ title }),
  });
  return handleResponse(res);
}

/** PUT /tasks/:taskId — update status */
export async function updateTaskStatus(taskId, status) {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
}

/** DELETE /tasks/:taskId */
export async function deleteTask(taskId) {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse(res);
}
