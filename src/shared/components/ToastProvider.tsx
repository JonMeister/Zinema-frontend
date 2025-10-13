/**
 * Toast context and provider exposing a simple `showToast` API.
 *
 * Usage:
 *  - Wrap your app with <ToastProvider />
 *  - Call `const { showToast } = useToast()` to display messages
 */
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Toast } from './Toast';
import styles from './Toast.module.scss';

interface ToastItem { id: string; message: string; variant: 'success' | 'error' | 'warning'; }

interface ToastContextValue {
  /** Shows a new toast with the given message. */
  showToast: (message: string, variant?: 'success' | 'error' | 'warning') => void;
  /** Dismisses a toast by id. */
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setItems(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, variant: 'success' | 'error' | 'warning' = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setItems(prev => [...prev, { id, message, variant }]);
  }, []);

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {items.length > 0 && (
        <div className={styles['toasts']} aria-live="polite" aria-atomic="true">
          {items.map(t => (
            <Toast key={t.id} id={t.id} message={t.message} variant={t.variant} onClose={dismissToast} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

/** Access the toast API from React components. */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}


