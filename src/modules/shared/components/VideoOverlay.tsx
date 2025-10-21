/**
 * Video overlay component for displaying video actions.
 * 
 * Shows a modal overlay with play, rate, and add to favorites options
 * when a video card is clicked.
 */
import React, { useEffect } from 'react';
import styles from './VideoOverlay.module.scss';
import { Video } from '@/lib/api/types';

interface VideoOverlayProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
  onPlay?: (video: Video) => void;
  onRate?: (video: Video, rating: number) => void;
  onAddToFavorites?: (video: Video) => void;
}

export function VideoOverlay({
  video,
  isOpen,
  onClose,
  onPlay,
  onRate,
  onAddToFavorites
}: VideoOverlayProps): JSX.Element {
  // Close overlay on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when overlay is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Don't render if not open or no video
  if (!isOpen || !video) {
    return <></>;
  }

  const getVideoTitle = (video: Video): string => {
    if (video.tags && video.tags.length > 0) {
      const firstTag = video.tags[0];
      if (firstTag) {
        return firstTag.charAt(0).toUpperCase() + firstTag.slice(1).replace(/_/g, ' ');
      }
    }
    if (video.user?.name) {
      return video.user.name;
    }
    return 'Video Sin Título';
  };

  const handlePlay = () => {
    if (onPlay) {
      onPlay(video);
    }
    // Don't close overlay immediately - let the parent handle the transition
  };

  const handleRate = (rating: number) => {
    if (onRate) {
      onRate(video, rating);
    }
  };

  const handleAddToFavorites = () => {
    if (onAddToFavorites) {
      onAddToFavorites(video);
    }
    onClose();
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={styles['overlay']}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-overlay-title"
      aria-describedby="video-overlay-description"
    >
      <div className={styles['overlay__content']}>
        {/* Close button */}
        <button
          className={styles['overlay__close']}
          onClick={onClose}
          aria-label="Cerrar overlay"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Video info */}
        <div className={styles['overlay__info']}>
          <div className={styles['overlay__image-container']}>
            <img
              src={video.image}
              alt={getVideoTitle(video)}
              className={styles['overlay__image']}
            />
          </div>
          
          <div className={styles['overlay__details']}>
            <h2 id="video-overlay-title" className={styles['overlay__title']}>
              {getVideoTitle(video)}
            </h2>
            
            <p id="video-overlay-description" className={styles['overlay__description']}>
              {video.tags.slice(0, 3).join(' • ') || 'Descubre este increíble contenido'}
            </p>
            
            <div className={styles['overlay__meta']}>
              <span className={styles['overlay__duration']}>
                {Math.floor(video.duration / 60)} min
              </span>
              <span className={styles['overlay__user']}>
                Por {video.user?.name || 'Usuario'}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className={styles['overlay__actions']}>
          <button
            className={styles['overlay__button--primary']}
            onClick={handlePlay}
            aria-label={`Reproducir ${getVideoTitle(video)}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Reproducir
          </button>

          <button
            className={styles['overlay__button--secondary']}
            onClick={handleAddToFavorites}
            aria-label={`Agregar ${getVideoTitle(video)} a favoritos`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            Agregar a Favoritos
          </button>

          <div className={styles['overlay__rating']}>
            <span className={styles['overlay__rating-label']}>Calificar:</span>
            <div className={styles['overlay__stars']}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={styles['overlay__star']}
                  onClick={() => handleRate(star)}
                  aria-label={`Calificar con ${star} estrella${star > 1 ? 's' : ''}`}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
