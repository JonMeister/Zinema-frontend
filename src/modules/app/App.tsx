/**
 * Minimal app entry component with rudimentary client-side routing.
 *
 * It selects between the landing page, signup, login, and home pages based on
 * `window.location.pathname`. For a production app, replace with a real router.
 */
import React from 'react';
import { LandingPage } from '@/modules/landing/components/LandingPage';
import { SignupPage } from '@/modules/auth/components/SignupPage';
import { LoginPage } from '@/modules/auth/components/LoginPage';
import { HomePage } from '@/modules/home/components/HomePage';
import { ToastProvider } from '@/shared/components/ToastProvider';

export function App(): JSX.Element {
  // Simple routing based on current path
  const currentPath = window.location.pathname;
  
  let page = <HomePage />;
  if (currentPath === '/landing') {
    page = <LandingPage />;
  } else if (currentPath === '/signup') {
    page = <SignupPage />;
  } else if (currentPath === '/login') {
    page = <LoginPage />;
  } else if (currentPath === '/home' || currentPath === '/') {
    page = <HomePage />;
  }
  
  return (
    <ToastProvider>
      {page}
    </ToastProvider>
  );
}


