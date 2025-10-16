/**
 * Landing page header component.
 *
 * Displays the Zinema brand logo and primary navigation actions for unauthenticated users.
 * Contains login and registration buttons with responsive design and accessibility features.
 * Used on the public landing page to provide entry points to authentication flows.
 * 
 * @component
 * @returns {JSX.Element} The landing page header with logo and action buttons
 * 
 * @example
 * ```tsx
 * // Renders header with logo and auth buttons
 * <HeaderLandingPage />
 * ```
 */
import React from 'react';
import styles from './HeaderLandingPage.module.scss';

export function HeaderLandingPage(): JSX.Element {
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
        <div className={styles['header__logo']}>
          <a href="/landing" aria-label="Zinema - Ir a página principal">
            <img 
              src="/images/logos/zinemalogo.png" 
              alt="Logo de Zinema" 
              width="120" 
              height="40"
            />
          </a>
        </div>
        <nav className={styles['header__actions']} aria-label="Acciones de cuenta">
          <button 
            className={`${styles['header__btn']} ${styles['header__btn--ghost']}`} 
            type="button"
            onClick={() => window.location.href = '/login'}
            aria-label="Ir a página de inicio de sesión"
          >
            Iniciar sesión
          </button>
          <button 
            className={`${styles['header__btn']} ${styles['header__btn--filled']}`}
            type="button"
            onClick={() => window.location.href = '/signup'}
            aria-label="Ir a página de registro"
          >
            Registrarse
          </button>
        </nav>
      </div>
    </header>
  );
}
