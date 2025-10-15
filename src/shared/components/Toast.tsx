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
  // Map variants to appropriate aria attributes
  const getAriaLive = () => {
    if (variant === 'error') return 'assertive';
    return 'polite';
  };

  const getAriaLabel = () => {
    if (variant === 'success') return 'Notificación de éxito';
    if (variant === 'error') return 'Notificación de error';
    if (variant === 'warning') return 'Notificación de advertencia';
    return 'Notificación';
  };

  return (
    <div 
      className={`${styles['toast']} ${styles[`toast--${variant}`]}`} 
      role={variant === 'error' ? 'alert' : 'status'} 
      aria-live={getAriaLive()}
      aria-atomic="true"
      aria-label={getAriaLabel()}
    >
      <span className={styles['toast__message']} id={`toast-message-${id}`}>
        {message}
      </span>
      <button
        type="button"
        className={styles['toast__close']}
        aria-label={`Cerrar notificación: ${message}`}
        aria-describedby={`toast-message-${id}`}
        onClick={() => onClose(id)}
      >
        <span aria-hidden="true">×</span>
        <span className="visually-hidden">Cerrar</span>
      </button>
    </div>
  );
}


