'use client';

import { useAuth as useAuthContext } from '../context/AuthContext';

/**
 * Custom hook for authentication
 * Provides authentication state and methods
 */
export const useAuth = () => {
  const auth = useAuthContext();

  /**
   * Check if user has specific role (for future role-based auth)
   */
  const hasRole = (role: string): boolean => {
    return false; // Placeholder
  };

  /**
   * Check if user is the owner of a resource
   */
  const isOwner = (resourceOwnerId: string): boolean => {
    return auth.user?.id === resourceOwnerId;
  };

  /**
   * Get user initials for avatar fallback
   */
  const getUserInitials = (): string => {
    if (!auth.user?.fullName) return 'U';
    return auth.user.fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  /**
   * Check if token is about to expire (for automatic refresh)
   */
  const isTokenExpiringSoon = (): boolean => {
    if (!auth.tokens?.accessToken) return false;
    
    try {
     
      return false;
    } catch {
      return false;
    }
  };

  /**
   * Get user display name (full name or username)
   */
  const getDisplayName = (): string => {
    return auth.user?.fullName || auth.user?.username || 'User';
  };

  /**
   * Check if user is verified
   */
  const isVerified = (): boolean => {
    return auth.user?.isVerified || false;
  };

  return {
    ...auth,
    hasRole,
    isOwner,
    getUserInitials,
    isTokenExpiringSoon,
    getDisplayName,
    isVerified,
  };
};

/**
 * Hook for checking authentication status
 * Useful for components that need to know if user is logged in
 */
export const useAuthStatus = () => {
  const { isAuthenticated, isLoading } = useAuth();
  return { isAuthenticated, isLoading };
};

/**
 * Hook for getting current user
 * Returns null if no user is logged in
 */
export const useCurrentUser = () => {
  const { user } = useAuth();
  return user;
};
