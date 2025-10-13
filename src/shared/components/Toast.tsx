/**
 * Toast notification component.
 *
 * Renders a message with a close button. The component itself is presentational
 * and stateless; closing is delegated to the parent via `onClose`.
 */
import React from 'react';
import styles from './Toast.module.scss';

export interface ToastProps {
  /** Unique id used by lists and transitions. */
  id: string;
  /** Text content to display inside the toast. */
  message: string;
  /** Visual style of the toast. */
  variant?: 'success' | 'error' | 'warning';
  /** Called when the user clicks the close button. */
  onClose: (id: string) => void;
}

export function Toast({ id, message, variant = 'success', onClose }: ToastProps): JSX.Element {
  return (
    <div className={`${styles['toast']} ${styles[`toast--${variant}`]}`} role="status" aria-live="polite">
      <span className={styles['toast__message']}>{message}</span>
      <button
        type="button"
        className={styles['toast__close']}
        aria-label="Close notification"
        onClick={() => onClose(id)}
      >
        ×
      </button>
    </div>
  );
}


