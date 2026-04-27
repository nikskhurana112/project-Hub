'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './Sidebar.module.css';

/**
 * Sidebar — dark left-hand nav panel (matches Stitch design)
 * Shows: App logo, Projects nav link, Logout button
 */
export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      {/* Logo / Brand */}
      <div className={styles.brand}>
        <div className={styles.logoIcon}>PH</div>
        <span className={styles.logoText}>Project Hub</span>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <Link
          href="/projects"
          className={[
            styles.navLink,
            pathname.startsWith('/projects') ? styles.active : '',
          ].join(' ')}
        >
          <svg className={styles.navIcon} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M2 4a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V4zM2 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H3a1 1 0 01-1-1v-6zM13 9a1 1 0 00-1 1v6a1 1 0 001 1h4a1 1 0 001-1v-6a1 1 0 00-1-1h-4z" />
          </svg>
          Projects
        </Link>
      </nav>

      {/* User + Logout */}
      <div className={styles.footer}>
        {user && (
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <span className={styles.userName}>{user.name || user.email}</span>
          </div>
        )}
        <button className={styles.logoutBtn} onClick={logout}>
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
            <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
