'use client';

import styles from './Button.module.css';

/**
 * Button component
 * Props:
 *   variant  — 'primary' | 'secondary' | 'danger'  (default: 'primary')
 *   type     — 'button' | 'submit' | 'reset'        (default: 'button')
 *   isLoading — shows spinner, disables button
 *   disabled
 *   onClick
 *   children
 */
export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  isLoading = false,
  disabled = false,
  onClick,
  fullWidth = false,
}) {
  return (
    <button
      type={type}
      className={[
        styles.btn,
        styles[variant],
        fullWidth ? styles.fullWidth : '',
      ].join(' ')}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : null}
      {children}
    </button>
  );
}
