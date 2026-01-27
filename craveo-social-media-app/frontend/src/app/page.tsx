
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import SplashScreen from './components/SplashScreen';
import LandingPage from './components/LandingPage';
import Feed from './components/Feed';
import PromotionSidebar from './components/PromotionSidebar';
import Navbar from './components/Navbar';
import { mockPosts } from './data/mockPosts';
import { FaFire, FaStar, FaUsers, FaChartLine, FaSearch } from 'react-icons/fa';

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      const splashShown = localStorage.getItem('craveo_splash_shown');
      const splashTime = localStorage.getItem('craveo_splash_time');
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (!splashShown || !splashTime || (now - parseInt(splashTime)) > twentyFourHours) {
        setShowSplash(true);
        localStorage.setItem('craveo_splash_shown', 'true');
        localStorage.setItem('craveo_splash_time', now.toString());
      }
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated && showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-app-bg">
      <Navbar />
      
      {/* RESPONSIVE LAYOUT */}
      
      {/* DESKTOP LAYOUT  */}
      <div className="hidden lg:block">
        <div className="lg:ml-64 xl:ml-80">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px]">
            {/* Main Feed Area */}
            <main className="min-h-screen border-r border-border">
              {/* Sticky Feed Header */}
              <div className="sticky top-0 z-30 bg-app-bg/95 backdrop-blur-lg border-b border-border">
               
                
                {/* Feed Tabs */}
                <div className="flex">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium text-primary border-b-2 border-primary">
                    <FaFire className="text-primary" />
                    <span>For You</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover">
                    <FaUsers className="text-text-tertiary" />
                    <span>Following</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover">
                    <FaStar className="text-text-tertiary" />
                    <span>Highlights</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover">
                    <FaChartLine className="text-text-tertiary" />
                    <span>Trending</span>
                  </button>
                </div>
              </div>

              {/* Feed Content */}
              <div className="p-6">
                <Feed initialPosts={mockPosts} showFilters={false} />
              </div>
            </main>

            {/* Right Sidebar - Desktop ONLY */}
            <aside className="hidden xl:block">
              <div className="sticky top-0 h-screen flex flex-col">
                {/* Search Bar - Fixed height */}
                <div className="flex-shrink-0 p-4 border-b border-border bg-app-bg">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search Craveo"
                      className="w-full pl-10 pr-4 py-3 bg-surface-hover border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
                  </div>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4">
                    <PromotionSidebar />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* TABLET LAYOUT  */}
      <div className="hidden md:block lg:hidden">
        <div className="pt-16"> 
          {/* Feed Tabs - Tablet */}
          <div className="sticky top-16 z-30 bg-app-bg/95 backdrop-blur-lg border-b border-border">
            <div className="flex overflow-x-auto scrollbar-hide">
              <button className="flex-1 px-6 py-4 text-sm font-medium text-primary border-b-2 border-primary text-center">
                For You
              </button>
              <button className="flex-1 px-6 py-4 text-sm font-medium text-text-secondary hover:text-text-primary text-center">
                Following
              </button>
              <button className="flex-1 px-6 py-4 text-sm font-medium text-text-secondary hover:text-text-primary text-center">
                Highlights
              </button>
              <button className="flex-1 px-6 py-4 text-sm font-medium text-text-secondary hover:text-text-primary text-center">
                Trending
              </button>
            </div>
          </div>

          {/* Feed Content - Tablet */}
          <div className="p-6">
            <Feed initialPosts={mockPosts} showFilters={false} />
          </div>
        </div>
      </div>

      {/* MOBILE LAYOUT  */}
      <div className="md:hidden">
        <div className="pt-16 pb-20"> 
          {/* Feed Tabs - Mobile */}
          <div className="sticky top-16 z-30 bg-app-bg/95 backdrop-blur-lg border-b border-border">
            <div className="flex overflow-x-auto scrollbar-hide">
              <button className="flex-1 px-4 py-4 text-sm font-medium text-primary border-b-2 border-primary text-center">
                For You
              </button>
              <button className="flex-1 px-4 py-4 text-sm font-medium text-text-secondary hover:text-text-primary text-center">
                Following
              </button>
              <button className="flex-1 px-4 py-4 text-sm font-medium text-text-secondary hover:text-text-primary text-center">
                Highlights
              </button>
              <button className="flex-1 px-4 py-4 text-sm font-medium text-text-secondary hover:text-text-primary text-center">
                Trending
              </button>
            </div>
          </div>

          {/* Feed Content - Mobile */}
          <div className="p-4">
            <Feed initialPosts={mockPosts} showFilters={false} />
          </div>
        </div>
      </div>
    </div>
  );
}