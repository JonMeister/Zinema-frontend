/**
 * Interface representing user profile data from the API.
 */
interface UserProfile {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
}

/**
 * Interface extending UserProfile with password fields for form handling.
 */
interface FormData extends UserProfile {
  password: string;
  confirmPassword: string;
}

/**
 * Edit profile page component.
 * 
 * Provides a comprehensive form for users to update their personal information
 * and change their password. Includes client-side validation, loading states,
 * and error handling. Redirects to profile page upon successful update.
 * 
 * @component
 * @returns {JSX.Element} The edit profile form with validation and submission handling
 * 
 * @example
 * ```tsx
 * // Renders edit form with current user data pre-populated
 * <EditProfilePage />
 * ```
 */
import React, { useEffect, useState } from 'react';
import styles from './EditProfilePage.module.scss';
import { HeaderHome } from '../../home/components/HeaderHome';
import { Footer } from '../../shared/components/Footer';
import { apiFetch } from '../../../lib/api/client';
import { getAuthToken } from '../../../lib/auth/useAuth';
import { useToast } from '../../../shared/components/ToastProvider';

export function EditProfilePage(): JSX.Element {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    age: 0,
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  // Set page title for screen readers
  useEffect(() => {
    document.title = 'Editar Perfil - Zinema';
  }, []);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await apiFetch<UserProfile>('/api/users/getUser', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok && response.data) {
        setFormData({
          ...response.data,
          password: '',
          confirmPassword: '',
        });
      } else {
        setError(response.error?.message || 'Error al cargar el perfil');
        showToast('Error al cargar el perfil', 'error');
      }
    } catch (err) {
      setError('Error de conexión');
      showToast('Error de conexión', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setError(null);
    setSubmitting(true);

    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('Todos los campos son requeridos');
      showToast('Todos los campos son requeridos', 'error');
      setSubmitting(false);
      return;
    }

    if (formData.age < 13) {
      setError('Debes tener al menos 13 años');
      showToast('Debes tener al menos 13 años', 'error');
      setSubmitting(false);
      return;
    }

    // If password is provided, validate it
    if (formData.password) {
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        showToast('Las contraseñas no coinciden', 'error');
        setSubmitting(false);
        return;
      }

      if (formData.password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres');
        showToast('La contraseña debe tener al menos 8 caracteres', 'error');
        setSubmitting(false);
        return;
      }
    }

    try {
      const token = getAuthToken();
      if (!token) {
        window.location.href = '/login';
        return;
      }

      // Prepare update data
      const updateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: formData.age,
        email: formData.email,
      };

      // Only include password if it's being changed
      if (formData.password) {
        updateData.password = formData.password;
        updateData.confirmPassword = formData.confirmPassword;
      }

      const response = await apiFetch('/api/users/updateUser', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        json: updateData,
      });

      if (response.ok) {
        showToast('Perfil actualizado exitosamente', 'success', 500);
        setTimeout(() => {
          window.location.href = '/profile';
        }, 1500);
      } else {
        const errorMessage = response.error?.message || 'Error al actualizar el perfil';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
    } catch (err) {
      setError('Error de conexión');
      showToast('Error de conexión', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles['page']}>
        <HeaderHome />
        <main className={styles['main']} role="main" aria-busy="true" aria-live="polite">
          <div className={styles['container']}>
            <div className={styles['loading']} role="status">
              <span>Cargando perfil...</span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles['page']}>
      <HeaderHome />

      <main className={styles['main']} role="main" aria-labelledby="edit-profile-title">
        <div className={styles['container']}>
          <div className={styles['header']}>
            <h1 id="edit-profile-title" className={styles['title']}>Editar Perfil</h1>
          </div>

          <form className={styles['form']} onSubmit={handleSubmit} noValidate aria-labelledby="edit-profile-title">
            <section className={styles['form-section']} aria-labelledby="personal-info-title">
              <h2 id="personal-info-title" className={styles['section-title']}>Información Personal</h2>

              <div className={styles['form-row']}>
                <div className={styles['form-group']}>
                  <label htmlFor="firstName" className={styles['label']}>
                    Nombre <span aria-label="requerido">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={styles['input']}
                    required
                    aria-required="true"
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby="firstName-help"
                  />
                  <span id="firstName-help" className="visually-hidden">Campo requerido para tu nombre</span>
                </div>

                <div className={styles['form-group']}>
                  <label htmlFor="lastName" className={styles['label']}>
                    Apellido <span aria-label="requerido">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={styles['input']}
                    required
                    aria-required="true"
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby="lastName-help"
                  />
                  <span id="lastName-help" className="visually-hidden">Campo requerido para tu apellido</span>
                </div>
              </div>

              <div className={styles['form-row']}>
                <div className={styles['form-group']}>
                  <label htmlFor="email" className={styles['label']}>
                    Correo Electrónico <span aria-label="requerido">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles['input']}
                    required
                    aria-required="true"
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby="email-help"
                  />
                  <span id="email-help" className="visually-hidden">Campo requerido para tu correo electrónico</span>
                </div>

                <div className={styles['form-group']}>
                  <label htmlFor="age" className={styles['label']}>
                    Edad <span aria-label="requerido">*</span>
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className={styles['input']}
                    min="13"
                    max="120"
                    required
                    aria-required="true"
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby="age-help"
                  />
                  <span id="age-help" className="visually-hidden">Campo requerido, edad mínima 13 años</span>
                </div>
              </div>
            </section>

            <section className={styles['form-section']} aria-labelledby="password-section-title">
              <h2 id="password-section-title" className={styles['section-title']}>Cambiar Contraseña</h2>
              <p className={styles['section-help']} role="note">
                Deja estos campos vacíos si no deseas cambiar tu contraseña
              </p>

              <div className={styles['form-group']}>
                <label htmlFor="password" className={styles['label']}>
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={styles['input']}
                  minLength={8}
                  aria-describedby="password-help"
                />
                <span id="password-help" className={styles['help-text']} role="note">
                  Mínimo 8 caracteres, se recomienda incluir mayúsculas, minúsculas, números y caracteres especiales
                </span>
              </div>

              <div className={styles['form-group']}>
                <label htmlFor="confirmPassword" className={styles['label']}>
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={styles['input']}
                  minLength={8}
                  aria-describedby="confirmPassword-help"
                />
                <span id="confirmPassword-help" className="visually-hidden">
                  Repite la nueva contraseña para confirmar
                </span>
              </div>
            </section>

            {error && (
              <div className={styles['error-message']} role="alert" aria-live="assertive">
                <strong>Error:</strong> {error}
              </div>
            )}

            <div className={styles['form-actions']} role="group" aria-label="Acciones del formulario">
              <button
                type="submit"
                className={styles['btn-primary']}
                disabled={submitting}
                aria-busy={submitting}
                aria-label={submitting ? 'Guardando cambios, por favor espera' : 'Guardar cambios del perfil'}
              >
                {submitting ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <a href="/profile" className={styles['btn-cancel']} aria-label="Cancelar edición y volver al perfil">
                Cancelar
              </a>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

