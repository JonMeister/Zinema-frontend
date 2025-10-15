/**
 * Password recovery request page component.
 *
 * Provides a form interface for users to request a password reset link via email.
 * Sends the request to the backend which generates a secure token and sends
 * an email with reset instructions. Includes form validation and user feedback.
 * 
 * @component
 * @returns {JSX.Element} The password recovery form with email input and submission handling
 * 
 * @example
 * ```tsx
 * // Renders password recovery form
 * <PasswordRecoveryPage />
 * ```
 */
import React, { useState } from 'react';
import { Footer } from '@/modules/shared/components/Footer';
import styles from './LoginPage.module.scss';
import { apiFetch } from '@/lib/api/client';
import { useToast } from '@/shared/components/ToastProvider';

export function PasswordRecoveryPage(): JSX.Element {
  /** Local form state for email. */
  const [email, setEmail] = useState('');
  /** Prevents duplicate submissions while a request is in-flight. */
  const [submitting, setSubmitting] = useState(false);
  /** Stores the last submission error message, if any. */
  const [error, setError] = useState<string | null>(null);
  /** Toast API for user feedback. */
  const { showToast } = useToast();

  // Set page title for screen readers
  React.useEffect(() => {
    document.title = 'Recuperar Contraseña - Zinema';
  }, []);

  /**
   * Handles form submission: sends reset link request to backend.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const response = await apiFetch('/api/users/request-password-reset', {
        method: 'POST',
        json: { email: email.trim() },
      });

      if (response.ok) {
        // Show success message
        showToast('Enlace de recuperación enviado a tu correo', 'success');
        setEmail('');
      } else {
        // Handle API error
        const errorMessage = response.error?.message || 'Error al enviar el enlace de recuperación';
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

  return (
    <div className={styles['page']}>
      <main id="main-content" className={styles['main']} role="main" aria-labelledby="recovery-title">
        <div className={styles['container']}>
          <div className={styles['header']}>
            <h1 id="recovery-title" className={styles['title']}>Recuperar Contraseña</h1>
            <p className={styles['subtitle']}>
              Ingresa tu correo y te enviaremos un enlace para recuperar tu contraseña
            </p>
          </div>

          <form className={styles['form']} onSubmit={handleSubmit} noValidate aria-labelledby="recovery-title">
            <div className={styles['formGroup']}>
              <label htmlFor="email" className={styles['formLabel']}>
                Correo electrónico <span aria-label="requerido">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles['formInput']}
                required
                aria-required="true"
                aria-describedby="email-help"
                aria-invalid={error ? 'true' : 'false'}
                placeholder="ejemplo@correo.com"
              />
              <span id="email-help" className={styles['formHelp']} role="note">
                Ingresa el correo electrónico asociado a tu cuenta de Zinema
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
              aria-label={submitting ? 'Enviando enlace de recuperación, por favor espera' : 'Enviar enlace de recuperación'}
            >
              {submitting ? 'Enviando…' : 'Enviar enlace'}
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

