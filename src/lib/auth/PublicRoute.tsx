/**
 * Public route component that redirects authenticated users.
 *
 * Wraps components that should only be accessible to unauthenticated users
 * and redirects to home if the user is already authenticated.
 */
import React, { useEffect } from 'react';
import { isAuthenticated } from './useAuth';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function PublicRoute({ 
  children, 
  redirectTo = '/home' 
}: PublicRouteProps): JSX.Element {
  useEffect(() => {
    if (isAuthenticated()) {
      window.location.href = redirectTo;
    }
  }, [redirectTo]);

  // If authenticated, show loading while redirecting
  if (isAuthenticated()) {
    return <div>Redirecting...</div>;
  }

  return <>{children}</>;
}
