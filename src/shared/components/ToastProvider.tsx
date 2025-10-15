import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Toast } from './Toast';
import styles from './Toast.module.scss';

/**
 * Interface representing a toast notification item.
 */
interface ToastItem { 
  id: string; 
  message: string; 
  variant: 'success' | 'error' | 'warning'; 
}

/**
 * Interface for the toast context value.
 */
interface ToastContextValue {
  /** Shows a new toast with the given message. */
  showToast: (message: string, variant?: 'success' | 'error' | 'warning', delay?: number) => void;
  /** Dismisses a toast by id. */
  dismissToast: (id: string) => void;
}

/**
 * Context for managing toast notifications.
 */
const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Toast provider component for global notification management.
 *
 * Provides a context-based API for displaying toast notifications throughout
 * the application. Manages toast state, auto-dismissal, and accessibility features.
 * Renders toasts in a fixed position with proper ARIA attributes.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} Provider component with toast management
 * 
 * @example
 * ```tsx
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 * ```
 */
export function ToastProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setItems(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, variant: 'success' | 'error' | 'warning' = 'success', delay: number = 0) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    
    if (delay > 0) {
      setTimeout(() => {
        setItems(prev => [...prev, { id, message, variant }]);
      }, delay);
    } else {
      setItems(prev => [...prev, { id, message, variant }]);
    }
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

/**
 * Hook to access toast notification functionality.
 * 
 * Provides methods to show and dismiss toast notifications.
 * Must be used within a ToastProvider context.
 * 
 * @returns {ToastContextValue} Toast management functions
 * @throws {Error} If used outside of ToastProvider context
 * 
 * @example
 * ```tsx
 * const { showToast } = useToast();
 * // Show immediately
 * showToast('Operation successful!', 'success');
 * 
 * // Show with delay (useful before navigation)
 * showToast('Redirecting...', 'success', 500);
 * ```
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}


