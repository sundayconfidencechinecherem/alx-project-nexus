'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    // TODO: Implement actual login logic
    console.log('Login called with:', email)
    setTimeout(() => {
      setUser({
        id: '1',
        name: 'Test User',
        email: email
      })
      setIsLoading(false)
    }, 1000)
  }

  const logout = () => {
    setUser(null)
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    // TODO: Implement actual registration logic
    console.log('Register called with:', name, email)
    setTimeout(() => {
      setUser({
        id: '1',
        name,
        email
      })
      setIsLoading(false)
    }, 1000)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
