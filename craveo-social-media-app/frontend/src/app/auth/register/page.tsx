'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaUser, FaEnvelope, FaLock, FaCheck } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/app/components/Input';
import Button from '@/app/components/Button';
import { useAuth } from '@/app/hooks/useAuth';
import { RegisterData } from '@/app/types/auth';
import { AuthRoute } from "@/app/components/AuthRoute";;

interface RegisterFormValues extends RegisterData {
  confirmPassword: string;
  agreeToTerms: boolean;
}

export default function RegisterPage() {
  const [authError, setAuthError] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const { register: authRegister, isLoading } = useAuth();
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<RegisterFormValues>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      agreeToTerms: false,
    },
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  // Check password strength
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
    return strength;
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setAuthError('');
    
    try {
      // Extract only the fields needed for registration
      const registerData: RegisterData = {
        username: data.username,
        email: data.email,
        password: data.password,
        fullName: data.fullName,
      };
      
      await authRegister(registerData);
      router.push('/');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'An error occurred during registration');
    }
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength >= 75) return 'bg-success';
    if (strength >= 50) return 'bg-warning';
    if (strength >= 25) return 'bg-error/60';
    return 'bg-gray-300';
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength >= 75) return 'Strong';
    if (strength >= 50) return 'Medium';
    if (strength >= 25) return 'Weak';
    return 'Very weak';
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
            <h1 className="text-3xl font-bold text-text-primary">Join Craveo</h1>
            <p className="text-text-secondary mt-2">Create your food community account</p>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
              <p className="text-error text-sm">{authError}</p>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              icon={<FaUser />}
              error={errors.fullName?.message}
              disabled={isLoading}
              {...register('fullName', {
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
            />

            <Input
              label="Username"
              type="text"
              placeholder="johndoe"
              icon={<FaUser />}
              error={errors.username?.message}
              disabled={isLoading}
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters',
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: 'Username can only contain letters, numbers, and underscores',
                },
              })}
            />

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

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Create a strong password"
                icon={<FaLock />}
                error={errors.password?.message}
                disabled={isLoading}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                  validate: {
                    strength: (value) => checkPasswordStrength(value) >= 50 || 'Please use a stronger password',
                  },
                })}
                onChange={(e) => {
                  register('password').onChange(e);
                  checkPasswordStrength(e.target.value);
                  trigger('confirmPassword');
                }}
              />
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary">Password strength:</span>
                    <span className="font-medium">{getPasswordStrengthText(passwordStrength)}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getPasswordStrengthColor(passwordStrength)} transition-all duration-300`}
                      style={{ width: `${Math.min(passwordStrength, 100)}%` }}
                    />
                  </div>
                  <ul className="mt-2 text-xs text-text-tertiary space-y-1">
                    <li className="flex items-center">
                      <FaCheck className={`w-3 h-3 mr-2 ${password.length >= 8 ? 'text-success' : 'text-gray-400'}`} />
                      At least 8 characters
                    </li>
                    <li className="flex items-center">
                      <FaCheck className={`w-3 h-3 mr-2 ${/[A-Z]/.test(password) ? 'text-success' : 'text-gray-400'}`} />
                      Uppercase letter
                    </li>
                    <li className="flex items-center">
                      <FaCheck className={`w-3 h-3 mr-2 ${/[0-9]/.test(password) ? 'text-success' : 'text-gray-400'}`} />
                      Number
                    </li>
                    <li className="flex items-center">
                      <FaCheck className={`w-3 h-3 mr-2 ${/[^A-Za-z0-9]/.test(password) ? 'text-success' : 'text-gray-400'}`} />
                      Special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              icon={<FaLock />}
              error={errors.confirmPassword?.message}
              disabled={isLoading}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
            />

            <div className="space-y-4">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary focus:ring-2 mt-1"
                  disabled={isLoading}
                  {...register('agreeToTerms', {
                    required: 'You must agree to the terms and conditions',
                  })}
                />
                <span className="ml-2 text-sm text-text-secondary">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                  {errors.agreeToTerms && (
                    <span className="block text-error text-xs mt-1">{errors.agreeToTerms.message}</span>
                  )}
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-text-secondary">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-primary font-medium hover:text-primary-dark hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-surface border border-border rounded-lg">
            <h3 className="text-sm font-medium text-text-primary mb-2">Why join Craveo?</h3>
            <ul className="text-xs text-text-secondary space-y-1">
              <li className="flex items-center">
                <FaCheck className="w-3 h-3 text-success mr-2" />
                Share your food creations with a global community
              </li>
              <li className="flex items-center">
                <FaCheck className="w-3 h-3 text-success mr-2" />
                Discover recipes and restaurants worldwide
              </li>
              <li className="flex items-center">
                <FaCheck className="w-3 h-3 text-success mr-2" />
                Connect with food enthusiasts and chefs
              </li>
              <li className="flex items-center">
                <FaCheck className="w-3 h-3 text-success mr-2" />
                Personalized food recommendations
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AuthRoute>
  );
}
