import React from 'react';
import styles from './VideoCard.module.scss';
import { Video } from '@/lib/api/types';

interface VideoCardProps {
  video: Video;
  onClick?: (video: Video) => void;
  className?: string;
  showRemoveButton?: boolean;
  onRemoveFromFavorites?: (video: Video) => void;
}

export function VideoCard({ 
  video, 
  onClick, 
  className = '', 
  showRemoveButton = false,
  onRemoveFromFavorites 
}: VideoCardProps): JSX.Element {
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

  const handleClick = () => {
    if (onClick) {
      onClick(video);
    }
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    if (onRemoveFromFavorites) {
      onRemoveFromFavorites(video);
    }
  };

  const handleRemoveKeyDown = (e: React.KeyboardEvent) => {
    // Avoid bubbling to the card's keydown handler
    if (e.key === 'Enter' || e.key === ' ') {
      e.stopPropagation();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={`${styles['video-card']} ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalles de ${getVideoTitle(video)}`}
      onKeyDown={handleKeyDown}
    >
      <div className={styles['video-card__image-container']}>
        <img
          src={video.image}
          alt={getVideoTitle(video)}
          className={styles['video-card__image']}
          loading="lazy"
        />
        <div className={styles['video-card__overlay']}>
          <div className={styles['video-card__play-button']}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        {showRemoveButton && (
          <button
            className={styles['video-card__remove-button']}
            onClick={handleRemoveClick}
            onKeyDown={handleRemoveKeyDown}
            aria-label={`Eliminar ${getVideoTitle(video)} de favoritos`}
            title="Eliminar de favoritos"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        )}
      </div>

      <div className={styles['video-card__info']}>
        <h3 className={styles['video-card__title']}>
          {getVideoTitle(video)}
        </h3>
        <p className={styles['video-card__duration']}>
          {Math.floor(video.duration / 60)} min
        </p>
      </div>
    </div>
  );
}
