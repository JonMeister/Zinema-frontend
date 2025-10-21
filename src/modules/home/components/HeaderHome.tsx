/**
 * Authenticated user header component.
 *
 * Displays the Zinema logo, navigation links, and user account controls for authenticated users.
 * Includes a dropdown menu with profile and logout options, with click-outside handling
 * for proper UX. Provides navigation to different sections of the application.
 * 
 * @component
 * @returns {JSX.Element} The authenticated user header with navigation and user controls
 * 
 * @example
 * ```tsx
 * // Renders header with navigation and user dropdown
 * <HeaderHome />
 * ```
 */
import React, { useState, useRef, useEffect } from 'react';
import { useIsAuthenticated, useAuthStore } from '../../../lib/stores/authStore';
import styles from './HeaderHome.module.scss';

export function HeaderHome(): JSX.Element {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isAuthenticated = useIsAuthenticated();
  const { logout } = useAuthStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/landing';
  };

  return (
    <header className={styles['header']} role="banner" aria-labelledby="header-title">
      {/* Visually hidden heading for landmark identification */}
      <h1 id="header-title" className="visually-hidden">
        Navegación de Zinema
      </h1>
      
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className={styles['skip-link']}>
        Saltar al contenido principal
      </a>
      
      <div className={styles['header__bar']}>
        <div className={styles['header__logo']} aria-label="Zinema">
          <a href={isAuthenticated ? '/home' : '/landing'} aria-label="Ir al inicio">
            <img 
              src="/images/logos/zinemalogo.png" 
              alt="Zinema" 
              width="120" 
              height="40"
            />
          </a>
        </div>
        
        <nav className={styles['header__nav']} aria-label="Navegación principal" role="navigation">
          <a href="/home" className={styles['header__link']} aria-label="Ir a página de inicio" aria-current="page">Inicio</a>
          <a href="/my-list" className={styles['header__link']} aria-label="Ir a mi lista de favoritos">Mi Lista</a>
        </nav>

        <div className={styles['header__user']} ref={dropdownRef}>
          <button 
            className={styles['header__btn']}
            type="button"
            aria-label={isDropdownOpen ? "Cerrar menú de usuario" : "Abrir menú de usuario"}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="menu"
            aria-controls="user-menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="visually-hidden">
              {isDropdownOpen ? 'Cerrar menú de usuario' : 'Abrir menú de usuario'}
            </span>
          </button>

          {isDropdownOpen && (
            <div 
              id="user-menu"
              className={styles['header__dropdown']} 
              role="menu" 
              aria-label="Menú de usuario"
            >
              <a 
                href="/profile" 
                className={styles['header__dropdown-item']} 
                role="menuitem"
                aria-label="Ir a mi perfil"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Mi Perfil
              </a>
              <button 
                className={styles['header__dropdown-item']}
                onClick={handleLogout}
                role="menuitem"
                aria-label="Cerrar sesión y salir de la aplicación"
                type="button"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16,17 21,12 16,7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

