/**
 * Top-level landing header with brand logo and primary account actions.
 *
 * Contains the brand image at the left and two action buttons on the right.
 * The “Sign up” button navigates to `/signup` using a simple location change.
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
