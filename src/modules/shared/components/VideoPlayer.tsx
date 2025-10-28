/**
 * Video player component with playback controls.
 * 
 * Provides play, pause, stop, and subtitle functionality for Pexels videos.
 * Includes custom controls overlay and keyboard shortcuts.
 * Supports multiple subtitle languages (Spanish and English).
 */
import React, { useRef, useState, useEffect } from 'react';
import styles from './VideoPlayer.module.scss';
import { Video } from '@/lib/api/types';
import { SubtitleSelector, SubtitleLanguage } from './SubtitleSelector';

interface VideoPlayerProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function VideoPlayer({
  video,
  isOpen,
  onClose,
  className = ''
}: VideoPlayerProps): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);
  const volumeTrackRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLTrackElement>(null);
  const trackEnRef = useRef<HTMLTrackElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7); // Volumen inicial 70%
  const [isMuted, setIsMuted] = useState(false); // NO silenciado por defecto
  const [isLoading, setIsLoading] = useState(true);
  const [subtitleLanguage, setSubtitleLanguage] = useState<SubtitleLanguage>('off');
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideTimerRef = useRef<number | null>(null);

  // Get video source URL
  const getVideoSource = (video: Video): string => {
    if (video.video_files && video.video_files.length > 0) {
      // Find HD quality first, then SD, then any
      const hdFile = video.video_files.find(file => file.quality === 'hd');
      const sdFile = video.video_files.find(file => file.quality === 'sd');
      const anyFile = video.video_files[0];
      
      return hdFile?.link || sdFile?.link || anyFile?.link || '';
    }
    return '';
  };

  const getVideoTitle = (video: Video): string => {
    if (video.tags && video.tags.length > 0 && video.tags[0]) {
      return video.tags[0].charAt(0).toUpperCase() + video.tags[0].slice(1).replace(/_/g, ' ');
    }
    if (video.user?.name) {
      return video.user.name;
    }
    return 'Video';
  };

  /**
   * IDs of homepage videos that have bundled subtitles.
   */
  const homepageSubtitleIds = new Set<number>([
    6963395, 5386411, 7438482, 1526909, 1409899,
    3163534, 2169880, 857251, 856973, 2098989,
    1093662, 857195, 5329239, 1580455, 4057252,
    3363552, 2480792, 6560039, 5322475, 1757800
  ]);

  /**
   * Returns the VTT subtitle path for a given video and language if available.
   */
  const getSubtitleSrc = (video: Video, lang: SubtitleLanguage): string | null => {
    if (!video || lang === 'off') return null;
    if (homepageSubtitleIds.has(video.id)) {
      const suffix = lang === 'en' ? '-en' : '';
      return `/subtitles/subtitulos-${video.id}${suffix}.vtt`;
    }
    // All other videos get generic subtitles
    return '/subtitles/subtitulos-genericos.vtt';
  };

  // Reset state when video changes
  useEffect(() => {
    if (isOpen && video) {
      setIsPlaying(false);
      setCurrentTime(0);
      setIsLoading(true);
      setSubtitleLanguage('off');
    }
  }, [video, isOpen]);

  /**
   * Effect to handle subtitle track visibility and language switching.
   * Controls the 'mode' of the text track elements to show/hide subtitles.
   */
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const tracks = videoElement.textTracks;
    
    // Disable all tracks first
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i]) {
        tracks[i].mode = 'hidden';
      }
    }

    // Enable the selected language track
    if (subtitleLanguage !== 'off') {
      const trackIndex = subtitleLanguage === 'es' ? 0 : 1;
      if (tracks[trackIndex]) {
        tracks[trackIndex].mode = 'showing';
        adjustSubtitlePosition(videoElement, showControls ? -5 : -2);
      }
    }
  }, [subtitleLanguage, showControls]);

  /**
   * Adjust subtitle vertical position. Negative line values move the cue up.
   * Example: -5 sits above controls (when visible), -2 sits lower (when hidden).
   */
  const adjustSubtitlePosition = (el: HTMLVideoElement | null, line: number) => {
    if (!el) return;
    const track = el.textTracks && el.textTracks[0];
    if (!track) return;
    const cues = track.cues;
    if (!cues) return;
    for (let i = 0; i < cues.length; i++) {
      const cue = cues[i] as any; // VTTCue in browsers
      if (cue && typeof cue.line !== 'undefined') {
        cue.line = line;
        cue.position = 50; // center horizontally
        cue.align = 'center';
      }
    }
  };

  // Handle volume dragging
  useEffect(() => {
    if (!isDraggingVolume) return;

    const handleMouseMove = (e: MouseEvent) => {
      const track = volumeTrackRef.current;
      const video = videoRef.current;
      if (!track || !video) return;

      const rect = track.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      
      video.volume = pos;
      setVolume(pos);
      setIsMuted(pos === 0);
    };

    const handleMouseUp = () => {
      setIsDraggingVolume(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingVolume]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Any key shows controls
      setShowControls(true);
      resetHideTimer();
      switch (e.key) {
        case ' ':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleSeek(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleSeek(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          adjustVolume(0.05);
          break;
        case 'ArrowDown':
          e.preventDefault();
          adjustVolume(-0.05);
          break;
        case 'f':
          e.preventDefault();
          handleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          handleMuteToggle();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, isPlaying]);

  // Auto-hide controls after inactivity
  const resetHideTimer = () => {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    hideTimerRef.current = window.setTimeout(() => {
      setShowControls(false);
    }, 2000);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    resetHideTimer();
  };

  useEffect(() => {
    if (!isOpen) return;
    // Start timer on open
    setShowControls(true);
    resetHideTimer();
    return () => {
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    };
  }, [isOpen]);

  // Reposition subtitles when controls are shown/hidden
  useEffect(() => {
    if (!isOpen) return;
    try {
      adjustSubtitlePosition(videoRef.current, showControls ? -5 : -2);
    } catch {}
  }, [showControls, isOpen]);

  // Playback controls
  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
    video.currentTime = newTime;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    
    if (newVolume === 0) {
      video.muted = true;
      setIsMuted(true);
    } else {
      video.muted = false;
      setIsMuted(false);
    }
  };

  const adjustVolume = (delta: number) => {
    const video = videoRef.current;
    if (!video) return;
    const current = typeof video.volume === 'number' ? video.volume : volume;
    const next = Math.max(0, Math.min(1, current + delta));
    video.volume = next;
    setVolume(next);
    if (next === 0) {
      video.muted = true;
      setIsMuted(true);
    } else {
      video.muted = false;
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      // Unmute and restore previous volume
      video.muted = false;
      setIsMuted(false);
      if (volume === 0) {
        video.volume = 0.5;
        setVolume(0.5);
      }
    } else {
      // Mute
      video.muted = true;
      setIsMuted(true);
    }
  };

  const handleFullscreen = () => {
    const container = document.querySelector(`.${styles['video-player__container']}`) as HTMLElement;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.error('Error entering fullscreen:', err);
      });
    } else {
      document.exitFullscreen().catch(err => {
        console.error('Error exiting fullscreen:', err);
      });
    }
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Don't render if not open or no video
  if (!isOpen || !video) {
    return <></>;
  }

  const videoSource = getVideoSource(video);
  const subtitleSrcEs = getSubtitleSrc(video, 'es');
  const subtitleSrcEn = getSubtitleSrc(video, 'en');
  const hasSubtitles = subtitleSrcEs !== null;

  return (
    <div 
      className={`${styles['video-player']} ${!showControls ? styles['hide-cursor'] : ''} ${className}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onMouseMove={handleMouseMove}
    >
      <div className={`${styles['video-player__container']} ${!showControls ? styles['video-player__container--controls-hidden'] : ''}`}>
        {/* Close button */}
        <button
          className={styles['video-player__close']}
          onClick={onClose}
          aria-label="Cerrar reproductor"
        >
          ✕
        </button>

        {/* Video title */}
        <div className={styles['video-player__title']}>
          <h2>{getVideoTitle(video)}</h2>
        </div>

        {/* Video element */}
        <video
          ref={videoRef}
          className={styles['video-player__video']}
          src={videoSource}
          poster={video.image}
          muted={isMuted}
          onClick={handlePlayPause}
          onMouseMove={handleMouseMove}
          onLoadedMetadata={(e) => {
            const video = e.currentTarget;
            setDuration(video.duration);
            video.volume = volume;
            video.muted = isMuted;
            setIsLoading(false);
            // After metadata is ready, adjust subtitle cue positions
            try { adjustSubtitlePosition(videoRef.current, showControls ? -5 : -2); } catch {}
            // Ensure subtitles start hidden by default
            try {
              const el = videoRef.current;
              if (el && el.textTracks) {
                for (let i = 0; i < el.textTracks.length; i++) {
                  if (el.textTracks[i]) {
                    el.textTracks[i].mode = 'hidden';
                  }
                }
              }
              setSubtitleLanguage('off');
            } catch {}
          }}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentTime(0);
          }}
          onWaiting={() => setIsLoading(true)}
          onCanPlay={() => setIsLoading(false)}
          onVolumeChange={(e) => {
            const video = e.currentTarget;
            setVolume(video.volume);
            setIsMuted(video.muted);
          }}
          crossOrigin="anonymous"
        >
          {subtitleSrcEs && (
            <track
              ref={trackRef}
              kind="subtitles"
              label="Español"
              srcLang="es"
              src={subtitleSrcEs}
            />
          )}
          {subtitleSrcEn && (
            <track
              ref={trackEnRef}
              kind="subtitles"
              label="English"
              srcLang="en"
              src={subtitleSrcEn}
            />
          )}
        </video>

        {/* Loading indicator */}
        {isLoading && (
          <div className={styles['video-player__loading']}>
            <div className={styles['loading-spinner']} />
            <span>Cargando video...</span>
          </div>
        )}

        {/* Controls */}
        <div className={styles['video-player__controls']}>
          {/* Progress bar */}
          <div 
            className={styles['video-player__progress']}
            onClick={handleProgressClick}
          >
            <div 
              className={styles['video-player__progress-filled']}
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          {/* Buttons */}
          <div className={styles['video-player__buttons']}>
            <div className={styles['video-player__left']}>
              {/* Play/Pause */}
              <button
                className={styles['video-player__button']}
                onClick={handlePlayPause}
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>

              {/* Stop */}
              <button
                className={styles['video-player__button']}
                onClick={handleStop}
                aria-label="Detener"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="6" width="12" height="12"/>
                </svg>
              </button>

              {/* Time */}
              <span className={styles['video-player__time']}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className={styles['video-player__right']}>
              {/* Volume */}
              <button
                className={styles['video-player__button']}
                onClick={handleMuteToggle}
                aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
              >
                {isMuted || volume === 0 ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                )}
              </button>

              <div className={styles['video-player__volume-container']}>
                <div 
                  ref={volumeTrackRef}
                  className={styles['video-player__volume-track']}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setIsDraggingVolume(true);
                    
                    // Set volume immediately on click
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                    const video = videoRef.current;
                    if (video) {
                      video.volume = pos;
                      setVolume(pos);
                      setIsMuted(pos === 0);
                    }
                  }}
                >
                  <div 
                    className={styles['video-player__volume-filled']}
                    style={{ width: `${volume * 100}%` }}
                  />
                </div>
              </div>

              {/* Subtitles - Show selector if subtitles are available */}
              {hasSubtitles && (
                <SubtitleSelector
                  currentLanguage={subtitleLanguage}
                  onLanguageChange={setSubtitleLanguage}
                />
              )}

              {/* Fullscreen */}
              <button
                className={styles['video-player__button']}
                onClick={handleFullscreen}
                aria-label="Pantalla completa"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
