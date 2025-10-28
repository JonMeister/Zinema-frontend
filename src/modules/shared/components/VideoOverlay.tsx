/**
 * Video overlay component for displaying video actions.
 * 
 * Shows a modal overlay with play, rate, and add to favorites options
 * when a video card is clicked.
 */
import React, { useEffect, useState, useRef } from 'react';
import styles from './VideoOverlay.module.scss';
import { Video } from '@/lib/api/types';
import { useFavorites } from '@/lib/stores/favoritesStore';
import { useRatings } from '@/lib/stores/ratingsStore';

interface VideoOverlayProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
  onPlay?: (video: Video) => void;
  onRate?: (video: Video, rating: number) => void;
}

export function VideoOverlay({
  video,
  isOpen,
  onClose,
  onPlay,
  onRate
}: VideoOverlayProps): JSX.Element {
  const { addFavorite, removeFavorite, checkFavorite } = useFavorites();
  const { userRating, videoStats, createRating, updateRating, deleteRating, getUserRating, getVideoRatings } = useRatings();
  const [isAddingFavorite, setIsAddingFavorite] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isEditingRating, setIsEditingRating] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  
  const isFavorite = video ? checkFavorite(String(video.id)) : false;
  const currentUserRating = video ? userRating[String(video.id)] : null;
  const stats = video ? videoStats[String(video.id)] : null;
  
  // Load ratings when overlay opens.
  useEffect(() => {
    if (isOpen && video) {
      getUserRating(String(video.id));
      getVideoRatings(String(video.id));
    }
  }, [isOpen, video, getUserRating, getVideoRatings]);

  // Focus management and keyboard trap
  useEffect(() => {
    if (isOpen) {
      // Save previously focused element
      const previouslyFocusedElement = document.activeElement as HTMLElement;
      
      // Focus close button when overlay opens
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);

      // Prevent body scroll when overlay is open
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = 'unset';
        // Restore focus to previously focused element
        previouslyFocusedElement?.focus();
      };
    }
  }, [isOpen]);

  // Keyboard event handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      // Close on Escape
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      // Tab trap within overlay
      if (event.key === 'Tab') {
        const focusableElements = overlayRef.current?.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        // Shift+Tab on first element -> go to last
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
        // Tab on last element -> go to first
        else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
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

  const handleRate = async (stars: number) => {
    if (!video) return;
    
    // Si ya tiene calificación y no está editando, no hacer nada
    if (currentUserRating && !isEditingRating) return;
    
    setIsRating(true);
    
    try {
      if (currentUserRating) {
        // Update existing rating
        await updateRating(String(video.id), currentUserRating.id, stars);
        setIsEditingRating(false);
      } else {
        // Create new rating
        await createRating(String(video.id), stars);
      }
      
      if (onRate) {
        onRate(video, stars);
      }
    } catch (error) {
      console.error('Error handling rating:', error);
    } finally {
      setIsRating(false);
    }
  };

  const handleDeleteRating = async () => {
    if (!video) return;
    
    setIsRating(true);
    try {
      await deleteRating(String(video.id));
      setIsEditingRating(false);
    } catch (error) {
      console.error('Error deleting rating:', error);
    } finally {
      setIsRating(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!video) return;
    
    setIsAddingFavorite(true);
    try {
      if (isFavorite) {
        await removeFavorite(String(video.id));
      } else {
        await addFavorite(String(video.id));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsAddingFavorite(false);
    }
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
      <div className={styles['overlay__content']} ref={overlayRef}>
        {/* Close button */}
        <button
          ref={closeButtonRef}
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
            className={`${styles['overlay__button--secondary']} ${isFavorite ? styles['overlay__button--active'] : ''}`}
            onClick={handleToggleFavorite}
            disabled={isAddingFavorite}
            aria-label={isFavorite ? `Eliminar ${getVideoTitle(video)} de favoritos` : `Agregar ${getVideoTitle(video)} a favoritos`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {isAddingFavorite ? 'Procesando...' : (isFavorite ? 'En Mi Lista' : 'Agregar a Mi Lista')}
          </button>

          <div className={styles['overlay__rating']}>
            <div className={styles['overlay__rating-header']}>
              <span className={styles['overlay__rating-label']}>
                {currentUserRating ? 'Tu Calificación:' : 'Calificar:'}
              </span>
              {currentUserRating && (
                <div className={styles['overlay__rating-actions']}>
                  {!isEditingRating ? (
                    <button
                      className={styles['overlay__rating-edit']}
                      onClick={() => setIsEditingRating(true)}
                      disabled={isRating}
                      aria-label="Editar calificación"
                      title="Editar calificación"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Editar
                    </button>
                  ) : (
                    <button
                      className={styles['overlay__rating-cancel']}
                      onClick={() => setIsEditingRating(false)}
                      disabled={isRating}
                      aria-label="Cancelar edición"
                      title="Cancelar"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    className={styles['overlay__rating-clear']}
                    onClick={handleDeleteRating}
                    disabled={isRating}
                    aria-label="Eliminar calificación"
                    title="Eliminar calificación"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    Eliminar
                  </button>
                </div>
              )}
            </div>
            
            <div className={styles['overlay__stars']}>
              {[1, 2, 3, 4, 5].map((star) => {
                const userStars = currentUserRating ? currentUserRating.stars : 0;
                const isFilled = hoveredStar >= star || (!hoveredStar && userStars >= star);
                const isDisabled = isRating || !!(currentUserRating && !isEditingRating);
                
                return (
                  <button
                    key={star}
                    className={`${styles['overlay__star']} ${isFilled ? styles['overlay__star--filled'] : ''} ${isDisabled ? styles['overlay__star--disabled'] : ''}`}
                    onClick={() => handleRate(star)}
                    onMouseEnter={() => !isDisabled && setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    disabled={isDisabled}
                    aria-label={`Calificar con ${star} estrella${star > 1 ? 's' : ''}`}
                    title={`${star} estrella${star > 1 ? 's' : ''}`}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill={isFilled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </button>
                );
              })}
            </div>
            
            {stats && stats.count > 0 && (
              <div className={styles['overlay__rating-stats']}>
                <span className={styles['overlay__rating-average']}>
                  ⭐ {stats.average.toFixed(1)} / 5
                </span>
                <span className={styles['overlay__rating-count']}>
                  ({stats.count} calificación{stats.count !== 1 ? 'es' : ''})
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
