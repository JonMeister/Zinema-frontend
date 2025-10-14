/**
 * Shared footer component used across all pages.
 *
 * Displays the Zinema brand information, site navigation links, and copyright notice.
 * Provides consistent footer content and styling throughout the application.
 * Includes responsive design and accessibility features.
 * 
 * @component
 * @returns {JSX.Element} The footer with brand info, sitemap, and copyright
 * 
 * @example
 * ```tsx
 * // Renders footer on all pages
 * <Footer />
 * ```
 */
import React from 'react';
import styles from './Footer.module.scss';

export function Footer(): JSX.Element {
  return (
    <footer className={styles['footer']}>
      <div className={styles['footer__container']}>
        <div className={styles['footer__brand']}>
          <h3>Zinema</h3>
          <p>Versión 0.0.0</p>
        </div>
        
        <div className={styles['footer__sitemap']}>
          <h4>Mapa Del Sitio</h4>
          <ul>
            <li><a href="#perfil">Perfil</a></li>
            <li><a href="#hogar">Hogar</a></li>
            <li><a href="#series">Series</a></li>
            <li><a href="#peliculas">Películas</a></li>
            <li><a href="#nosotros">Nosotros</a></li>
          </ul>
        </div>
        
        <div className={styles['footer__copyright']}>
          <p>© 2025 Zinema. Todos Los Derechos Reservados.</p>
        </div>
      </div>
    </footer>
  );
}
