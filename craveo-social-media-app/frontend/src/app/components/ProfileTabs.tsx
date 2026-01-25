'use client';

import { useState } from 'react';
import { FaImages, FaHeart, FaBookmark, FaUtensils } from 'react-icons/fa';

type TabType = 'posts' | 'liked' | 'saved' | 'recipes';

interface ProfileTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  counts: {
    posts: number;
    liked: number;
    saved: number;
    recipes: number;
  };
}

export default function ProfileTabs({
  activeTab,
  onTabChange,
  counts,
}: ProfileTabsProps) {
  const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
    { id: 'posts', label: 'Posts', icon: <FaImages /> },
    { id: 'liked', label: 'Liked', icon: <FaHeart /> },
    { id: 'saved', label: 'Saved', icon: <FaBookmark /> },
    { id: 'recipes', label: 'Recipes', icon: <FaUtensils /> },
  ];

  return (
    <div className="border-b border-border">
      <div className="flex space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative
              ${activeTab === tab.id
                ? 'text-primary'
                : 'text-text-secondary hover:text-text-primary'
              }
            `}
          >
            {tab.icon}
            <span>{tab.label}</span>
            <span className="ml-1 px-2 py-0.5 bg-surface-hover rounded-full text-xs">
              {counts[tab.id]}
            </span>
            
            {/* Active indicator */}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
