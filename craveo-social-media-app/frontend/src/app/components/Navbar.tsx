
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaSearch, FaPlus, FaHome, FaCompass, FaUser, FaBell, FaBars, FaTimes, FaSignOutAlt, FaBookmark, FaHeart } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import Image from 'next/image';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

 
  if (!isAuthenticated) {
    return null;
  }

  // Navigation items - only show when authenticated
  const navItems = [
    { id: 'home', label: 'Home', icon: FaHome, href: '/' },
    { id: 'explore', label: 'Explore', icon: FaCompass, href: '/explore' },
    { id: 'notifications', label: 'Notifications', icon: FaBell, href: '/notifications' },
    { id: 'saved', label: 'Saved', icon: FaBookmark, href: '/saved' },
    { id: 'profile', label: 'Profile', icon: FaUser, href: '/profile/me' },
  ];

  // Bottom nav items for mobile 
  const bottomNavItems = [
    { id: 'home', label: 'Home', icon: FaHome, href: '/' },
    { id: 'explore', label: 'Explore', icon: FaCompass, href: '/explore' },
    { id: 'create', label: 'Create', icon: FaPlus, href: '/create-post' },
    { id: 'saved', label: 'Saved', icon: FaBookmark, href: '/saved' },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: FaUser, 
      href: '/profile/me',
      useAvatar: true 
    },
  ];

  return (
    <>
      {/* Left Sidebar - Desktop ONLY  */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-80 border-r border-border h-screen bg-surface/95 fixed left-0 top-0 z-40">
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          {/* Logo */}
          <div className="mb-8 px-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-32 h-10">
                <Image 
                  src="/craveologo.png" 
                  alt="craveo-logo" 
                  fill 
                  className="object-contain" 
                  priority 
                />
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-3 rounded-full transition-colors ${
                    activeTab === item.id 
                      ? 'bg-primary/10 text-primary font-semibold' 
                      : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="text-xl" />
                  <span className="text-lg">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Create Post Button */}
          <div className="mt-8 px-4">
            <Link href="/create-post">
              <button className="w-full bg-primary hover:bg-primary-dark text-white rounded-full py-3 px-6 text-lg font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg">
                <FaPlus />
                <span>Create</span>
              </button>
            </Link>
          </div>
        </div>

        {/* User Profile */}
        {user && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between p-3 rounded-full hover:bg-surface-hover transition-colors">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar || '/images/persons/person3.png'}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover border-2 border-primary/30"
                />
                <div>
                  <p className="font-semibold text-text-primary">{user.fullName || user.username}</p>
                  <p className="text-sm text-text-secondary">@{user.username}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 text-text-secondary hover:text-text-primary"
                title="Logout"
              >
                <FaSignOutAlt />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile & Tablet Top Bar */}
      <div className="lg:hidden w-full">
        <header className="fixed top-0 z-50 w-full bg-surface/95 backdrop-blur-lg border-b border-surface/20">
          <div className="px-4 h-16 flex items-center justify-between">
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="relative w-10 h-10">
                  <Image 
                    src="/craveologo.png" 
                    alt="craveo-logo" 
                    fill 
                    className="object-contain" 
                    priority 
                  />
                </div>
              </Link>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Craveo"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-hover border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary text-sm"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
              </div>
            </div>

            {/* Right: Notification + Toggle */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <Link href="/notifications" className="p-2 text-text-secondary hover:text-text-primary relative">
                <FaBell className="text-xl" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Link>
              
              {/* Toggle Menu Button */}
              <button
                className="p-2 text-text-secondary hover:text-text-primary"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile Menu Sidebar */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50" onClick={() => setIsMenuOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50"></div>
          
          {/* Menu from right */}
          <div 
            className="absolute right-0 top-0 h-full w-3/4 max-w-sm bg-surface shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full flex flex-col">
              {/* Header with user info */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-4">
                  {user && (
                    <img
                      src={user.avatar || '/images/persons/person3.png'}
                      alt={user.username}
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary"
                    />
                  )}
                  <div>
                    <p className="font-bold text-text-primary text-lg">{user?.fullName || user?.username}</p>
                    <p className="text-text-secondary">@{user?.username}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                          activeTab === item.id 
                            ? 'bg-primary/10 text-primary font-semibold' 
                            : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                        }`}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMenuOpen(false);
                        }}
                      >
                        <Icon className="text-xl" />
                        <span className="text-lg">{item.label}</span>
                      </Link>
                    );
                  })}
                  
                  {/* Separator */}
                  <div className="border-t border-border my-4"></div>
                  
                 
                  <Link
                    href="/create-post"
                    className="flex items-center gap-4 px-4 py-3 rounded-lg text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaPlus className="text-xl" />
                    <span className="text-lg">Create Post</span>
                  </Link>
                </div>
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-hover text-error font-medium"
                >
                  <FaSignOutAlt />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation - Mobile ONLY */}
      <div className="lg:hidden fixed bottom-0 z-40 w-full bg-surface/95 backdrop-blur-lg border-t border-surface/20">
        <div className="flex justify-around items-center h-16 px-2">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const useAvatar = item.useAvatar && user;
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 ${item.id === 'create' ? 'relative' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.id === 'create' ? (
                  <div className="w-14 h-14 -mt-6 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center shadow-lg">
                    <FaPlus className="text-white text-xl" />
                  </div>
                ) : useAvatar ? (
                  <>
                    <div className="relative">
                      <img
                        src={user.avatar || '/images/persons/person3.png'}
                        alt={user.username}
                        className={`w-6 h-6 rounded-full object-cover border-2 ${
                          isActive ? 'border-primary' : 'border-transparent'
                        }`}
                      />
                      {isActive && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-surface"></div>
                      )}
                    </div>
                    <span className={`text-xs mt-1 ${isActive ? 'text-primary font-medium' : 'text-text-secondary'}`}>
                      {item.label}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <Icon className={`text-xl ${isActive ? 'text-primary' : 'text-text-secondary'}`} />
                      {item.id === 'notifications' && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center">
                          3
                        </span>
                      )}
                    </div>
                    <span className={`text-xs mt-1 ${isActive ? 'text-primary font-medium' : 'text-text-secondary'}`}>
                      {item.label}
                    </span>
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}