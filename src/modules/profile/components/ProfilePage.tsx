/**
 * Interface representing user profile data from the API.
 */
interface UserProfile {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * User profile page component.
 * 
 * Displays comprehensive user information including personal details and account metadata.
 * Provides functionality to edit profile and delete account with confirmation modal.
 * Includes HeaderHome and Footer for consistent navigation experience.
 * 
 * @component
 * @returns {JSX.Element} The profile page with user data and action buttons
 * 
 * @example
 * ```tsx
 * // Renders user profile with edit and delete options
 * <ProfilePage />
 * ```
 */
import React, { useEffect, useState } from 'react';
import styles from './ProfilePage.module.scss';
import { HeaderHome } from '../../home/components/HeaderHome';
import { Footer } from '../../shared/components/Footer';
import { apiFetch } from '../../../lib/api/client';
import { getAuthToken } from '../../../lib/auth/useAuth';
import { useToast } from '../../../shared/components/ToastProvider';

export function ProfilePage(): JSX.Element {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  // Set page title for screen readers
  useEffect(() => {
    document.title = 'Indormación de mi Perfil - Zinema';
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
        setProfile(response.data);
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

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
    setDeleteConfirmation('');
  };

  const confirmDeleteAccount = async () => {
    if (deleteConfirmation.toLowerCase() !== 'eliminar') {
      showToast('Debes escribir "ELIMINAR" para confirmar', 'error');
      return;
    }

    setDeleting(true);

    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await apiFetch('/api/users/deleteUser', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        showToast('Cuenta eliminada exitosamente', 'success', 500);
        localStorage.removeItem('authToken');
        setTimeout(() => {
          window.location.href = '/landing';
        }, 1500);
      } else {
        showToast(response.error?.message || 'Error al eliminar la cuenta', 'error');
        setDeleting(false);
        setShowDeleteModal(false);
      }
    } catch (err) {
      showToast('Error de conexión', 'error');
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const cancelDeleteAccount = () => {
    setShowDeleteModal(false);
    setDeleteConfirmation('');
    setDeleting(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className={styles['page']}>
        <HeaderHome />
        <main id="main-content" className={styles['main']} role="main" aria-busy="true" aria-live="polite">
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

  if (error || !profile) {
    return (
      <div className={styles['page']}>
        <HeaderHome />
        <main id="main-content" className={styles['main']} role="main" aria-labelledby="error-title">
          <div className={styles['container']}>
            <div className={styles['error']} role="alert">
              <h2 id="error-title">Error al cargar el perfil</h2>
              <p>{error}</p>
              <button 
                onClick={() => window.location.href = '/home'} 
                className={styles['btn']}
                aria-label="Volver a la página de inicio"
              >
                Volver al inicio
              </button>
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

      <main id="main-content" className={styles['main']} role="main" aria-labelledby="profile-title">
        <div className={styles['container']}>
          <div className={styles['header']}>
            <h1 id="profile-title" className={styles['title']}>Mi Perfil</h1>
          </div>

          <section className={styles['card']} aria-labelledby="profile-title">
            <div className={styles['avatar']} role="img" aria-label="Avatar de usuario predeterminado">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>

            <div className={styles['info']} role="list" aria-label="Información del perfil">
              <div className={styles['info-group']} role="listitem">
                <span className={styles['label']} id="full-name-label">Nombre Completo</span>
                <p className={styles['value']} aria-labelledby="full-name-label">{profile.firstName} {profile.lastName}</p>
              </div>

              <div className={styles['info-group']} role="listitem">
                <span className={styles['label']} id="email-label">Correo Electrónico</span>
                <p className={styles['value']} aria-labelledby="email-label">{profile.email}</p>
              </div>

              <div className={styles['info-group']} role="listitem">
                <span className={styles['label']} id="age-label">Edad</span>
                <p className={styles['value']} aria-labelledby="age-label">{profile.age} años</p>
              </div>

              <div className={styles['info-group']} role="listitem">
                <span className={styles['label']} id="member-since-label">Miembro desde</span>
                <p className={styles['value']} aria-labelledby="member-since-label">{formatDate(profile.createdAt)}</p>
              </div>

              {profile.updatedAt !== profile.createdAt && (
                <div className={styles['info-group']} role="listitem">
                  <span className={styles['label']} id="last-updated-label">Última actualización</span>
                  <p className={styles['value']} aria-labelledby="last-updated-label">{formatDate(profile.updatedAt)}</p>
                </div>
              )}
            </div>
          </section>

          <div className={styles['actions']} role="group" aria-label="Acciones de perfil">
          <a href="/profile/edit" className={styles['btn-primary']} aria-label="Ir a página de editar perfil">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Editar Perfil
            </a>
            <a href="/home" className={styles['btn-secondary']} aria-label="Volver a la página de inicio">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Volver al Inicio
            </a>
          </div>

          <section className={styles['danger-zone']} aria-labelledby="danger-zone-title">
            <h2 id="danger-zone-title" className={styles['danger-title']}>Zona de peligro</h2>
            <p className={styles['danger-text']}>
              Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, estate seguro.
            </p>
            <button 
              onClick={handleDeleteAccount} 
              className={styles['btn-danger']}
              aria-label="Abrir modal para eliminar cuenta permanentemente"
            >
              Eliminar Cuenta
            </button>
          </section>
        </div>
      </main>

      <Footer />

      {/* Modal de confirmación para eliminar cuenta */}
      {showDeleteModal && (
        <div 
          className={styles['modal-overlay']} 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) cancelDeleteAccount();
          }}
        >
          <div className={styles['modal']}>
            <h3 id="modal-title" className={styles['modal-title']}>Eliminar Cuenta</h3>
            <p className={styles['modal-text']} role="alert">
              Esta acción es irreversible. Todos tus datos serán eliminados permanentemente.
            </p>
            <p className={styles['modal-instruction']}>
              Para confirmar, escribe <strong>ELIMINAR</strong> en el campo de abajo:
            </p>
            <label htmlFor="delete-confirmation" className="visually-hidden">
              Escribe ELIMINAR para confirmar
            </label>
            <input
              type="text"
              id="delete-confirmation"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Escribe ELIMINAR aquí"
              className={styles['modal-input']}
              disabled={deleting}
              aria-required="true"
              aria-describedby="delete-instruction"
              autoFocus
            />
            <span id="delete-instruction" className="visually-hidden">
              Debes escribir la palabra ELIMINAR en mayúsculas para confirmar la eliminación de tu cuenta
            </span>
            <div className={styles['modal-actions']} role="group" aria-label="Acciones del modal">
              <button
                onClick={cancelDeleteAccount}
                className={styles['btn-cancel']}
                disabled={deleting}
                aria-label="Cancelar eliminación de cuenta"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteAccount}
                className={styles['btn-confirm-delete']}
                disabled={deleting || deleteConfirmation.toLowerCase() !== 'eliminar'}
                aria-label="Confirmar eliminación permanente de cuenta"
                aria-busy={deleting}
              >
                {deleting ? 'Eliminando...' : 'Eliminar Cuenta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

