import React, { useState, useRef, useEffect } from 'react';
import styles from './SearchBar.module.scss';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading?: boolean;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ 
  onSearch, 
  loading = false, 
  placeholder = "Buscar películas, series...",
  className = ''
}: SearchBarProps): JSX.Element {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setQuery('');
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  // Focus management for accessibility
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <div className={`${styles['search-container']} ${className}`}>
      <form 
        className={styles['search-form']} 
        onSubmit={handleSubmit}
        role="search"
        aria-label="Búsqueda de videos"
      >
        <div className={`${styles['search-input-wrapper']} ${isFocused ? styles['search-input-wrapper--focused'] : ''}`}>
          <div className={styles['search-icon']}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={styles['search-input']}
            disabled={loading}
            aria-label="Término de búsqueda"
            aria-describedby="search-help"
          />
          
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className={styles['clear-button']}
              aria-label="Limpiar búsqueda"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
          
          {loading && (
            <div className={styles['loading-spinner']} aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
              </svg>
            </div>
          )}
        </div>
        
        <button
          type="submit"
          className={styles['search-button']}
          disabled={loading || !query.trim()}
          aria-label="Realizar búsqueda"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
      </form>
      
      <div id="search-help" className={styles['search-help']}>
        Presiona <kbd>Ctrl</kbd> + <kbd>K</kbd> para buscar rápidamente
      </div>
    </div>
  );
}
