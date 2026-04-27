'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { login as apiLogin, register as apiRegister } from '@/lib/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import styles from './login.module.css';

/**
 * Login / Register page
 *
 * Single page with a toggle between two modes:
 *   - 'login'    → Email + Password
 *   - 'register' → Name + Email + Password
 *
 * On success → saves token via AuthContext.login() → push to /projects
 */
export default function LoginPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  /* ── Validation ── */
  function validate() {
    const errs = {};
    if (mode === 'register' && !name.trim()) {
      errs.name = 'Name is required.';
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Enter a valid email address.';
    }
    if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    return errs;
  }

  /* ── Submit ── */
  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsLoading(true);

    try {
      let data;
      if (mode === 'login') {
        data = await apiLogin({ email, password });
      } else {
        data = await apiRegister({ name, email, password });
      }

      // Backend returns { success: true, token, data: user }
      // Extract the real user data from the response to display in the sidebar
      login(data.token, data.data);
      router.push('/projects');
    } catch (err) {
      setApiError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  /* ── Toggle mode ── */
  function toggleMode() {
    setMode((m) => (m === 'login' ? 'register' : 'login'));
    setErrors({});
    setApiError('');
  }

  return (
    <div className={styles.page}>
      {/* Left — Branding panel */}
      <div className={styles.brandPanel}>
        <div className={styles.brandContent}>
          <div className={styles.brandLogo}>PH</div>
          <h1 className={styles.brandTitle}>Project Hub</h1>
          <p className={styles.brandSubtitle}>
            Organize your work. Track every task. Ship faster.
          </p>
          <ul className={styles.featureList}>
            <li>✦ Full project CRUD management</li>
            <li>✦ Task status tracking (Todo → Done)</li>
            <li>✦ Secure JWT authentication</li>
          </ul>
        </div>
      </div>

      {/* Right — Form panel */}
      <div className={styles.formPanel}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className={styles.formSubtitle}>
              {mode === 'login'
                ? 'Sign in to your workspace'
                : 'Get started for free'}
            </p>
          </div>

          {/* API error banner */}
          {apiError && (
            <div className={styles.errorBanner} role="alert">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className={styles.form}>
            {/* Name — only shown in register mode */}
            {mode === 'register' && (
              <Input
                id="name"
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                error={errors.name}
                required
              />
            )}

            <Input
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              error={errors.email}
              required
            />

            <Input
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              error={errors.password}
              required
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              fullWidth
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {/* Toggle link */}
          <p className={styles.toggleText}>
            {mode === 'login'
              ? "Don't have an account? "
              : 'Already have an account? '}
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={toggleMode}
            >
              {mode === 'login' ? 'Register' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
