'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  requireVerified?: boolean;
  requireAdmin?: boolean;
}

/**
 * ProtectedRoute component
 * Wraps routes that require authentication or specific permissions
 */
export default function ProtectedRoute({
  children,
  requireAuth = true,
  redirectTo = '/auth/login',
  requireVerified = false,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect during initial loading
    if (isLoading) return;

    // Check if authentication is required
    if (requireAuth && !isAuthenticated) {
      // Store the attempted URL for redirect after login
      sessionStorage.setItem('redirectAfterLogin', pathname);
      router.push(redirectTo);
      return;
    }

    // Check if user needs to be verified
    if (requireVerified && isAuthenticated && !user?.isVerified) {
      router.push('/auth/verify-email');
      return;
    }

    // Check if admin role is required (placeholder for future implementation)
    if (requireAdmin && isAuthenticated) {
      // In real app, check user roles
      // router.push('/unauthorized');
      return;
    }

    // If user is authenticated but on login/register page, redirect to home
    if (isAuthenticated && (pathname === '/auth/login' || pathname === '/auth/register')) {
      const redirect = sessionStorage.getItem('redirectAfterLogin');
      router.push(redirect || '/');
      sessionStorage.removeItem('redirectAfterLogin');
    }
  }, [isAuthenticated, isLoading, router, pathname, requireAuth, requireVerified, requireAdmin, redirectTo, user]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // Check additional requirements
  if (requireVerified && isAuthenticated && !user?.isVerified) {
    return null;
  }

  if (requireAdmin && isAuthenticated) {
    // In real app, check admin role
    return null;
  }

  return <>{children}</>;
}

/**
 * AuthRoute component - Only accessible when NOT authenticated
 * Used for login/register pages
 */
export function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

/**
 * VerifiedRoute component - Only accessible to verified users
 */
export function VerifiedRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireAuth requireVerified>
      {children}
    </ProtectedRoute>
  );
}

/**
 * AdminRoute component - Only accessible to admin users
 */
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireAuth requireAdmin>
      {children}
    </ProtectedRoute>
  );
}
