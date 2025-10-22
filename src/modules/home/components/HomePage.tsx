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
import { useMovies } from '@/lib/stores/moviesStore';
import { useFavorites } from '@/lib/stores/favoritesStore';
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
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

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
        {/* Featured Hero Section */}
        <FeaturedHero 
          video={featuredMovie} 
          loading={loading && movies.length === 0}
          onPlay={handlePlay}
          onMoreInfo={handleVideoClick}
        />

        {/* Content with overlap */}
        <div className={styles['content']}>
          {error && (
            <div className={styles['error']} role="alert">
              <p>Error al cargar las películas: {error}</p>
            </div>
          )}

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

