'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaGoogle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  if (isAuthenticated && !isLoading) {
    router.push('/');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Validate terms agreement
    if (!formData.agreeToTerms) {
      setError('You must agree to the terms and conditions');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          username: formData.username,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      if (data.success && data.user) {
        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        
        // Call your auth context register function
        await register({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          username: formData.username
        });
        
        // Redirect to home
        router.push('/');
        router.refresh();
      } else {
        throw new Error(data.message || 'Registration failed');
      }
      
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-app-bg via-surface to-surface">
      {/* Desktop */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Column  */}
        <div className="flex-1 flex items-center justify-center px-12 xl:px-20">
          <div className="max-w-2xl -mt-[200px]">
            {/* Logo  */}
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

        {/* Right Column - Register Form */}
        <div className="flex-1 flex items-center justify-center px-12 xl:px-20">
          <div className="w-full max-w-lg">
            <div className="bg-surface border border-border rounded-lg p-10 shadow-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="text-center mb-10">
                <h2 className="text-4xl font-black text-text-primary leading-tight mb-4">
                  Join Craveo
                </h2>
                
                <p className="text-base font-medium text-text-secondary">
                  Create your account and start discovering delicious foods from around the world.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-8 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                  <strong>Error:</strong> {error}
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-6 mb-8">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-text-primary">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
                    placeholder="Enter your full name"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-text-primary">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
                    placeholder="Choose a username"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-text-primary">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-text-primary">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
                    placeholder="Create a password (min 6 characters)"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-text-primary">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
                    placeholder="Confirm your password"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-text-primary">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
                    required
                    disabled={loading}
                  />
                  <p className="text-xs text-text-tertiary mt-1">
                    This will not be shown publicly. Confirm your own age.
                  </p>
                </div>

                {/* Terms Agreement */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-border rounded mt-1"
                      disabled={loading}
                      required
                    />
                    <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-text-secondary">
                      I agree to the{' '}
                      <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                      ,{' '}
                      <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                      {' '}and{' '}
                      <Link href="/cookies" className="text-primary hover:underline">Cookie Use</Link>.
                    </label>
                  </div>
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
                      Creating account...
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-6 bg-surface text-text-secondary text-lg font-medium">or</span>
                </div>
              </div>

              {/* Google Register Button */}
              <div className="mb-8">
                <button
                  onClick={() => alert('Google registration would go here')}
                  disabled={loading}
                  className="w-full bg-white border-2 border-border hover:bg-gray-50 text-text-primary font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-4 transition-all shadow-sm"
                >
                  <FaGoogle className="text-green-500 text-2xl" />
                  <span>Continue with Google</span>
                </button>
              </div>

              {/* Sign In Link */}
              <div className="pt-6 border-t border-border">
                <p className="text-center text-text-secondary text-lg">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-primary font-bold hover:underline">
                    Sign In
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
        <div className="w-full max-w-xl">
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
          
          {/* Content Container */}
          <div className="bg-surface border border-border rounded-lg p-8 shadow-xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-5xl font-black text-text-primary leading-tight mb-4">
                Join Craveo
              </h1>
              
              <p className="font-medium text-text-secondary text-xl">
                Create your account and start discovering delicious foods from around the world.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6 mb-8">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
                  placeholder="Enter your full name"
                  required
                  disabled={loading}
                />
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
                  placeholder="Choose a username"
                  required
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
                  placeholder="Create a password (min 6 characters)"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
                  required
                  disabled={loading}
                />
                <p className="text-xs text-text-tertiary mt-1">
                  This will not be shown publicly. Confirm your own age.
                </p>
              </div>

              {/* Terms Agreement */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded mt-1"
                    disabled={loading}
                    required
                  />
                  <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-text-secondary">
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary hover:underline">Terms</Link>
                    ,{' '}
                    <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                    {' '}and{' '}
                    <Link href="/cookies" className="text-primary hover:underline">Cookie Use</Link>.
                  </label>
                </div>
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
                    Creating account...
                  </>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-surface text-text-secondary font-medium">or</span>
              </div>
            </div>

            {/* Google Register Button  */}
            <div className="mb-8">
              <button
                onClick={() => alert('Google registration would go here')}
                disabled={loading}
                className="w-full bg-white border-2 border-border hover:bg-gray-50 text-text-primary font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-3 transition-all shadow-sm"
              >
                <FaGoogle className="text-green-500 text-xl" />
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Sign In Link */}
            <div className="pt-6 border-t border-border">
              <p className="text-center text-text-secondary">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-primary font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          {/* Tablet Footer */}
          <div className="mt-10 text-center">
            <p className="text-text-tertiary text-sm">
              © 2026 Craveo All Rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen flex flex-col items-center justify-center px-6 py-8">
        {/* Logo & Hero Section */}
        <div className="w-full max-w-sm">
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
          
          {/* Content Container */}
          <div className="bg-surface border border-border rounded-lg p-6 shadow-xl mt-4">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-text-primary leading-tight mb-3">
                Join Craveo
              </h1>
              
              <p className="font-medium text-text-secondary text-base">
                Create your account and start discovering delicious foods.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6 mb-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
                  placeholder="Enter your full name"
                  required
                  disabled={loading}
                />
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
                  placeholder="Choose a username"
                  required
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
                  placeholder="Create a password (min 6 characters)"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
                  required
                  disabled={loading}
                />
                <p className="text-xs text-text-tertiary mt-1">
                  This will not be shown publicly. Confirm your own age.
                </p>
              </div>

              {/* Terms Agreement */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded mt-1"
                    disabled={loading}
                    required
                  />
                  <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-text-secondary">
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary hover:underline">Terms</Link>
                    ,{' '}
                    <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                    {' '}and{' '}
                    <Link href="/cookies" className="text-primary hover:underline">Cookie Use</Link>.
                  </label>
                </div>
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
                    Creating account...
                  </>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-app-bg text-text-secondary font-medium">or</span>
              </div>
            </div>

            {/* Google Register Button */}
            <div className="mb-6">
              <button
                onClick={() => alert('Google registration would go here')}
                disabled={loading}
                className="w-full bg-white border-2 border-border hover:bg-gray-50 text-text-primary font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-all shadow-sm"
              >
                <FaGoogle className="text-green-500 text-xl" />
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Sign In Link */}
            <div className="pt-6 border-t border-border">
              <p className="text-center text-text-secondary">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-primary font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          {/* Mobile Footer */}
          <div className="mt-6 text-center">
            <p className="text-text-tertiary text-xs">
              © 2026 Craveo All Rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}