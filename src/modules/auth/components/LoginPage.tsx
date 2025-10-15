/**
 * Login page component for user authentication.
 *
 * Provides a form interface for existing users to authenticate with email and password.
 * Handles form submission, validation, and authentication state management.
 * Displays toast notifications for success/error feedback and redirects on successful login.
 * 
 * @component
 * @returns {JSX.Element} The login form with email/password fields and submission handling
 * 
 * @example
 * ```tsx
 * // Renders login form for user authentication
 * <LoginPage />
 * ```
 */
import React, { useState } from 'react';
import { Footer } from '@/modules/shared/components/Footer';
import styles from './LoginPage.module.scss';
import { apiFetch } from '@/lib/api/client';
import { useToast } from '@/shared/components/ToastProvider';
import { useAuth } from '@/lib/auth/useAuth';

export function LoginPage(): JSX.Element {
  /** Local form state for login fields. */
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  /** Prevents duplicate submissions while a request is in-flight. */
  const [submitting, setSubmitting] = useState(false);
  /** Stores the last submission error message, if any. */
  const [error, setError] = useState<string | null>(null);
  /** Toast API for user feedback. */
  const { showToast } = useToast();
  /** Authentication hook. */
  const { login } = useAuth();

  // Set page title for screen readers
  React.useEffect(() => {
    document.title = 'Iniciar Sesión en Zinema';
  }, []);

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
   * Handles form submission: builds payload, sends POST, and navigates on success.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const payload = {
      email: formData.email.trim(),
      password: formData.password,
    };

    const res = await apiFetch<{ token: string }>('/api/users/login', {
      method: 'POST',
      json: payload,
    });

    setSubmitting(false);

    if (!res.ok) {
      const msg = res.error?.message ?? 'No se pudo iniciar sesión';
      setError(msg);
      showToast(`Error: ${msg}`, 'error');
      return;
    }

    // Save token using auth hook
    if (res.data?.token) {
      login(res.data.token);
    }

    showToast('Sesión iniciada con éxito', 'success', 500);
    // On success, redirect to home with delay to show toast
    setTimeout(() => {
      window.location.href = '/home';
    }, 1000);
  };

  return (
    <div className={styles['page']}>
      <main id="main-content" className={styles['main']} role="main" aria-labelledby="login-title">
        <div className={styles['container']}>
          <div className={styles['header']}>
            <div className={styles['title']}>
              <a href="/landing" aria-label="Volver a página principal de Zinema">
                <img
                  src="/images/logos/zinemalogo.png"
                  alt="Logo de Zinema"
                  width="200"
                  height="50"
                />
              </a>
            </div>
            <h1 id="login-title" className={styles['subtitle']}>
              Inicia sesión para continuar
            </h1>
          </div>

          <form className={styles['form']} onSubmit={handleSubmit} noValidate aria-labelledby="login-title">
            <div className={styles['formGroup']}>
              <label htmlFor="email" className={styles['formLabel']}>
                Correo electrónico <span aria-label="requerido">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={styles['formInput']}
                required
                aria-required="true"
                aria-describedby="email-help"
                aria-invalid={error ? 'true' : 'false'}
                placeholder="ejemplo@correo.com"
              />
              <span id="email-help" className={styles['formHelp']} role="note">
                Ingresa el correo electrónico asociado a tu cuenta
              </span>
            </div>

            <div className={styles['formGroup']}>
              <label htmlFor="password" className={styles['formLabel']}>
                Contraseña <span aria-label="requerido">*</span>
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
                Ingresa tu contraseña (mínimo 8 caracteres)
              </span>
            </div>

            {error && (
              <div role="alert" aria-live="assertive" className={styles['formHelp']} style={{ color: '#ffb3b3' }}>
                <strong>Error:</strong> {error}
              </div>
            )}

            <div className={styles['links']}>
              <a href="/password-recovery" className={styles['link']} aria-label="Ir a página de recuperación de contraseña">
                Olvidé mi contraseña
              </a>
            </div>

            <button 
              type="submit" 
              className={styles['btn']} 
              disabled={submitting}
              aria-busy={submitting}
              aria-label={submitting ? 'Iniciando sesión, por favor espera' : 'Iniciar sesión'}
            >
              {submitting ? 'Iniciando…' : 'Iniciar sesión'}
            </button>

            <div className={styles['links']} role="complementary">
              <p>
                ¿No tienes una cuenta?{' '}
                <a href="/signup" className={styles['link']} aria-label="Ir a página de registro">
                  Regístrate ahora
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

