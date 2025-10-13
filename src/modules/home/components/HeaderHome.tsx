/**
 * Header for authenticated home page.
 *
 * Displays logo, navigation links, and user account controls.
 */
import React from 'react';
import styles from './HeaderHome.module.scss';

export function HeaderHome(): JSX.Element {
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
        
        <nav className={styles['header__nav']} aria-label="Main navigation">
          <a href="/home" className={styles['header__link']}>Inicio</a>
          <a href="/movies" className={styles['header__link']}>Películas</a>
          <a href="/series" className={styles['header__link']}>Series</a>
          <a href="/my-list" className={styles['header__link']}>Mi Lista</a>
        </nav>

        <div className={styles['header__user']}>
          <button 
            className={styles['header__btn']}
            type="button"
            aria-label="User menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

