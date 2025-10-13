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
            <h1 id="landing-hero-title" className={styles['hero__title']}>Zinema</h1>
            <p className={styles['hero__subtitle']}>Disfruta películas y series en un solo lugar</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
