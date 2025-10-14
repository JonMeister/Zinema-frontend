/**
 * Minimal app entry component with rudimentary client-side routing.
 *
 * It selects between the landing page, signup, login, and home pages based on
 * `window.location.pathname`. For a production app, replace with a real router.
 * Protected routes require authentication.
 */
import React from 'react';
import { LandingPage } from '@/modules/landing/components/LandingPage';
import { SignupPage } from '@/modules/auth/components/SignupPage';
import { LoginPage } from '@/modules/auth/components/LoginPage';
import { PasswordRecoveryPage } from '@/modules/auth/components/PasswordRecoveryPage';
import { PasswordResetPage } from '@/modules/auth/components/PasswordResetPage';
import { HomePage } from '@/modules/home/components/HomePage';
import { ProfilePage } from '@/modules/profile/components/ProfilePage';
import { EditProfilePage } from '@/modules/profile/components/EditProfilePage';
import { ToastProvider } from '@/shared/components/ToastProvider';
import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';
import { PublicRoute } from '@/lib/auth/PublicRoute';
import { isAuthenticated } from '@/lib/auth/useAuth';

export function App(): JSX.Element {
  // Simple routing based on current path
  const currentPath = window.location.pathname;
  
  let page = <LandingPage />;
  
  if (currentPath === '/landing') {
    // Public route - redirects authenticated users to home
    page = (
      <PublicRoute>
        <LandingPage />
      </PublicRoute>
    );
  } else if (currentPath === '/signup') {
    // Public route - redirects authenticated users to home
    page = (
      <PublicRoute>
        <SignupPage />
      </PublicRoute>
    );
  } else if (currentPath === '/login') {
    // Public route - redirects authenticated users to home
    page = (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    );
  } else if (currentPath === '/password-recovery') {
    // Public route - password recovery
    page = (
      <PublicRoute>
        <PasswordRecoveryPage />
      </PublicRoute>
    );
  } else if (currentPath.startsWith('/password-reset')) {
    // Public route - password reset with token
    page = (
      <PublicRoute>
        <PasswordResetPage />
      </PublicRoute>
    );
  } else if (currentPath === '/home' || currentPath === '/') {
    // Protected route - requires authentication
    page = (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    );
  } else if (currentPath === '/profile/edit') {
    // Protected route - edit profile
    page = (
      <ProtectedRoute>
        <EditProfilePage />
      </ProtectedRoute>
    );
  } else if (currentPath === '/profile') {
    // Protected route - view profile
    page = (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    );
  } else if (currentPath === '/movies' || currentPath === '/series' || currentPath === '/my-list') {
    // Protected routes - require authentication
    page = (
      <ProtectedRoute>
        <div>{currentPath} page coming soon...</div>
      </ProtectedRoute>
    );
  }
  
  return (
    <ToastProvider>
      {page}
    </ToastProvider>
  );
}


