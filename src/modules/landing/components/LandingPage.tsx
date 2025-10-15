/**
 * Public landing page composed of a header, hero section and footer.
 */
import React, { useEffect } from 'react';
import { HeaderLandingPage } from './HeaderLandingPage';
import { Footer } from '@/modules/shared/components/Footer';
import styles from './LandingPage.module.scss';

export function LandingPage(): JSX.Element {
  // Set page title for screen readers
  useEffect(() => {
    document.title = 'Zinema - El cine que amas, cuando y donde quieras';
  }, []);

  return (
    <div className={styles['page']}>
      <HeaderLandingPage />
      <main id="main-content" className={styles['main']} aria-labelledby="landing-hero-title" role="main">
        <section className={`${styles['hero']} ${styles['hero--bg']}`} aria-labelledby="landing-hero-title">
          <div className={styles['hero__bg']} aria-hidden="true" />
          <div className={styles['hero__overlay']}>
            <h1 id="landing-hero-title" className={styles['hero__subtitle']}>
              El cine que amas, cuando y donde quieras
            </h1>
            <p className="visually-hidden">
              Página principal de Zinema, tu plataforma de streaming de películas y series
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
