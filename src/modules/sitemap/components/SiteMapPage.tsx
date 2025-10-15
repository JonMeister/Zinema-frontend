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

  return (
    <div className={styles['page']}>
      {authenticated && <HeaderHome />}
      
      <main className={styles['main']}>
        <div className={styles['container']}>
          {/* Header */}
          <header className={styles['header']}>
            <h1 className={styles['title']}>Mapa del Sitio</h1>
            <p className={styles['subtitle']}>
              Encuentra rápidamente todas las páginas disponibles en Zinema
            </p>
          </header>

          {/* Categories */}
          {siteMapCategories.map((category, categoryIndex) => (
            <section key={categoryIndex} className={styles['category']}>
              <div className={styles['category-header']}>
                <h2 className={styles['category-title']}>{category.title}</h2>
                <p className={styles['category-description']}>{category.description}</p>
              </div>

              <div className={styles['links-grid']}>
                {category.links.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.path}
                    className={styles['link-card']}
                    aria-label={`Ir a ${link.title}: ${link.description}`}
                  >
                    <div className={styles['link-icon']} role="img" aria-label="Icono de enlace">
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

          {/* Back to Home */}
          <div className={styles['back-home']}>
            {authenticated ? (
              <a href="/home" className={styles['btn-primary']}>
                Volver al Inicio
              </a>
            ) : (
              <a href="/landing" className={styles['btn-primary']}>
                Volver a la Página Principal
              </a>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

