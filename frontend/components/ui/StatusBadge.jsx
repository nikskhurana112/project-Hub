import styles from './StatusBadge.module.css';

/**
 * StatusBadge — pill-shaped task status indicator
 * Props:
 *   status — 'Todo' | 'In Progress' | 'Done'
 */
export default function StatusBadge({ status }) {
  const variantMap = {
    'Todo':        styles.todo,
    'In Progress': styles.inProgress,
    'Done':        styles.done,
  };

  return (
    <span className={[styles.badge, variantMap[status] || styles.todo].join(' ')}>
      {status}
    </span>
  );
}
