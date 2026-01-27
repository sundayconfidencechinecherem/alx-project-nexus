'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  isVerified: boolean;
  followers: number;
  following: number;
  posts: number;
  createdAt: string | Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

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
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_FROM_STORAGE'; payload: { user: User | null; tokens: AuthTokens | null } };

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
    case 'LOAD_FROM_STORAGE':
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isAuthenticated: !!(action.payload.user && action.payload.tokens),
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
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock API functions
const mockLogin = async (credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user: User = {
    id: 'user-' + Date.now(),
    username: credentials.email.split('@')[0],
    email: credentials.email,
    fullName: 'Test User',
    avatar: '/images/persons/person3.png',
    isVerified: true,
    followers: 1248,
    following: 256,
    posts: 34,
    createdAt: new Date(),
  };

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
    avatar: '/images/persons/person.png',
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
          
          dispatch({
            type: 'LOAD_FROM_STORAGE',
            payload: { user, tokens },
          });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Failed to load auth state');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadAuthState();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'LOGIN_REQUEST' });
      
      const { user, tokens } = await mockLogin(credentials);
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
      if (credentials.rememberMe) {
        localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
      }
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, tokens } });
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  // Register function
  const register = async (data: RegisterData) => {
    try {
      dispatch({ type: 'REGISTER_REQUEST' });
      
      const { user, tokens } = await mockRegister(data);
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
      
      dispatch({ type: 'REGISTER_SUCCESS', payload: { user, tokens } });
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed';
      dispatch({ type: 'REGISTER_FAILURE', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKENS);
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
    dispatch({ type: 'LOGOUT' });
  };

  // Update user
  const updateUser = (user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  // Update tokens
  const updateTokens = (tokens: AuthTokens) => {
    localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
    dispatch({ type: 'UPDATE_TOKENS', payload: tokens });
  };

  // Clear error
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
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
