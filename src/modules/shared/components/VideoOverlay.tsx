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
import { useComments } from '@/lib/stores/commentsStore';
import { useAuthStore } from '@/lib/stores/authStore';

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
  const { userComment, videoComments, createComment, updateComment, deleteComment, getUserComment, getVideoComments } = useComments();
  const { user } = useAuthStore();
  const [isAddingFavorite, setIsAddingFavorite] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isEditingRating, setIsEditingRating] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [commentText, setCommentText] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  
  const isFavorite = video ? checkFavorite(String(video.id)) : false;
  const currentUserRating = video ? userRating[String(video.id)] : null;
  const stats = video ? videoStats[String(video.id)] : null;
  const currentUserComment = video ? userComment[String(video.id)] : null;
  const comments = video ? (videoComments[String(video.id)] || []) : [];
  
  /**
   * Load ratings and comments when overlay opens.
   * Fetches user's rating, video statistics, user's comment, and all comments for the video.
   */
  useEffect(() => {
    if (isOpen && video) {
      getUserRating(String(video.id));
      getVideoRatings(String(video.id));
      getUserComment(String(video.id));
      getVideoComments(String(video.id));
    }
  }, [isOpen, video, getUserRating, getVideoRatings, getUserComment, getVideoComments]);

  /**
   * Populate comment text field when entering edit mode.
   * Clears the field when exiting edit mode.
   */
  useEffect(() => {
    if (isEditingComment && currentUserComment) {
      setCommentText(currentUserComment.content);
    } else if (!isEditingComment) {
      setCommentText('');
    }
  }, [isEditingComment, currentUserComment]);

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

  /**
   * Handles comment submission (create or update).
   * Validates comment length (5-100 characters) before submitting.
   * Updates existing comment if in edit mode, otherwise creates new comment.
   */
  const handleCommentSubmit = async () => {
    if (!video || !commentText.trim()) return;
    
    if (commentText.trim().length < 5) {
      alert('El comentario debe tener al menos 5 caracteres');
      return;
    }
    
    if (commentText.trim().length > 100) {
      alert('El comentario no puede tener más de 100 caracteres');
      return;
    }
    
    setIsCommenting(true);
    try {
      if (currentUserComment && isEditingComment) {
        // Update existing comment
        await updateComment(String(video.id), currentUserComment.id, commentText.trim());
        setIsEditingComment(false);
      } else {
        // Create new comment
        await createComment(String(video.id), commentText.trim());
      }
      setCommentText('');
    } catch (error) {
      console.error('Error handling comment:', error);
    } finally {
      setIsCommenting(false);
    }
  };

  /**
   * Handles comment deletion with user confirmation.
   * Clears the comment text and exits edit mode after deletion.
   */
  const handleDeleteComment = async () => {
    if (!video || !currentUserComment) return;
    
    if (!confirm('¿Estás seguro de que quieres eliminar tu comentario?')) {
      return;
    }
    
    setIsCommenting(true);
    try {
      await deleteComment(String(video.id), currentUserComment.id);
      setCommentText('');
      setIsEditingComment(false);
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setIsCommenting(false);
    }
  };

  /**
   * Cancels comment editing mode and clears the input field.
   */
  const handleCancelEdit = () => {
    setIsEditingComment(false);
    setCommentText('');
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

          {/* Comments Section */}
          <div className={styles['overlay__comments-section']}>
            <h3 className={styles['overlay__comments-title']}>
              Comentarios ({comments.length})
            </h3>

            {/* Add/Edit Comment Form */}
            {(!currentUserComment || isEditingComment) && (
              <div className={styles['overlay__comment-form']}>
                <textarea
                  className={styles['overlay__comment-input']}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Escribe tu comentario (5-100 caracteres)..."
                  maxLength={100}
                  disabled={isCommenting}
                  aria-label="Comentario"
                />
                <div className={styles['overlay__comment-actions']}>
                  <span className={styles['overlay__comment-counter']}>
                    {commentText.length}/100
                  </span>
                  <div className={styles['overlay__comment-buttons']}>
                    {isEditingComment && (
                      <button
                        className={styles['overlay__comment-cancel']}
                        onClick={handleCancelEdit}
                        disabled={isCommenting}
                      >
                        Cancelar
                      </button>
                    )}
                    <button
                      className={styles['overlay__comment-submit']}
                      onClick={handleCommentSubmit}
                      disabled={isCommenting || commentText.trim().length < 5}
                    >
                      {isCommenting ? 'Enviando...' : (isEditingComment ? 'Actualizar' : 'Comentar')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* User's Existing Comment */}
            {currentUserComment && !isEditingComment && (
              <div className={styles['overlay__comment-item'] + ' ' + styles['overlay__comment-item--own']}>
                <div className={styles['overlay__comment-header']}>
                  <div className={styles['overlay__comment-author-wrapper']}>
                    <span className={styles['overlay__comment-author']}>Tú</span>
                    {currentUserComment.rating && (
                      <div className={styles['overlay__comment-rating']}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span 
                            key={star}
                            className={`${styles['overlay__comment-star']} ${star <= (currentUserComment.rating || 0) ? styles['overlay__comment-star--filled'] : ''}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className={styles['overlay__comment-date']}>
                    {new Date(currentUserComment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className={styles['overlay__comment-content']}>
                  {currentUserComment.content}
                </p>
                <div className={styles['overlay__comment-actions-buttons']}>
                  <button
                    className={styles['overlay__comment-edit']}
                    onClick={() => setIsEditingComment(true)}
                    disabled={isCommenting}
                  >
                    Editar
                  </button>
                  <button
                    className={styles['overlay__comment-delete']}
                    onClick={handleDeleteComment}
                    disabled={isCommenting}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )}

            {/* Other Users' Comments */}
            <div className={styles['overlay__comments-list']}>
              {comments
                .filter(comment => comment.userId !== user?.id)
                .map((comment) => (
                  <div key={comment.id} className={styles['overlay__comment-item']}>
                    <div className={styles['overlay__comment-header']}>
                      <div className={styles['overlay__comment-author-wrapper']}>
                        <span className={styles['overlay__comment-author']}>
                          {comment.username || 'Usuario'}
                        </span>
                        {comment.rating && (
                          <div className={styles['overlay__comment-rating']}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span 
                                key={star}
                                className={`${styles['overlay__comment-star']} ${star <= (comment.rating || 0) ? styles['overlay__comment-star--filled'] : ''}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className={styles['overlay__comment-date']}>
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={styles['overlay__comment-content']}>
                      {comment.content}
                    </p>
                  </div>
                ))}
            </div>

            {comments.filter(c => c.userId !== user?.id).length === 0 && !currentUserComment && (
              <p className={styles['overlay__no-comments']}>
                Sé el primero en comentar esta película
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
