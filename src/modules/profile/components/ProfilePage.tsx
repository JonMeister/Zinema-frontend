/**
 * User profile page.
 * 
 * Displays user information with options to edit or delete account.
 * Includes HeaderHome and Footer for consistent navigation.
 */
import React, { useState, useEffect } from 'react';
import { HeaderHome } from '@/modules/home/components/HeaderHome';
import { Footer } from '@/modules/shared/components/Footer';
import { apiFetch } from '@/lib/api/client';
import { getAuthToken } from '@/lib/auth/useAuth';
import { useToast } from '@/shared/components/ToastProvider';
import styles from './ProfilePage.module.scss';

interface UserProfile {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export function ProfilePage(): JSX.Element {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

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

  const handleDeleteAccount = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      return;
    }

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
        showToast('Cuenta eliminada exitosamente', 'success');
        localStorage.removeItem('authToken');
        setTimeout(() => {
          window.location.href = '/landing';
        }, 1000);
      } else {
        showToast(response.error?.message || 'Error al eliminar la cuenta', 'error');
      }
    } catch (err) {
      showToast('Error de conexión', 'error');
    }
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
        <main className={styles['main']}>
          <div className={styles['container']}>
            <div className={styles['loading']}>Cargando perfil...</div>
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
        <main className={styles['main']}>
          <div className={styles['container']}>
            <div className={styles['error']}>
              <h2>Error al cargar el perfil</h2>
              <p>{error}</p>
              <button onClick={() => window.location.href = '/home'} className={styles['btn']}>
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

      <main className={styles['main']}>
        <div className={styles['container']}>
          <div className={styles['header']}>
            <h1 className={styles['title']}>Mi Perfil</h1>
          </div>

          <div className={styles['card']}>
            <div className={styles['avatar']}>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>

            <div className={styles['info']}>
              <div className={styles['info-group']}>
                <label className={styles['label']}>Nombre Completo</label>
                <p className={styles['value']}>{profile.firstName} {profile.lastName}</p>
              </div>

              <div className={styles['info-group']}>
                <label className={styles['label']}>Correo Electrónico</label>
                <p className={styles['value']}>{profile.email}</p>
              </div>

              <div className={styles['info-group']}>
                <label className={styles['label']}>Edad</label>
                <p className={styles['value']}>{profile.age} años</p>
              </div>

              <div className={styles['info-group']}>
                <label className={styles['label']}>Miembro desde</label>
                <p className={styles['value']}>{formatDate(profile.createdAt)}</p>
              </div>

              {profile.updatedAt !== profile.createdAt && (
                <div className={styles['info-group']}>
                  <label className={styles['label']}>Última actualización</label>
                  <p className={styles['value']}>{formatDate(profile.updatedAt)}</p>
                </div>
              )}
            </div>
          </div>

          <div className={styles['actions']}>
            <a href="/profile/edit" className={styles['btn-primary']}>
              Editar Perfil
            </a>
          </div>

          <div className={styles['danger-zone']}>
            <h2 className={styles['danger-title']}>Zona de peligro</h2>
            <p className={styles['danger-text']}>
              Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, estate seguro.
            </p>
            <button onClick={handleDeleteAccount} className={styles['btn-danger']}>
              Eliminar Cuenta
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

