/**
 * Props interface for PublicRoute component.
 */
import React, { useEffect } from 'react';
import { useIsAuthenticated } from '../stores/authStore';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Public route wrapper component for unauthenticated-only pages.
 *
 * Checks user authentication status using Zustand store and redirects authenticated users
 * to the home page. Renders children components only for unauthenticated users.
 * Uses useEffect to handle redirects properly in React lifecycle.
 * 
 * @component
 * @param {PublicRouteProps} props - Component props
 * @param {React.ReactNode} props.children - Components to render if not authenticated
 * @param {string} [props.redirectTo='/home'] - Redirect destination for authenticated users
 * @returns {JSX.Element} Either children components or redirect message
 * 
 * @example
 * ```tsx
 * <PublicRoute>
 *   <LoginPage />
 * </PublicRoute>
 * ```
 */
export function PublicRoute({ 
  children, 
  redirectTo = '/home' 
}: PublicRouteProps): JSX.Element {
  const isAuthenticated = useIsAuthenticated();
  
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, redirectTo]);

  // If authenticated, show loading while redirecting
  if (isAuthenticated) {
    return <div>Redirecting...</div>;
  }

  return <>{children}</>;
}
