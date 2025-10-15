/**
 * Home page for authenticated users.
 *
 * Displays the main application header and content area.
 */
import React, { useEffect } from 'react';
import { HeaderHome } from './HeaderHome';
import { Footer } from '@/modules/shared/components/Footer';
import styles from './HomePage.module.scss';

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

