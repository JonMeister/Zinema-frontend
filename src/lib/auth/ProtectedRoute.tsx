/**
 * Props interface for ProtectedRoute component.
 */
import React from 'react';
import { isAuthenticated } from './useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Protected route wrapper component for authenticated-only pages.
 *
 * Checks user authentication status and redirects unauthenticated users
 * to the login page. Renders children components only for authenticated users.
 * 
 * @component
 * @param {ProtectedRouteProps} props - Component props
 * @param {React.ReactNode} props.children - Components to render if authenticated
 * @param {string} [props.redirectTo='/login'] - Redirect destination for unauthenticated users
 * @returns {JSX.Element} Either children components or redirect message
 * 
 * @example
 * ```tsx
 * <ProtectedRoute>
 *   <HomePage />
 * </ProtectedRoute>
 * ```
 */
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
