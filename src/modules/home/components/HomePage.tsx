/**
 * Home page component for authenticated users.
 *
 * Serves as the main landing page after user authentication.
 * Displays welcome message, navigation header, and application footer.
 * Includes proper semantic HTML and ARIA attributes for accessibility.
 * 
 * @component
 * @returns {JSX.Element} The authenticated home page with header, content, and footer
 * 
 * @example
 * ```tsx
 * // Renders authenticated home page
 * <HomePage />
 * ```
 */
import React, { useEffect } from 'react';
import { HeaderHome } from './HeaderHome';
import { Footer } from '@/modules/shared/components/Footer';
import styles from './HomePage.module.scss';

/**
 * Renders the main home page for authenticated users.
 * Sets the page title and displays welcome content.
 * 
 * @returns {JSX.Element} Complete home page layout
 */
export function HomePage(): JSX.Element {
  // Set page title for screen readers
  useEffect(() => {
    document.title = 'Inicio - Zinema';
  }, []);

  return (
    <div className={styles['page']}>
      <HeaderHome />

      <main id="main-content" className={styles['main']} role="main" aria-labelledby="home-title">
        <section className={styles['hero']} aria-labelledby="home-title">
          <h1 id="home-title" className={styles['hero__title']}>Bienvenido a Zinema</h1>
          <p className={styles['hero__subtitle']}>Explora nuestro catálogo de películas y series</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

