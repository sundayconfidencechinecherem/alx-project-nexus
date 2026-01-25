'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { 
  User, 
  AuthTokens, 
  LoginCredentials, 
  RegisterData, 
  AuthState, 
  DecodedToken 
} from '../types/auth';

// Mock API functions (replace with real API calls)
const mockLogin = async (credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock user data
  const user: User = {
    id: 'me',
    username: credentials.email.split('@')[0],
    email: credentials.email,
    fullName: 'Your Name',
    avatar: '/images/persons/person3.png',
    isVerified: false,
    followers: 1248,
    following: 256,
    posts: 34,
    createdAt: new Date(),
    bio: 'Welcome to my food journey! Sharing my kitchen experiments and restaurant discoveries.',
  };

  // Mock tokens (in real app, these come from backend)
  const tokens: AuthTokens = {
    accessToken: 'mock-access-token-' + Date.now(),
    refreshToken: 'mock-refresh-token-' + Date.now(),
  };

  return { user, tokens };
};

const mockRegister = async (data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const user: User = {
    id: 'new-user-' + Date.now(),
    username: data.username,
    email: data.email,
    fullName: data.fullName,
    avatar: '/images/persons/person3.png',
    isVerified: false,
    followers: 0,
    following: 0,
    posts: 0,
    createdAt: new Date(),
  };

  const tokens: AuthTokens = {
    accessToken: 'mock-access-token-' + Date.now(),
    refreshToken: 'mock-refresh-token-' + Date.now(),
  };

  return { user, tokens };
};

// Storage keys
const STORAGE_KEYS = {
  USER: 'craveo_user',
  TOKENS: 'craveo_tokens',
  REMEMBER_ME: 'craveo_remember_me',
};

// Initial state
const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
type AuthAction =
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; tokens: AuthTokens } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_REQUEST' }
  | { type: 'REGISTER_SUCCESS'; payload: { user: User; tokens: AuthTokens } }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'UPDATE_TOKENS'; payload: AuthTokens }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
    case 'REGISTER_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    
    case 'UPDATE_TOKENS':
      return {
        ...state,
        tokens: action.payload,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    
    default:
      return state;
  }
};

// Context
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  updateTokens: (tokens: AuthTokens) => void;
  refreshToken: () => Promise<boolean>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load auth state from storage on mount
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const storedTokens = localStorage.getItem(STORAGE_KEYS.TOKENS);

        if (storedUser && storedTokens) {
          const user = JSON.parse(storedUser);
          const tokens = JSON.parse(storedTokens);

          // Check if token is expired
          if (tokens.accessToken) {
            try {
              const decoded = jwtDecode<DecodedToken>(tokens.accessToken);
              const isExpired = decoded.exp * 1000 < Date.now();

              if (isExpired) {
                // Token expired, try to refresh
                console.log('Token expired, attempting refresh...');
                // In real app, call refresh token endpoint
                localStorage.removeItem(STORAGE_KEYS.USER);
                localStorage.removeItem(STORAGE_KEYS.TOKENS);
                dispatch({ type: 'SET_LOADING', payload: false });
                return;
              }

              dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user, tokens },
              });
            } catch (error) {
              console.error('Token decode error:', error);
              localStorage.removeItem(STORAGE_KEYS.USER);
              localStorage.removeItem(STORAGE_KEYS.TOKENS);
            }
          }
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadAuthState();
  }, []);

  // Save auth state to storage when it changes
  useEffect(() => {
    if (state.user && state.tokens) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.user));
      localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(state.tokens));
    }
  }, [state.user, state.tokens]);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_REQUEST' });

    try {
      const { user, tokens } = await mockLogin(credentials);

      // Store remember me preference
      if (credentials.rememberMe) {
        localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
      } else {
        localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
      }

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, tokens },
      });
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error instanceof Error ? error.message : 'Login failed',
      });
      throw error;
    }
  };

  // Register function
  const register = async (data: RegisterData) => {
    dispatch({ type: 'REGISTER_REQUEST' });

    try {
      const { user, tokens } = await mockRegister(data);

      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: { user, tokens },
      });
    } catch (error) {
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: error instanceof Error ? error.message : 'Registration failed',
      });
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    // Clear storage
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKENS);
    
    // Clear remember me if not set
    const rememberMe = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME);
    if (!rememberMe) {
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
    }

    dispatch({ type: 'LOGOUT' });
  };

  // Update user function
  const updateUser = (user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  // Update tokens function
  const updateTokens = (tokens: AuthTokens) => {
    dispatch({ type: 'UPDATE_TOKENS', payload: tokens });
  };

  // Refresh token function (mock implementation)
  const refreshToken = async (): Promise<boolean> => {
    try {
      // In real app, call refresh token endpoint
      const newTokens: AuthTokens = {
        accessToken: 'refreshed-mock-token-' + Date.now(),
        refreshToken: 'refreshed-mock-refresh-token-' + Date.now(),
      };

      updateTokens(newTokens);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    updateTokens,
    refreshToken,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
