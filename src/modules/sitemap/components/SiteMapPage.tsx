/**
 * Site Map page component.
 * 
 * Displays a comprehensive list of all available routes in the application.
 * Organized by category (public, authenticated, profile) for easy navigation.
 * 
 * @component
 * @returns {JSX.Element} The site map page with categorized links
 */
import React from 'react';
import styles from './SiteMapPage.module.scss';
import { HeaderHome } from '../../home/components/HeaderHome';
import { Footer } from '../../shared/components/Footer';
import { isAuthenticated } from '../../../lib/auth/useAuth';

/**
 * Interface representing a site map link.
 */
interface SiteMapLink {
  path: string;
  title: string;
  description: string;
}

/**
 * Interface representing a site map category.
 */
interface SiteMapCategory {
  title: string;
  description: string;
  links: SiteMapLink[];
}

const siteMapCategories: SiteMapCategory[] = [
  {
    title: 'Páginas Públicas',
    description: 'Páginas accesibles sin necesidad de iniciar sesión',
    links: [
      {
        path: '/landing',
        title: 'Página de Inicio',
        description: 'Página principal de bienvenida a Zinema',
      },
      {
        path: '/about',
        title: 'Sobre Nosotros',
        description: 'Información sobre InnoJI Software Development y el equipo',
      },
      {
        path: '/signup',
        title: 'Registro',
        description: 'Crear una nueva cuenta en Zinema',
      },
      {
        path: '/login',
        title: 'Iniciar Sesión',
        description: 'Acceder a tu cuenta existente',
      },
      {
        path: '/password-recovery',
        title: 'Recuperar Contraseña',
        description: 'Solicitar un enlace para restablecer tu contraseña',
      },
      {
        path: '/sitemap',
        title: 'Mapa del Sitio',
        description: 'Navegación completa del sitio web',
      },
    ],
  },
  {
    title: 'Páginas de Usuario',
    description: 'Páginas que requieren autenticación',
    links: [
      {
        path: '/home',
        title: 'Inicio',
        description: 'Página principal para usuarios autenticados',
      },
      {
        path: '/movies',
        title: 'Películas',
        description: 'Explora el catálogo de películas disponibles',
      },
      {
        path: '/series',
        title: 'Series',
        description: 'Descubre series y programas de televisión',
      },
      {
        path: '/my-list',
        title: 'Mi Lista',
        description: 'Tus películas y series guardadas',
      },
    ],
  },
  {
    title: 'Perfil de Usuario',
    description: 'Gestión de cuenta y configuración personal',
    links: [
      {
        path: '/profile',
        title: 'Mi Perfil',
        description: 'Ver información de tu cuenta',
      },
      {
        path: '/profile/edit',
        title: 'Editar Perfil',
        description: 'Actualizar tu información personal y contraseña',
      },
    ],
  },
];

export function SiteMapPage(): JSX.Element {
  const authenticated = isAuthenticated();

  // Set page title for screen readers
  React.useEffect(() => {
    document.title = 'Mapa del Sitio - Zinema';
  }, []);

  return (
    <div className={styles['page']}>
      {authenticated && <HeaderHome />}
      
      <main id="main-content" className={styles['main']} role="main" aria-labelledby="sitemap-title">
        <div className={styles['container']}>
          {/* Header */}
          <header className={styles['header']}>
            <h1 id="sitemap-title" className={styles['title']}>Mapa del Sitio</h1>
            <p className={styles['subtitle']}>
              Encuentra rápidamente todas las páginas disponibles en Zinema
            </p>
          </header>

          {/* Categories */}
          <nav aria-label="Navegación del mapa del sitio">
            {siteMapCategories.map((category, categoryIndex) => (
              <section key={categoryIndex} className={styles['category']} aria-labelledby={`category-${categoryIndex}-title`}>
                <div className={styles['category-header']}>
                  <h2 id={`category-${categoryIndex}-title`} className={styles['category-title']}>{category.title}</h2>
                  <p className={styles['category-description']}>{category.description}</p>
                </div>

                <div className={styles['links-grid']} role="list" aria-label={`Enlaces de ${category.title}`}>
                  {category.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.path}
                      className={styles['link-card']}
                      role="listitem"
                      aria-label={`${link.title}: ${link.description}`}
                    >
                      <div className={styles['link-icon']} aria-hidden="true">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </div>
                      <div className={styles['link-content']}>
                        <h3 className={styles['link-title']}>{link.title}</h3>
                        <p className={styles['link-description']}>{link.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </nav>

          {/* Back to Home */}
          <nav className={styles['back-home']} role="navigation" aria-label="Navegación de regreso">
            {authenticated ? (
              <a href="/home" className={styles['btn-primary']} aria-label="Volver a la página de inicio">
                Volver al Inicio
              </a>
            ) : (
              <a href="/landing" className={styles['btn-primary']} aria-label="Volver a la página principal de Zinema">
                Volver a la Página Principal
              </a>
            )}
          </nav>
        </div>
      </main>

      <Footer />
    </div>
  );
}

