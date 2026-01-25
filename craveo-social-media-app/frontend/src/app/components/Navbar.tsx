'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaSearch, FaPlus, FaHome, FaCompass, FaUser, FaBell, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import Button from './Button';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-surface/95 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-xl font-bold text-text-primary hidden md:block">
                Craveo
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'home' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}`}
              onClick={() => setActiveTab('home')}
            >
              <FaHome />
              <span>Home</span>
            </Link>
            
            <Link
              href="/explore"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'explore' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}`}
              onClick={() => setActiveTab('explore')}
            >
              <FaCompass />
              <span>Explore</span>
            </Link>
            
            {isAuthenticated && (
              <Link
                href="/create-post"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'create' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}`}
                onClick={() => setActiveTab('create')}
              >
                <FaPlus />
                <span>Create</span>
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-4 hidden lg:block">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search recipes, chefs, or tags..."
                className="w-full pl-10 pr-4 py-2 bg-surface-hover border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Mobile Search */}
            <button className="lg:hidden p-2 text-text-secondary hover:text-text-primary">
              <FaSearch />
            </button>

            {/* Notifications */}
            {isAuthenticated && (
              <button className="relative p-2 text-text-secondary hover:text-text-primary">
                <FaBell />
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
              </button>
            )}

            {/* Profile/Auth */}
            {isAuthenticated ? (
              <>
                <Link href="/profile/me">
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-hover cursor-pointer">
                    <img
                      src={user?.avatar || '/images/persons/person3.png'}
                      alt={user?.username || 'Profile'}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-text-primary hidden md:block">{user?.username}</span>
                  </div>
                </Link>
                
                <Button
                  variant="outline"
                  size="sm"
                  icon={<FaSignOutAlt />}
                  onClick={handleLogout}
                  className="hidden md:flex"
                >
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-text-secondary hover:text-text-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <div className="space-y-2">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-hover text-text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaHome />
                <span>Home</span>
              </Link>
              
              <Link
                href="/explore"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-hover text-text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaCompass />
                <span>Explore</span>
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link
                    href="/create-post"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-hover text-text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaPlus />
                    <span>Create Post</span>
                  </Link>
                  
                  <Link
                    href="/profile/me"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-hover text-text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUser />
                    <span>Profile</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-hover text-error"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </>
              )}
              
              {!isAuthenticated && (
                <>
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-hover text-text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Login</span>
                  </Link>
                  
                  <Link
                    href="/auth/register"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-hover text-text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
