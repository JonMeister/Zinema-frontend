/**
 * Subtitle language selector component
 * 
 * Allows users to choose between Spanish and English subtitles
 */
import React, { useState, useRef, useEffect } from 'react';
import styles from './SubtitleSelector.module.scss';

export type SubtitleLanguage = 'es' | 'en' | 'off';

interface SubtitleSelectorProps {
  currentLanguage: SubtitleLanguage;
  onLanguageChange: (language: SubtitleLanguage) => void;
  disabled?: boolean;
}

export function SubtitleSelector({
  currentLanguage,
  onLanguageChange,
  disabled = false
}: SubtitleSelectorProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { value: SubtitleLanguage; label: string; flag: string }[] = [
    { value: 'off', label: 'Desactivados', flag: '🚫' },
    { value: 'es', label: 'Español', flag: '🇪🇸' },
    { value: 'en', label: 'English', flag: '🇬🇧' }
  ];

  const currentOption = languages.find(lang => lang.value === currentLanguage) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (language: SubtitleLanguage) => {
    onLanguageChange(language);
    setIsOpen(false);
  };

  return (
    <div 
      ref={dropdownRef}
      className={`${styles['subtitle-selector']} ${disabled ? styles['disabled'] : ''}`}
    >
      <button
        className={styles['subtitle-selector__toggle']}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        aria-label="Seleccionar idioma de subtítulos"
        disabled={disabled}
      >
        <span className={styles['subtitle-selector__flag']}>
          {currentOption.flag}
        </span>
        <span className={styles['subtitle-selector__arrow']}>
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen && (
        <div className={styles['subtitle-selector__dropdown']}>
          {languages.map((language) => (
            <button
              key={language.value}
              className={`${styles['subtitle-selector__option']} ${
                language.value === currentLanguage ? styles['active'] : ''
              }`}
              onClick={() => handleSelect(language.value)}
            >
              <span className={styles['subtitle-selector__flag']}>
                {language.flag}
              </span>
              <span className={styles['subtitle-selector__label']}>
                {language.label}
              </span>
              {language.value === currentLanguage && (
                <span className={styles['subtitle-selector__check']}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
