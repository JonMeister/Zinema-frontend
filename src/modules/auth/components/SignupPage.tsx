/**
 * User registration page component.
 *
 * Provides a comprehensive form for new users to create an account.
 * Collects personal information (name, age, email) and password with confirmation.
 * Includes client-side validation, submission state management, and error handling.
 * Redirects to login page upon successful registration.
 * 
 * @component
 * @returns {JSX.Element} The registration form with validation and submission handling
 * 
 * @example
 * ```tsx
 * // Renders registration form for new users
 * <SignupPage />
 * ```
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
  /** Inline per-field validation errors (real-time). */
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  /** Tracks which fields have been touched (for aria-invalid). */
  const [touched, setTouched] = useState<Partial<Record<keyof typeof formData, boolean>>>({});
  /** Toast API for user feedback. */
  const { showToast } = useToast();

  // Set page title for screen readers
  React.useEffect(() => {
    document.title = 'Crear Cuenta - Zinema';
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
    // Live-validate the changed field
    setFieldErrors(prev => ({
      ...prev,
      [name]: validateField(name as keyof typeof formData, value, {
        ...formData,
        [name]: value,
      }),
    }));
  };

  /** Marks a field as touched and validates it. */
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setFieldErrors(prev => ({
      ...prev,
      [name]: validateField(name as keyof typeof formData, value, formData),
    }));
  };

  /** Email regex for simple format validation. */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /** Validates a single field and returns an error message or undefined. */
  const validateField = (
    field: keyof typeof formData,
    value: string,
    data: typeof formData
  ): string | undefined => {
    switch (field) {
      case 'firstName':
        if (!value.trim()) return 'El nombre es obligatorio';
        if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
        return undefined;
      case 'lastName':
        if (!value.trim()) return 'El apellido es obligatorio';
        if (value.trim().length < 2) return 'El apellido debe tener al menos 2 caracteres';
        return undefined;
      case 'age': {
        if (!value) return 'La edad es obligatoria';
        const n = Number(value);
        if (!Number.isFinite(n)) return 'La edad debe ser un número';
        if (n < 13 || n > 120) return 'La edad debe estar entre 13 y 120';
        return undefined;
      }
      case 'email':
        if (!value.trim()) return 'El correo es obligatorio';
        if (!emailRegex.test(value.trim())) return 'Ingresa un correo válido';
        return undefined;
      case 'password':
        if (!value) return 'La contraseña es obligatoria';
        if (value.length < 8) return 'La contraseña debe tener mínimo 8 caracteres';
        return undefined;
      case 'confirmPassword':
        if (!value) return 'Debes confirmar la contraseña';
        if (value !== data.password) return 'Las contraseñas no coinciden';
        return undefined;
      default:
        return undefined;
    }
  };

  /** Validates the whole form. */
  const validateAll = (data: typeof formData) => {
    const next: Partial<Record<keyof typeof formData, string>> = {};
    (Object.keys(data) as Array<keyof typeof formData>).forEach((key) => {
      const msg = validateField(key, data[key], data);
      if (msg) next[key] = msg;
    });
    return next;
  };

  /**
   * Handles form submission: builds payload, sends POST, and navigates on success.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    // Validate before submit
    const allErrors = validateAll(formData);
    if (Object.keys(allErrors).length > 0) {
      setFieldErrors(allErrors);
      setTouched({
        firstName: true,
        lastName: true,
        age: true,
        email: true,
        password: true,
        confirmPassword: true,
      });
      setSubmitting(false);
      showToast('Corrige los campos marcados', 'error');
      return;
    }

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

    showToast('Cuenta creada con éxito. Por favor inicia sesión.', 'success', 500);
    // On success, redirect to login page with delay to show toast
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
  };

  return (
    <div className={styles['page']}>
      <main id="main-content" className={styles['main']} role="main" aria-labelledby="signup-title">
        <div className={styles['container']}>
          <div className={styles['header']}>
            <h1 id="signup-title" className={styles['title']}>Crear cuenta</h1>
            <p className={styles['subtitle']}>
              Únete a Zinema y disfruta de películas y series ilimitadas
            </p>
          </div>

          <form className={styles['form']} onSubmit={handleSubmit} noValidate aria-labelledby="signup-title">
            <div className={styles['formGroup']}>
              <label htmlFor="firstName" className={styles['formLabel']}>
                Nombre <span aria-label="requerido">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={styles['formInput']}
                required
                aria-required="true"
                aria-describedby="firstName-help"
                aria-invalid={touched.firstName && !!fieldErrors.firstName ? 'true' : 'false'}
                placeholder="Ej: Juan"
              />
              <span id="firstName-help" className={styles['formHelp']} role="note">
                Ingresa tu nombre de pila
              </span>
              {touched.firstName && fieldErrors.firstName && (
                <span id="firstName-error" className={styles['formHelp']} role="alert" style={{ color: '#ffb3b3' }}>
                  {fieldErrors.firstName}
                </span>
              )}
            </div>

            <div className={styles['formGroup']}>
              <label htmlFor="lastName" className={styles['formLabel']}>
                Apellido <span aria-label="requerido">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={styles['formInput']}
                required
                aria-required="true"
                aria-describedby="lastName-help"
                aria-invalid={touched.lastName && !!fieldErrors.lastName ? 'true' : 'false'}
                placeholder="Ej: Pérez"
              />
              <span id="lastName-help" className={styles['formHelp']} role="note">
                Ingresa tu apellido
              </span>
              {touched.lastName && fieldErrors.lastName && (
                <span id="lastName-error" className={styles['formHelp']} role="alert" style={{ color: '#ffb3b3' }}>
                  {fieldErrors.lastName}
                </span>
              )}
            </div>

            <div className={styles['formGroup']}>
              <label htmlFor="age" className={styles['formLabel']}>
                Edad <span aria-label="requerido">*</span>
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={styles['formInput']}
                required
                aria-required="true"
                min="13"
                max="120"
                aria-describedby="age-help"
                aria-invalid={touched.age && !!fieldErrors.age ? 'true' : 'false'}
                placeholder="Ej: 25"
              />
              <span id="age-help" className={styles['formHelp']} role="note">
                Debes tener al menos 13 años para crear una cuenta. El rango válido es de 13 a 120 años
              </span>
              {touched.age && fieldErrors.age && (
                <span id="age-error" className={styles['formHelp']} role="alert" style={{ color: '#ffb3b3' }}>
                  {fieldErrors.age}
                </span>
              )}
            </div>

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
                onBlur={handleBlur}
                className={styles['formInput']}
                required
                aria-required="true"
                aria-describedby="email-help"
                aria-invalid={touched.email && !!fieldErrors.email ? 'true' : 'false'}
                placeholder="ejemplo@correo.com"
              />
              <span id="email-help" className={styles['formHelp']} role="note">
                Usaremos este correo electrónico para tu cuenta y notificaciones
              </span>
              {touched.email && fieldErrors.email && (
                <span id="email-error" className={styles['formHelp']} role="alert" style={{ color: '#ffb3b3' }}>
                  {fieldErrors.email}
                </span>
              )}
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
                onBlur={handleBlur}
                className={styles['formInput']}
                required
                aria-required="true"
                minLength={8}
                aria-describedby="password-help"
                aria-invalid={touched.password && !!fieldErrors.password ? 'true' : 'false'}
              />
              <span id="password-help" className={styles['formHelp']} role="note">
                La contraseña debe tener mínimo 8 caracteres. Se recomienda incluir mayúsculas, minúsculas, números y caracteres especiales
              </span>
              {touched.password && fieldErrors.password && (
                <span id="password-error" className={styles['formHelp']} role="alert" style={{ color: '#ffb3b3' }}>
                  {fieldErrors.password}
                </span>
              )}
            </div>

            <div className={styles['formGroup']}>
              <label htmlFor="confirmPassword" className={styles['formLabel']}>
                Repetir contraseña <span aria-label="requerido">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={styles['formInput']}
                required
                aria-required="true"
                minLength={8}
                aria-describedby="confirm-help"
                aria-invalid={touched.confirmPassword && !!fieldErrors.confirmPassword ? 'true' : 'false'}
              />
              <span id="confirm-help" className={styles['formHelp']} role="note">
                Repite la contraseña para confirmar que coincide
              </span>
              {touched.confirmPassword && fieldErrors.confirmPassword && (
                <span id="confirm-error" className={styles['formHelp']} role="alert" style={{ color: '#ffb3b3' }}>
                  {fieldErrors.confirmPassword}
                </span>
              )}
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
              aria-label={submitting ? 'Creando cuenta, por favor espera' : 'Crear cuenta'}
            >
              {submitting ? 'Creando…' : 'Crear cuenta'}
            </button>

            <div className={styles['links']} role="complementary">
              <p>
                ¿Ya tienes cuenta?{' '}
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
