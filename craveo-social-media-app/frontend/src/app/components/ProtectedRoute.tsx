'use client';

import { useEffect, useState } from 'react';
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
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Add a small delay to ensure auth state is properly loaded
    const timer = setTimeout(() => {
      setChecked(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!checked || isLoading) {
      return;
    }

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
      // For now, just pass through
    }
  }, [isAuthenticated, isLoading, user, requireAuth, requireVerified, requireAdmin, router, pathname, redirectTo, checked]);

  // Show loading
  if (isLoading || !checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show content if authenticated (or if auth not required)
  if (!requireAuth || isAuthenticated) {
    return <>{children}</>;
  }

  // Show redirecting message
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  );
}
