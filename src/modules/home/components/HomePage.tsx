/**
 * Home page component for authenticated users.
 *
 * Displays a Zinema-style interface with featured movie hero section
 * and a single movie carousel for popular movies.
 * Includes proper semantic HTML and ARIA attributes for accessibility.
 * 
 * @component
 * @returns {JSX.Element} The authenticated home page with Zinema-style layout
 * 
 * @example
 * ```tsx
 * // Renders authenticated home page with movie carousel
 * <HomePage />
 * ```
 */
import React, { useEffect, useState } from 'react';
import { HeaderHome } from './HeaderHome';
import { Footer } from '@/modules/shared/components/Footer';
import { FeaturedHero } from '@/modules/shared/components/FeaturedHero';
import { Carousel, VideoOverlay, VideoPlayer } from '@/modules/shared/components';
import { SearchBar } from '@/modules/shared/components/SearchBar';
import { useMovies } from '@/lib/stores/moviesStore';
import { useFavorites } from '@/lib/stores/favoritesStore';
import { useVideoSearch } from '@/lib/stores/videosStore';
import { Video } from '@/lib/api/types';
import styles from './HomePage.module.scss';

/**
 * Renders the main home page for authenticated users.
 * Sets the page title and displays Zinema-style movie interface.
 * 
 * @returns {JSX.Element} Complete home page layout with movie carousel
 */
export function HomePage(): JSX.Element {
  const { movies, featuredMovie, loading, error, fetchMovies } = useMovies();
  const { fetchFavorites } = useFavorites();
  const { searchResults, searchLoading, searchError, searchVideos, clearSearch, searchQuery } = useVideoSearch();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Set page title for screen readers
  useEffect(() => {
    document.title = 'Inicio - Zinema';
  }, []);

  // Load initial data
  useEffect(() => {
    fetchMovies();
    fetchFavorites();
  }, [fetchMovies, fetchFavorites]);

  // Split movies into two sections
  const popularMovies = movies.slice(0, 10); // First 10 movies
  const recommendedMovies = movies.slice(10, 20); // Next 10 movies

  // Handle search
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      // If search is empty, clear search and show all movies
      clearSearch();
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    await searchVideos(query.trim());
  };

  // Handle when search field becomes empty
  const handleSearchEmpty = () => {
    clearSearch();
    setIsSearching(false);
  };

  // Determine which videos to display
  const displayVideos = isSearching ? searchResults : movies;
  // Always show featured: if searching and has results, show first search result, otherwise show original featured
  const displayFeatured = (isSearching && searchResults.length > 0) 
    ? searchResults[0] 
    : (featuredMovie || null);
  const isLoading = isSearching ? searchLoading : loading;
  const displayError = isSearching ? searchError : error;

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

  return (
    <div className={styles['page']}>
      <HeaderHome />

      <main id="main-content" className={styles['main']} role="main">
        {/* Featured Hero Section - hide when searching */}
        {!isSearching && (
          <FeaturedHero 
            video={displayFeatured ?? null} 
            loading={isLoading && displayVideos.length === 0}
            onPlay={handlePlay}
            onMoreInfo={handleVideoClick}
          />
        )}

        {/* Search Bar */}
        <div className={styles['search-section']}>
          <SearchBar 
            onSearch={handleSearch}
            onEmpty={handleSearchEmpty}
            loading={isLoading && isSearching}
            placeholder="Buscar películas..."
          />
        </div>

        {/* Content with overlap */}
        <div className={`${styles['content']} ${isSearching ? styles['content--no-overlap'] : ''}`}>
          {displayError && (
            <div className={styles['error']} role="alert">
              <p>Error al cargar las películas: {displayError}</p>
            </div>
          )}

          {/* Search Results */}
          {isSearching && (
            <>
              <Carousel
                title={`Resultados de búsqueda${searchQuery ? `: "${searchQuery}"` : ''}`}
                videos={displayVideos}
                loading={isLoading}
                onVideoClick={handleVideoClick}
              />
              {displayVideos.length === 0 && !isLoading && (
                <div className={styles['no-results']}>
                  <p>No se encontraron resultados para tu búsqueda.</p>
                </div>
              )}
            </>
          )}

          {/* Regular Content - only show when not searching */}
          {!isSearching && (
            <>
              {/* Popular Movies Carousel */}
              <Carousel
                title="Películas Populares"
                videos={popularMovies}
                loading={loading}
                onVideoClick={handleVideoClick}
              />

              {/* Recommended Movies Carousel */}
              {recommendedMovies.length > 0 && (
                <Carousel
                  title="Recomendadas para Ti"
                  videos={recommendedMovies}
                  loading={loading}
                  onVideoClick={handleVideoClick}
                />
              )}
            </>
          )}
        </div>
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

