/**
 * Home page for authenticated users.
 *
 * Displays the main application header and content area.
 */
import React from 'react';
import { HeaderHome } from './HeaderHome';
import { Footer } from '@/modules/shared/components/Footer';
import styles from './HomePage.module.scss';

export function HomePage(): JSX.Element {
  return (
    <div className={styles['page']}>
      <HeaderHome />

      <main className={styles['main']}>
        <section className={styles['hero']}>
          <h1 className={styles['hero__title']}>Bienvenido a Zinema</h1>
          <p className={styles['hero__subtitle']}>Explora nuestro catálogo de películas y series</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

