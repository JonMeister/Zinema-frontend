/**
 * Minimal app entry component with rudimentary client-side routing.
 *
 * It selects between the landing page and the signup page based on
 * `window.location.pathname`. For a production app, replace with a real router.
 */
import React from 'react';
import { LandingPage } from '@/modules/landing/components/LandingPage';
import { SignupPage } from '@/modules/auth/components/SignupPage';
import { ToastProvider } from '@/shared/components/ToastProvider';

export function App(): JSX.Element {
  // Simple routing based on current path
  const currentPath = window.location.pathname;
  
  const page = currentPath === '/signup' ? <SignupPage /> : <LandingPage />;
  
  return (
    <ToastProvider>
      {page}
    </ToastProvider>
  );
}


