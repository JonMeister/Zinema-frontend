/**
 * My List page component for displaying user's favorite videos.
 * 
 * Shows all videos that the user has added to their favorites list
 * with options to play, rate, and remove from favorites.
 */
import React, { useEffect } from 'react';
import { HeaderHome } from '@/modules/home/components/HeaderHome';
import { Footer } from '@/modules/shared/components/Footer';
import { Carousel, VideoOverlay, VideoPlayer } from '@/modules/shared/components';
import { useFavorites } from '@/lib/stores/favoritesStore';
import { Video } from '@/lib/api/types';
import styles from './MyListPage.module.scss';

export function MyListPage(): JSX.Element {
  const { favorites, loading, error, fetchFavorites, removeFavorite } = useFavorites();
  const [selectedVideo, setSelectedVideo] = React.useState<Video | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = React.useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = React.useState(false);

  useEffect(() => {
    document.title = 'Mi Lista - Zinema';
    fetchFavorites();
  }, [fetchFavorites]);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    setSelectedVideo(null);
  };

  const handlePlay = (video: Video) => {
    setSelectedVideo(video);
    setIsOverlayOpen(false);
    setTimeout(() => {
      setIsPlayerOpen(true);
    }, 100);
  };

  const handleClosePlayer = () => {
    setIsPlayerOpen(false);
    setSelectedVideo(null);
  };

  const handleRate = (video: Video, rating: number) => {
    console.log('Rating video:', video, 'with rating:', rating);
    // TODO: Implement rating functionality
  };

  const handleRemoveFromFavorites = async (video: Video) => {
    try {
      await removeFavorite(String(video.id));
      // Close overlay after successful removal
      setIsOverlayOpen(false);
      setSelectedVideo(null);
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  return (
    <div className={styles['page']}>
      <HeaderHome />

      <main id="main-content" className={styles['main']} role="main">
        <div className={styles['header']}>
          <h1 className={styles['title']}>Mi Lista</h1>
          <p className={styles['subtitle']}>
            {favorites.length > 0 
              ? `${favorites.length} video${favorites.length !== 1 ? 's' : ''} guardado${favorites.length !== 1 ? 's' : ''}`
              : 'No tienes videos guardados aún'
            }
          </p>
        </div>

        {error && (
          <div className={styles['error']} role="alert">
            <p>Error al cargar tu lista: {error}</p>
            <button 
              className={styles['retry-button']}
              onClick={() => fetchFavorites()}
            >
              Reintentar
            </button>
          </div>
        )}

        {loading && favorites.length === 0 ? (
          <div className={styles['loading']}>
            <div className={styles['loading-spinner']} />
            <p>Cargando tu lista...</p>
          </div>
        ) : favorites.length > 0 ? (
          <div className={styles['favorites-grid']}>
            <Carousel
              title="Mis Videos Favoritos"
              videos={favorites}
              loading={loading}
              onVideoClick={handleVideoClick}
              showRemoveButton={true}
              onRemoveFromFavorites={handleRemoveFromFavorites}
            />
          </div>
        ) : (
          <div className={styles['empty-state']}>
            <div className={styles['empty-icon']}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h2>Tu lista está vacía</h2>
            <p>Agrega videos a tu lista haciendo clic en el corazón cuando veas algo que te guste.</p>
            <a href="/home" className={styles['browse-button']}>
              Explorar Contenido
            </a>
          </div>
        )}
      </main>

      <VideoOverlay
        video={selectedVideo}
        isOpen={isOverlayOpen}
        onClose={handleCloseOverlay}
        onPlay={handlePlay}
        onRate={handleRate}
      />

      <VideoPlayer
        video={selectedVideo}
        isOpen={isPlayerOpen}
        onClose={handleClosePlayer}
      />

      <Footer />
    </div>
  );
}
