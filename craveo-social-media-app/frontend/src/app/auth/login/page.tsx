
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaGoogle, FaApple } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  if (isAuthenticated && !isLoading) {
    router.push('/');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.success && data.user) {
        // Store user data
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        
        // Call login from auth context
        await login({
          email: formData.email,
          password: formData.password,
          rememberMe: false
        });
        
        // Redirect to home
        router.push('/');
        router.refresh();
        
      } else {
        throw new Error(data.message || 'Login failed');
      }
      
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-app-bg via-surface to-surface">
      {/* Desktop Layout  */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Column - Logo & Hero Text */}
        <div className="flex-1 flex items-center justify-center px-12 xl:px-20">
          <div className="max-w-2xl -mt-[200px]">
            {/* Logo */}
            <div className="relative w-[400px] h-[400px] mx-auto">
              <Image
                src="/craveologo.png"
                alt="Craveo Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            
            {/* Hero Text */}
            <div className="space-y-8 text-left">
              <h1 className="text-4xl xl:text-5xl font-black text-text-primary leading-tight">
                Discover delicious foods  
                <p className="block text-primary mt-4">and experiences</p>
                from people around the world.
              </h1>
            </div>

            {/* Desktop Footer */}
            <div className="absolute bottom-8 left-12 right-12">
              <p className="text-text-tertiary text-sm text-center">
                © 2026 Craveo All Rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Login Form */}
        <div className="flex-1 flex items-center justify-center px-12 xl:px-20">
          <div className="w-full max-w-md">
            <div className="bg-surface border border-border rounded-lg p-10 shadow-2xl">
             
              <h2 className="text-4xl font-black text-text-primary text-center leading-tight mb-4">
                Sign In 
              </h2>
              
              <p className="text-base font-medium text-text-secondary mb-8 text-center">
                Welcome back to Craveo! See what's happening in the world of food right now.
              </p>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                  <strong>Error:</strong> {error}
                </div>
              )}

              {/* Email Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-text-primary mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
                    placeholder="test@example.com"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-text-primary">
                      Password
                    </label>
                    <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
                    placeholder="any password"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-lg transition-all text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

               {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-6 bg-surface text-text-secondary text-lg font-medium">or</span>
                </div>
              </div>
              

              {/* Social Login Buttons */}
              <div className="space-y-4 mb-8">
                <button
                  onClick={() => alert('Google login would go here')}
                  disabled={loading}
                  className="w-full bg-white border-2 border-border hover:bg-gray-50 text-text-primary font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-4 transition-all shadow-sm"
                >
                  <FaGoogle className="text-green-500 text-2xl" />
                  <span>Continue with Google</span>
                </button>
              </div>

             

              {/* Sign Up Link */}
              <div>
                <p className="text-center text-text-secondary text-lg">
                  Don't have an account?{' '}
                  <Link href="/auth/register" className="text-primary font-bold hover:underline">
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Tablet Layout */}
      <div className="hidden md:flex lg:hidden min-h-screen flex-col items-center justify-center px-8">
        {/* Logo & Hero Section */}
        <div className="mb-12">
          {/* Logo  */}
          <div className="relative w-[300px] h-[300px] mx-auto">
            <Image
              src="/craveologo.png"
              alt="Craveo Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          
          {/* Hero Text */}
          <div className="text-center space-y-8 max-w-2xl">
            <h1 className="text-5xl font-black text-text-primary leading-tight">
              Sign In 
              <span className="block font-medium text-text-secondary text-3xl mt-6">
                Welcome back to Craveo! See what's happening in the world of food right now.
              </span>
            </h1>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Email Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              {/* Email */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-text-primary"> Email  </label>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
                  placeholder="test@example.com"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-text-primary">
                    Password
                  </label>
                  <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
                  placeholder="any password"
                  required
                  disabled={loading}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-all text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

             {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-surface text-text-secondary font-medium">or</span>
              </div>
            </div>

             {/* Social Login Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => alert('Google login would go here')}
                disabled={loading}
                className="w-full bg-white border-2 border-border hover:bg-gray-50 text-text-primary font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-3 transition-all shadow-sm"  >
                <FaGoogle className="text-green-500 text-xl" />
                <span>Continue with Google</span>
              </button>

            </div>
            {/* Sign Up Link */}
            <div>
              <p className="text-center text-text-secondary">  Don't have an account?{' '} <Link href="/auth/register" className="text-primary font-bold hover:underline"> Sign Up  </Link>  </p>
            </div>
          </div>
        </div>

        {/* Tablet Footer */}
        <div className="mt-10 text-center">
          <p className="text-text-tertiary text-sm">
            © 2026 Craveo All Rights reserved.
          </p>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen flex flex-col items-center justify-center px-6 py-8">
        {/* Logo & Hero Section */}
        <div className="mb-10">
          {/* Logo  */}
          <div className="relative w-[200px] h-[200px] mx-auto">
            <Image
              src="/craveologo.png"
              alt="Craveo Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          
          {/* Hero Text */}
          <div className="text-center space-y-8 max-w-md">
            <h1 className="text-4xl font-bold text-text-primary leading-tight">
              Sign In 
              <p className="block font-medium text-text-secondary text-base mt-3">
                Welcome back to Craveo! See what's happening in the world of food right now.
              </p>
            </h1>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}

           

            {/* Email Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              {/* Email */}
              <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-text-primary mb-2">
                    Email
                    </label>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
                  placeholder="test@example.com"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-text-primary">
                    Password
                  </label>
                  <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
                  placeholder="any password"
                  required
                  disabled={loading}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-lg transition-all text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-app-bg text-text-secondary font-medium">or</span>
              </div>
            </div>

             {/* Social Login Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => alert('Google login would go here')}
                disabled={loading}
                className="w-full bg-white border-2 border-border hover:bg-gray-50 text-text-primary font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-all shadow-sm"
              >
                <FaGoogle className="text-green-500 text-xl" />
                <span>Continue with Google</span>
              </button>
            </div>


            {/* Sign Up Link */}
            <div>
              <p className="text-center text-text-secondary">
                Don't have an account?{' '}
                <Link href="/auth/register" className="text-primary font-bold hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="text-center">
          <p className="text-text-tertiary text-xs">
            © 2026 Craveo All Rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}