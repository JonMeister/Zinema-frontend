import React from 'react';
import styles from './VideoCard.module.scss';
import { Video } from '@/lib/api/types';

interface VideoCardProps {
  video: Video;
  onClick?: (video: Video) => void;
  className?: string;
}

export function VideoCard({ video, onClick, className = '' }: VideoCardProps): JSX.Element {
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
