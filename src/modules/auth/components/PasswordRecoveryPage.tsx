/**
 * Password recovery page for requesting reset link via email.
 *
 * Collects user email and sends password reset link request to backend.
 * The user will receive an email with a link to the reset page.
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
      <main className={styles['main']}>
        <div className={styles['container']}>
          <div className={styles['header']}>
            <h1 className={styles['title']}>Recuperar Contraseña</h1>
            <p className={styles['subtitle']}>
              Ingresa tu correo y te enviaremos un enlace para recuperar tu contraseña
            </p>
          </div>

          <form className={styles['form']} onSubmit={handleSubmit} noValidate>
            <div className={styles['formGroup']}>
              <label htmlFor="email" className={styles['formLabel']}>
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles['formInput']}
                required
                aria-describedby="email-help"
              />
              <span id="email-help" className={styles['formHelp']}>
                Ingresa tu correo registrado
              </span>
            </div>

            {error && (
              <p role="alert" className={styles['formHelp']} style={{ color: '#ffb3b3' }}>
                {error}
              </p>
            )}

            <button type="submit" className={styles['btn']} disabled={submitting}>
              {submitting ? 'Enviando…' : 'Enviar enlace'}
            </button>

            <div className={styles['links']}>
              <p>
                ¿Recordaste tu contraseña?{' '}
                <a href="/login" className={styles['link']}>
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

