/**
 * Hero section component for featured movie display.
 *
 * Displays a large featured movie with background image, title, description,
 * and action buttons. Designed to be the main focal point of the homepage.
 * 
 * @component
 * @returns {JSX.Element} The hero section with featured movie
 * 
 * @example
 * ```tsx
 * <FeaturedHero video={featuredVideo} />
 * ```
 */
import React from 'react';
import { Video } from '@/lib/api/types';
import styles from './FeaturedHero.module.scss';

interface FeaturedHeroProps {
  video: Video | null;
  loading?: boolean;
}

export function FeaturedHero({ video, loading }: FeaturedHeroProps): JSX.Element {
  // Helper function to create better titles from Pexels data
  const getVideoTitle = (video: Video): string => {
    // Try to create a title from tags, capitalizing and formatting
    if (video.tags && video.tags.length > 0) {
      const firstTag = video.tags[0];
      if (firstTag) {
        // Capitalize first letter and replace underscores with spaces
        return firstTag.charAt(0).toUpperCase() + firstTag.slice(1).replace(/_/g, ' ');
      }
    }
    
    // Fallback to user name if available
    if (video.user?.name) {
      return video.user.name;
    }
    
    return 'Video Destacado';
  };
  if (loading) {
    return (
      <section className={styles['hero']} aria-label="Cargando película destacada">
        <div className={styles['hero__content']}>
          <div className={styles['hero__loading']}>
            <div className={styles['hero__skeleton']}></div>
            <div className={styles['hero__skeleton-text']}></div>
            <div className={styles['hero__skeleton-text-small']}></div>
            <div className={styles['hero__buttons']}>
              <div className={styles['hero__button-skeleton']}></div>
              <div className={styles['hero__button-skeleton']}></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!video) {
    return (
      <section className={styles['hero']} aria-label="Sin película destacada">
        <div className={styles['hero__content']}>
          <div className={styles['hero__fallback']}>
            <h1 className={styles['hero__title']}>Bienvenido a Zinema</h1>
            <p className={styles['hero__subtitle']}>Explora nuestro catálogo de películas y series</p>
          </div>
        </div>
      </section>
    );
  }

  const handlePlay = () => {
    // TODO: Implement play functionality
    console.log('Playing video:', video.id);
  };

  const handleMoreInfo = () => {
    // TODO: Implement more info functionality
    console.log('More info for video:', video.id);
  };

  return (
    <section 
      className={styles['hero']} 
      aria-label={`Película destacada: ${getVideoTitle(video)}`}
    >
      <div 
        className={styles['hero__background']}
        style={{
          backgroundImage: `url(${video.image})`,
        }}
        aria-hidden="true"
      />
      
      <div className={styles['hero__overlay']} aria-hidden="true" />
      
      <div className={styles['hero__content']}>
        <div className={styles['hero__info']}>
          <h1 className={styles['hero__title']}>
            {getVideoTitle(video)}
          </h1>
          
          <p className={styles['hero__description']}>
            {video.tags.slice(0, 3).join(' • ') || 'Descubre este increíble contenido'}
          </p>
          
          <div className={styles['hero__buttons']}>
            <button 
              className={styles['hero__button--primary']}
              onClick={handlePlay}
              aria-label={`Reproducir ${getVideoTitle(video)}`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Reproducir
            </button>
            
            <button 
              className={styles['hero__button--secondary']}
              onClick={handleMoreInfo}
              aria-label={`Más información sobre ${getVideoTitle(video)}`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              Más información
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
