/**
 * Password reset page component.
 *
 * Accessed via secure email link with reset token. Allows users to set a new password
 * after validating the token from URL parameters. Includes password confirmation,
 * client-side validation, and redirects to login upon successful reset.
 * 
 * @component
 * @returns {JSX.Element} The password reset form with token validation and submission handling
 * 
 * @example
 * ```tsx
 * // Renders password reset form with token from URL
 * <PasswordResetPage />
 * ```
 */
import React, { useState, useEffect } from 'react';
import { Footer } from '@/modules/shared/components/Footer';
import styles from './LoginPage.module.scss';
import { apiFetch } from '@/lib/api/client';
import { useToast } from '@/shared/components/ToastProvider';

export function PasswordResetPage(): JSX.Element {
  /** Local form state for reset fields. */
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  /** Prevents duplicate submissions while a request is in-flight. */
  const [submitting, setSubmitting] = useState(false);
  /** Stores the last submission error message, if any. */
  const [error, setError] = useState<string | null>(null);
  /** Stores the reset token from URL params. */
  const [resetToken, setResetToken] = useState<string | null>(null);
  /** Indicates if token validation is in progress. */
  const [validatingToken, setValidatingToken] = useState(true);
  /** Toast API for user feedback. */
  const { showToast } = useToast();

  // Set page title for screen readers
  React.useEffect(() => {
    document.title = 'Restablecer Contraseña - Zinema';
  }, []);

  /**
   * Extract reset token from URL query parameters on component mount.
   */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (!token) {
      setError('Token de recuperación no válido o faltante');
      showToast('Enlace de recuperación inválido', 'error', 500);
      setTimeout(() => {
        window.location.href = '/login';
      }, 2500);
    } else {
      setResetToken(token);
    }
    
    setValidatingToken(false);
  }, [showToast]);

  /**
   * Updates the corresponding field in {@link formData} when an input changes.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handles form submission: validates and sends reset request.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !resetToken) return;
    setSubmitting(true);
    setError(null);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setSubmitting(false);
      showToast('Las contraseñas no coinciden', 'error');
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      setSubmitting(false);
      showToast('La contraseña debe tener al menos 8 caracteres', 'error');
      return;
    }

    try {
      const response = await apiFetch('/api/users/reset-password', {
        method: 'POST',
        json: {
          token: resetToken,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        },
      });

      if (response.ok) {
        // Show success message and redirect to login
        showToast('Contraseña actualizada con éxito', 'success', 500);
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        // Handle API error
        const errorMessage = response.error?.message || 'Error al actualizar la contraseña';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
    } catch (err) {
      // Handle network or unexpected errors
      const errorMessage = 'Error de conexión. Inténtalo de nuevo.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading state while validating token
  if (validatingToken) {
    return (
      <div className={styles['page']}>
        <main className={styles['main']} role="main" aria-busy="true" aria-live="polite">
          <div className={styles['container']}>
            <div className={styles['header']} role="status">
              <h1 className={styles['title']}>Validando enlace...</h1>
              <p className={styles['subtitle']}>
                Por favor espera mientras validamos tu enlace de recuperación
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show error state if no valid token
  if (!resetToken) {
    return (
      <div className={styles['page']}>
        <main className={styles['main']} role="main" aria-labelledby="error-title">
          <div className={styles['container']}>
            <div className={styles['header']} role="alert">
              <h1 id="error-title" className={styles['title']}>Enlace Inválido</h1>
              <p className={styles['subtitle']}>
                El enlace de recuperación no es válido o ha expirado
              </p>
            </div>
            <div className={styles['links']} role="navigation" aria-label="Navegación de error">
              <p>
                <a href="/login" className={styles['link']} aria-label="Volver a la página de inicio de sesión">
                  Volver al inicio de sesión
                </a>
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles['page']}>
      <main id="main-content" className={styles['main']} role="main" aria-labelledby="reset-title">
        <div className={styles['container']}>
          <div className={styles['header']}>
            <h1 id="reset-title" className={styles['title']}>Nueva Contraseña</h1>
            <p className={styles['subtitle']}>
              Ingresa tu nueva contraseña
            </p>
          </div>

          <form className={styles['form']} onSubmit={handleSubmit} noValidate aria-labelledby="reset-title">
            <div className={styles['formGroup']}>
              <label htmlFor="password" className={styles['formLabel']}>
                Nueva contraseña <span aria-label="requerido">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={styles['formInput']}
                required
                aria-required="true"
                minLength={8}
                aria-describedby="password-help"
                aria-invalid={error ? 'true' : 'false'}
              />
              <span id="password-help" className={styles['formHelp']} role="note">
                La contraseña debe tener mínimo 8 caracteres
              </span>
            </div>

            <div className={styles['formGroup']}>
              <label htmlFor="confirmPassword" className={styles['formLabel']}>
                Confirmar contraseña <span aria-label="requerido">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={styles['formInput']}
                required
                aria-required="true"
                minLength={8}
                aria-describedby="confirm-help"
                aria-invalid={error ? 'true' : 'false'}
              />
              <span id="confirm-help" className={styles['formHelp']} role="note">
                Repite tu nueva contraseña para confirmar que coincide
              </span>
            </div>

            {error && (
              <div role="alert" aria-live="assertive" className={styles['formHelp']} style={{ color: '#ffb3b3' }}>
                <strong>Error:</strong> {error}
              </div>
            )}

            <button 
              type="submit" 
              className={styles['btn']} 
              disabled={submitting}
              aria-busy={submitting}
              aria-label={submitting ? 'Actualizando contraseña, por favor espera' : 'Cambiar contraseña'}
            >
              {submitting ? 'Actualizando…' : 'Cambiar contraseña'}
            </button>

            <div className={styles['links']} role="complementary">
              <p>
                ¿Recordaste tu contraseña?{' '}
                <a href="/login" className={styles['link']} aria-label="Ir a página de inicio de sesión">
                  Inicia sesión
                </a>
              </p>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

