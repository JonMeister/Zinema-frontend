/**
 * Header for authenticated home page.
 *
 * Displays logo, navigation links, and user account controls with dropdown.
 */
import React, { useState, useRef, useEffect } from 'react';
import styles from './HeaderHome.module.scss';

export function HeaderHome(): JSX.Element {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    localStorage.removeItem('authToken');
    window.location.href = '/landing';
  };

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

        <div className={styles['header__user']} ref={dropdownRef}>
          <button 
            className={styles['header__btn']}
            type="button"
            aria-label="User menu"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className={styles['header__dropdown']}>
              <a href="/profile" className={styles['header__dropdown-item']}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Mi Perfil
              </a>
              <button 
                className={styles['header__dropdown-item']}
                onClick={handleLogout}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

