/**
 * Protected route component that redirects unauthenticated users.
 *
 * Wraps components that require authentication and redirects to login
 * if the user is not authenticated.
 */
import React from 'react';
import { isAuthenticated } from './useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  redirectTo = '/login' 
}: ProtectedRouteProps): JSX.Element {
  if (!isAuthenticated()) {
    window.location.href = redirectTo;
    return <div>Redirecting...</div>;
  }

  return <>{children}</>;
}
