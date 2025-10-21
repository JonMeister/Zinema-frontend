/**
 * About Us page component.
 * 
 * Displays information about InnoJI Software Development and the Zinema team.
 * Includes company mission, team members, and contact information.
 * 
 * @component
 * @returns {JSX.Element} The About Us page with company and team information
 */
import React from 'react';
import styles from './AboutUsPage.module.scss';
import { HeaderHome } from '../../home/components/HeaderHome';
import { Footer } from '../../shared/components/Footer';
import { useIsAuthenticated } from '../../../lib/stores/authStore';

/**
 * Interface representing a team member.
 */
interface TeamMember {
  name: string;
  role: string;
}

const teamMembers: TeamMember[] = [
  { name: 'Jonathan Aristizabal', role: 'Product Owner' },
  { name: 'Jhorman Gomez', role: 'Backend Developer' },
  { name: 'Jose Martinez', role: 'Full Stack Developer' },
  { name: 'Isabella Ruiz', role: 'VCS & Project Manager' },
];

export function AboutUsPage(): JSX.Element {
  const authenticated = useIsAuthenticated();

  // Set page title for screen readers
  React.useEffect(() => {
    document.title = 'Sobre Nosotros - Zinema';
  }, []);

  return (
    <div className={styles['page']}>
      {authenticated && <HeaderHome />}
      
      <main id="main-content" className={styles['main']} role="main" aria-labelledby="about-title">
        <div className={styles['container']}>
          {/* Hero Section */}
          <section className={styles['hero']} aria-labelledby="about-title">
            <h1 id="about-title" className={styles['title']}>Sobre Nosotros</h1>
            <p className={styles['subtitle']}>
              Creando experiencias de entretenimiento digital excepcionales
            </p>
          </section>

          {/* Company Section */}
          <section className={styles['company']} aria-labelledby="company-title">
            <div className={styles['company-content']}>
              <h2 id="company-title" className={styles['section-title']}>InnoJI Software Development</h2>
              <p className={styles['description']}>
                Somos un equipo apasionado de desarrolladores dedicados a crear soluciones 
                innovadoras en el mundo del entretenimiento digital. Nuestra misión es 
                proporcionar plataformas accesibles, seguras y de alta calidad que 
                transformen la manera en que las personas disfrutan del contenido audiovisual.
              </p>
              <p className={styles['description']}>
                <strong>Zinema</strong> es nuestra plataforma de streaming que permite a los 
                usuarios explorar, reproducir y valorar películas y series. Ofrecemos gestión 
                de cuentas, favoritos, calificaciones, comentarios y subtítulos, brindando una 
                experiencia completa, accesible y adaptable a distintos dispositivos.
              </p>
            </div>
          </section>

          {/* Team Section */}
          <section className={styles['team']} aria-labelledby="team-title">
            <h2 id="team-title" className={styles['section-title']}>Nuestro Equipo</h2>
            <div className={styles['team-grid']} role="list" aria-label="Miembros del equipo">
              {teamMembers.map((member, index) => (
                <article key={index} className={styles['team-card']} role="listitem">
                  <div className={styles['avatar']} role="img" aria-label={`Avatar de ${member.name}`}>
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <h3 className={styles['member-name']}>{member.name}</h3>
                  <p className={styles['member-role']}>{member.role}</p>
                </article>
              ))}
            </div>
          </section>

          {/* Values Section */}
          <section className={styles['values']} aria-labelledby="values-title">
            <h2 id="values-title" className={styles['section-title']}>Nuestros Valores</h2>
            <div className={styles['values-grid']} role="list" aria-label="Valores de la empresa">
              <article className={styles['value-card']} role="listitem">
                <div className={styles['value-icon']} role="img" aria-label="Icono de innovación">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3 className={styles['value-title']}>Innovación</h3>
                <p className={styles['value-description']}>
                  Buscamos constantemente nuevas formas de mejorar la experiencia del usuario
                </p>
              </article>

              <article className={styles['value-card']} role="listitem">
                <div className={styles['value-icon']} role="img" aria-label="Icono de colaboración">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className={styles['value-title']}>Colaboración</h3>
                <p className={styles['value-description']}>
                  Trabajamos en equipo para alcanzar objetivos comunes
                </p>
              </article>

              <article className={styles['value-card']} role="listitem">
                <div className={styles['value-icon']} role="img" aria-label="Icono de calidad">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3 className={styles['value-title']}>Calidad</h3>
                <p className={styles['value-description']}>
                  Nos comprometemos con la excelencia en cada línea de código
                </p>
              </article>

              <article className={styles['value-card']} role="listitem">
                <div className={styles['value-icon']} role="img" aria-label="Icono de seguridad">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 className={styles['value-title']}>Seguridad</h3>
                <p className={styles['value-description']}>
                  Protegemos la privacidad y datos de nuestros usuarios
                </p>
              </article>
            </div>
          </section>

          {/* CTA Section */}
          <section className={styles['cta']} aria-labelledby="cta-title">
            <h2 id="cta-title" className={styles['cta-title']}>¿Listo para comenzar?</h2>
            <p className={styles['cta-description']}>
              Únete a miles de usuarios que ya disfrutan de Zinema
            </p>
            <nav className={styles['cta-buttons']} role="navigation" aria-label="Acciones de llamado a la acción">
              {!authenticated ? (
                <>
                  <a href="/signup" className={styles['btn-primary']} aria-label="Ir a página de registro para crear cuenta">
                    Crear Cuenta
                  </a>
                  <a href="/login" className={styles['btn-secondary']} aria-label="Ir a página de inicio de sesión">
                    Iniciar Sesión
                  </a>
                </>
              ) : (
                <a href="/home" className={styles['btn-primary']} aria-label="Volver a la página de inicio">
                  Ir al Inicio
                </a>
              )}
            </nav>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

