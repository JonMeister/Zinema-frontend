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
    <header className={styles['header']} role="banner">
      <div className={styles['header__bar']}>
        <div className={styles['header__logo']} aria-label="Zinema">
          <img 
            src="/images/logos/zinemalogo.png" 
            alt="Zinema" 
            width="120" 
            height="40"
          />
        </div>
        <nav className={styles['header__actions']} aria-label="Account">
          <button 
            className={`${styles['header__btn']} ${styles['header__btn--ghost']}`} 
            type="button"
            onClick={() => window.location.href = '/login'}
          >
            Iniciar sesión
          </button>
          <button 
            className={`${styles['header__btn']} ${styles['header__btn--filled']}`}
            type="button"
            onClick={() => window.location.href = '/signup'}
          >
            Registrarse
          </button>
        </nav>
      </div>
    </header>
  );
}
