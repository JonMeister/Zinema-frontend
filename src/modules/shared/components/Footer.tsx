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
    <footer className={styles['footer']} role="contentinfo" aria-label="Pie de página">
      <div className={styles['footer__container']}>
        <div className={styles['footer__brand']} role="group" aria-label="Información de marca">
          <h3>Zinema</h3>
          <p aria-label="Versión actual de la aplicación">Versión 1.0.0</p>
        </div>
        
        <nav className={styles['footer__sitemap']} role="navigation" aria-label="Enlaces del pie de página">
          <h4 id="footer-links-heading">Enlaces</h4>
          <ul role="list" aria-labelledby="footer-links-heading">
            <li><a href="/about" aria-label="Ir a página sobre nosotros">Sobre Nosotros</a></li>
            <li><a href="/sitemap" aria-label="Ir a mapa del sitio">Mapa del Sitio</a></li>
          </ul>
        </nav>
        
        <div className={styles['footer__copyright']} role="contentinfo">
          <p>© 2025 Zinema. Todos Los Derechos Reservados.</p>
        </div>
      </div>
    </footer>
  );
}
