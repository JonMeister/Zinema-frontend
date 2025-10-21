/**
 * Home page component for authenticated users.
 *
 * Displays a Netflix-style interface with featured movie hero section
 * and multiple movie carousels organized by categories.
 * Includes proper semantic HTML and ARIA attributes for accessibility.
 * 
 * @component
 * @returns {JSX.Element} The authenticated home page with Netflix-style layout
 * 
 * @example
 * ```tsx
 * // Renders authenticated home page with movie carousels
 * <HomePage />
 * ```
 */
import React, { useEffect, useState } from 'react';
import { HeaderHome } from './HeaderHome';
import { Footer } from '@/modules/shared/components/Footer';
import { FeaturedHero } from '@/modules/shared/components/FeaturedHero';
import { Carousel, SearchBar, VideoOverlay, VideoPlayer } from '@/modules/shared/components';
import { useVideos, useVideoSearch } from '@/lib/stores/videosStore';
import { useFavorites } from '@/lib/stores/favoritesStore';
import styles from './HomePage.module.scss';

/**
 * Renders the main home page for authenticated users.
 * Sets the page title and displays Netflix-style movie interface.
 * 
 * @returns {JSX.Element} Complete home page layout with movie carousels
 */
export function HomePage(): JSX.Element {
  const { videos, loading, error, fetchVideosByCategory, loadMoreVideos, hasMorePages, lastFetchedAt } = useVideos();
  const { searchResults, searchLoading, searchError, searchVideos, clearSearch } = useVideoSearch();
  const { fetchFavorites } = useFavorites();
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  // Set page title for screen readers
  useEffect(() => {
    document.title = 'Inicio - Zinema';
  }, []);

  // Load initial data - only fetch if not already cached
  useEffect(() => {
    const hasCached = Array.isArray(videos) && videos.length > 0;
    if (!hasCached) {
      fetchVideosByCategory('featured', 1);
    }
    fetchFavorites();
  }, [fetchVideosByCategory, fetchFavorites]);

  // Helper function to shuffle array
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Group videos by categories for different carousels (10 por sección)
  const shuffledVideos = shuffleArray(videos); // Mezclar todos los videos
  const popularVideos = shuffledVideos.slice(0, 10); // Primeros 10 videos
  
  // Get featured video (first video from the list)
  const featuredVideo = videos.length > 0 ? videos[0] : null;
  
  // Videos aleatorios para diferentes categorías (10 videos cada uno)
  const actionVideos = videos.slice(0, 10);
  const comedyVideos = videos.slice(10, 20);
  const natureVideos = videos.slice(20, 30);

  const handleVideoClick = (video: any) => {
    setSelectedVideo(video);
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    setSelectedVideo(null);
  };

  const handlePlay = (video: any) => {
    console.log('HomePage: handlePlay called with video:', video);
    setSelectedVideo(video);
    setIsOverlayOpen(false); // Close overlay first
    // Small delay to ensure smooth transition
    setTimeout(() => {
      console.log('HomePage: Opening video player');
      setIsPlayerOpen(true);
    }, 100);
  };

  const handleClosePlayer = () => {
    setIsPlayerOpen(false);
    setSelectedVideo(null);
  };

  const handleRate = (video: any, rating: number) => {
    console.log('Rating video:', video, 'with rating:', rating);
    // TODO: Implement rating functionality
  };

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      setIsSearchMode(true);
      await searchVideos(query.trim());
    }
  };

  const handleClearSearch = () => {
    setIsSearchMode(false);
    clearSearch();
  };

  return (
    <div className={styles['page']}>
      <HeaderHome />

      <main id="main-content" className={styles['main']} role="main">
        {/* Featured Hero Section */}
        <FeaturedHero 
          video={featuredVideo || null} 
          loading={loading && videos.length === 0}
          onPlay={handlePlay}
          onMoreInfo={handleVideoClick}
        />

        {/* Search Bar */}
        <section className={styles['search-section']} aria-label="Búsqueda de contenido">
          <SearchBar 
            onSearch={handleSearch}
            loading={searchLoading}
            placeholder="Buscar películas, series, documentales..."
          />
        </section>

        {/* Search Results or Movie Carousels */}
        {isSearchMode ? (
          <div className={styles['search-results']}>
            {searchError && (
              <div className={styles['error']} role="alert">
                <p>Error en la búsqueda: {searchError}</p>
              </div>
            )}
            
            {searchResults.length > 0 ? (
              <Carousel
                title={`Resultados de búsqueda (${searchResults.length})`}
                videos={searchResults}
                loading={searchLoading}
                onVideoClick={handleVideoClick}
              />
            ) : !searchLoading && (
              <div className={styles['no-results']}>
                <h2>No se encontraron resultados</h2>
                <p>Intenta con otros términos de búsqueda</p>
                <button 
                  className={styles['back-button']}
                  onClick={handleClearSearch}
                >
                  Volver al inicio
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={styles['carousels']}>
            {error && (
              <div className={styles['error']} role="alert">
                <p>Error al cargar las películas: {error}</p>
              </div>
            )}

            {/* Popular Movies */}
            <Carousel
              title="Películas Populares"
              videos={popularVideos}
              loading={loading}
              onVideoClick={handleVideoClick}
              onLoadMore={loadMoreVideos}
              hasMore={hasMorePages}
            />

            {/* Random Videos Category 1 */}
            {actionVideos.length > 0 && (
              <Carousel
                title="Recomendados para Ti"
                videos={actionVideos}
                loading={loading}
                onVideoClick={handleVideoClick}
              />
            )}

            {/* Random Videos Category 2 */}
            {comedyVideos.length > 0 && (
              <Carousel
                title="Tendencias"
                videos={comedyVideos}
                loading={loading}
                onVideoClick={handleVideoClick}
              />
            )}
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

