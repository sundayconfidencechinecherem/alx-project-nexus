'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaLock, FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/app/components/Input';
import Button from '@/app/components/Button';
import { useAuth } from '@/app/hooks/useAuth';
import { LoginCredentials } from '@/app/types/auth';
import { AuthRoute } from '@/app/components/ProtectedRoute';

export default function LoginPage() {
  const [authError, setAuthError] = useState<string>('');
  const { login, isLoading } = useAuth();
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    setAuthError('');
    
    try {
      await login(data);
      // Redirect handled by AuthProvider/ProtectedRoute
      router.push('/');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'An error occurred during login');
    }
  };

  return (
    <AuthRoute>
      <div className="min-h-screen bg-app-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
              <span className="text-2xl font-bold text-white">C</span>
            </div>
            <h1 className="text-3xl font-bold text-text-primary">Welcome back</h1>
            <p className="text-text-secondary mt-2">Sign in to your Craveo account</p>
          </div>

          {/* Social Login */}
          <div className="mb-8">
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                size="lg"
                icon={<FaGoogle className="text-red-500" />}
                className="hover:shadow-sm"
                onClick={() => console.log('Google login')}
                disabled={isLoading}
              >
                Google
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon={<FaFacebook className="text-blue-600" />}
                className="hover:shadow-sm"
                onClick={() => console.log('Facebook login')}
                disabled={isLoading}
              >
                Facebook
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon={<FaApple />}
                className="hover:shadow-sm"
                onClick={() => console.log('Apple login')}
                disabled={isLoading}
              >
                Apple
              </Button>
            </div>
            
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-border"></div>
              <span className="px-4 text-sm text-text-tertiary">or continue with email</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
              <p className="text-error text-sm">{authError}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={<FaEnvelope />}
              error={errors.email?.message}
              disabled={isLoading}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              icon={<FaLock />}
              error={errors.password?.message}
              disabled={isLoading}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary focus:ring-2"
                  disabled={isLoading}
                  {...register('rememberMe')}
                />
                <span className="ml-2 text-sm text-text-secondary">Remember me</span>
              </label>
              
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:text-primary-dark hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-text-secondary">
              Don't have an account?{' '}
              <Link
                href="/auth/register"
                className="text-primary font-medium hover:text-primary-dark hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-xs text-text-tertiary text-center">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </AuthRoute>
  );
}
