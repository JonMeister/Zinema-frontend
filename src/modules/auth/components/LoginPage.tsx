/**
 * Login page for existing users.
 *
 * Collects email and password, posts to the backend for authentication,
 * and displays toast feedback on success or error.
 */
import React, { useState } from 'react';
import { Footer } from '@/modules/shared/components/Footer';
import styles from './LoginPage.module.scss';
import { apiFetch } from '@/lib/api/client';
import { useToast } from '@/shared/components/ToastProvider';

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

    const res = await apiFetch<string>('/api/users/login', {
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

    // Save token to localStorage
    if (res.data) {
      localStorage.setItem('authToken', res.data);
    }

    showToast('Sesión iniciada con éxito', 'success');
    // On success, redirect to home
    setTimeout(() => {
      window.location.href = '/home';
    }, 500);
  };

  return (
    <div className={styles['page']}>
      <main className={styles['main']}>
        <div className={styles['container']}>
          <div className={styles['header']}>
            <h1 className={styles['title']}>Zinema</h1>
            <p className={styles['subtitle']}>
              Inicia sesión para continuar
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
                value={formData.email}
                onChange={handleInputChange}
                className={styles['formInput']}
                required
                aria-describedby="email-help"
              />
              <span id="email-help" className={styles['formHelp']}>
                Ingresa tu correo
              </span>
            </div>

            <div className={styles['formGroup']}>
              <label htmlFor="password" className={styles['formLabel']}>
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={styles['formInput']}
                required
                minLength={8}
                aria-describedby="password-help"
              />
              <span id="password-help" className={styles['formHelp']}>
                Ingresa tu contraseña
              </span>
            </div>

            {error && (
              <p role="alert" className={styles['formHelp']} style={{ color: '#ffb3b3' }}>
                {error}
              </p>
            )}

            <div className={styles['links']}>
              <a href="#forgot-password" className={styles['link']}>
                Olvidé mi contraseña
              </a>
            </div>

            <button type="submit" className={styles['btn']} disabled={submitting}>
              {submitting ? 'Iniciando…' : 'Iniciar sesión'}
            </button>

            <div className={styles['links']}>
              <p>
                ¿No tienes una cuenta?{' '}
                <a href="/signup" className={styles['link']}>
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

