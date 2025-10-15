/**
 * Public landing page composed of a header, hero section and footer.
 */
import React from 'react';
import { HeaderLandingPage } from './HeaderLandingPage';
import { Footer } from '@/modules/shared/components/Footer';
import styles from './LandingPage.module.scss';

export function LandingPage(): JSX.Element {
  return (
    <div className={styles['page']}>
      <HeaderLandingPage />

      <main className={styles['main']} aria-labelledby="landing-hero-title">
        <section className={`${styles['hero']} ${styles['hero--bg']}`} role="region" aria-label="Hero">
          <div className={styles['hero__bg']} aria-hidden="true" />
          <div className={styles['hero__overlay']}>
            <h1 id="landing-hero-title" className={styles['hero__subtitle']}>
              El cine que amas, cuando y donde quieras
            </h1>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
