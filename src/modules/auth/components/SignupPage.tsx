/**
 * Signup page that collects user data and sends it to the backend.
 *
 * The form uses controlled inputs and posts to `/api/users/register` using the
 * shared {@link apiFetch} helper. Basic submission state and error display
 * are handled locally.
 */
import React, { useState } from 'react';
import { Footer } from '@/modules/shared/components/Footer';
import styles from './SignupPage.module.scss';
import { apiFetch } from '@/lib/api/client';
import { useToast } from '@/shared/components/ToastProvider';

export function SignupPage(): JSX.Element {
  /** Local form state for the signup fields. */
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    email: '',
    password: '',
    confirmPassword: '',
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
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      age: Number(formData.age),
      email: formData.email.trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    };

    const res = await apiFetch<string>('/api/users/register', {
      method: 'POST',
      json: payload,
    });

    setSubmitting(false);

    if (!res.ok) {
      const msg = res.error?.message ?? 'No se pudo crear la cuenta';
      setError(msg);
      showToast(`Error: ${msg}`, 'error');
      return;
    }

    showToast('Cuenta creada con éxito', 'success');
    // On success, redirect to home (rudimentary routing)
    window.location.href = '/';
  };

  return (
    <div className={styles['page']}>
      <main className={styles['main']}>
        <div className={styles['container']}>
          <div className={styles['header']}>
            <h1 className={styles['title']}>Crear cuenta</h1>
            <p className={styles['subtitle']}>
              Únete a Zinema y disfruta de películas y series ilimitadas
            </p>
          </div>

          <form className={styles['form']} onSubmit={handleSubmit} noValidate>
            <div className={styles['formGroup']}>
              <label htmlFor="firstName" className={styles['formLabel']}>
                Nombre
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={styles['formInput']}
                required
                aria-describedby="firstName-help"
              />
              <span id="firstName-help" className={styles['formHelp']}>
                Tu nombre
              </span>
            </div>

            <div className={styles['formGroup']}>
              <label htmlFor="lastName" className={styles['formLabel']}>
                Apellido
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={styles['formInput']}
                required
                aria-describedby="lastName-help"
              />
              <span id="lastName-help" className={styles['formHelp']}>
                Tu apellido
              </span>
            </div>

            <div className={styles['formGroup']}>
              <label htmlFor="age" className={styles['formLabel']}>
                Edad
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className={styles['formInput']}
                required
                min="13"
                max="120"
                aria-describedby="age-help"
              />
              <span id="age-help" className={styles['formHelp']}>
                Debes tener al menos 13 años
              </span>
            </div>

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
                Usaremos este email para tu cuenta
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
                Mínimo 8 caracteres
              </span>
            </div>

            <div className={styles['formGroup']}>
              <label htmlFor="confirmPassword" className={styles['formLabel']}>
                Repetir contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={styles['formInput']}
                required
                minLength={8}
                aria-describedby="confirm-help"
              />
              <span id="confirm-help" className={styles['formHelp']}>
                Repite tu contraseña
              </span>
            </div>

            {error && (
              <p role="alert" className={styles['formHelp']} style={{ color: '#ffb3b3' }}>
                {error}
              </p>
            )}

            <button type="submit" className={styles['btn']} disabled={submitting}>
              {submitting ? 'Creando…' : 'Crear cuenta'}
            </button>

            <div className={styles['links']}>
              <p>
                ¿Ya tienes cuenta?{' '}
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
