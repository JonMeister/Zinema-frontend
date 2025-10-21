import React, { useRef, useState, useEffect } from 'react';
import { VideoCard } from './VideoCard';
import { Video } from '@/lib/api/types';
import styles from './Carousel.module.scss';

interface CarouselProps {
  title: string;
  videos: Video[];
  loading?: boolean;
  onVideoClick?: (video: Video) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  className?: string;
}

export function Carousel({
  title,
  videos,
  loading = false,
  onVideoClick,
  onLoadMore,
  hasMore = false,
  className = ''
}: CarouselProps): JSX.Element {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
  };

  useEffect(() => {
    checkScrollPosition();
    const handleResize = () => checkScrollPosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [videos]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleVideoClick = (video: Video) => {
    if (onVideoClick) {
      onVideoClick(video);
    }
  };

  const renderSkeletons = () => (
    Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="video-card-skeleton">
        <div className="skeleton-image" />
        <div className="skeleton-text" />
        <div className="skeleton-text-small" />
      </div>
    ))
  );

  const renderLoadMoreButton = () => {
    if (!hasMore || !onLoadMore) return null;

    return (
      <div className="load-more-card">
        <button 
          className="load-more-button"
          onClick={onLoadMore}
          disabled={loading}
          aria-label="Cargar más videos"
        >
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              <span>Cargar más</span>
            </>
          )}
        </button>
      </div>
    );
  };

  return (
    <section className={`${styles['carousel-section']} ${className}`} aria-labelledby={`carousel-title-${title.replace(/\s/g, '-')}`}>
      <h2 id={`carousel-title-${title.replace(/\s/g, '-')}`} className={styles['carousel__title']}>{title}</h2>
      <div className={styles['carousel__wrapper']}>
        {canScrollLeft && (
          <button
            className={`${styles['carousel__arrow']} ${styles['carousel__arrow--left']}`}
            onClick={() => scroll('left')}
            aria-label={`Desplazarse a la izquierda en ${title}`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
        )}
        <div
          className={styles['carousel__container']}
          ref={scrollContainerRef}
          onScroll={checkScrollPosition}
          role="region"
          aria-label={`Lista de ${title}`}
          tabIndex={0}
        >
          {loading ? renderSkeletons() : (
            <>
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onClick={handleVideoClick}
                />
              ))}
              {renderLoadMoreButton()}
            </>
          )}
        </div>

        {canScrollRight && (
          <button
            className={`${styles['carousel__arrow']} ${styles['carousel__arrow--right']}`}
            onClick={() => scroll('right')}
            aria-label={`Desplazarse a la derecha en ${title}`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}
