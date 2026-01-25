'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProfileHeader from '@/app/components/ProfileHeader';
import ProfileTabs from '@/app/components/ProfileTabs';
import PostGrid from '@/app/components/PostGrid';
import { Post } from '@/app/types/post';
import { mockPosts } from '@/app/data/mockPosts';

// Mock user data
const MOCK_USERS = {
  'me': {
    id: 'me',
    username: 'yourusername',
    fullName: 'Your Name',
    bio: 'Welcome to my food journey! Sharing my kitchen experiments and restaurant discoveries.',
    avatar: '/images/persons/person1.png',
    followers: 1248,
    following: 256,
    posts: 34,
    isVerified: false,
    isFollowing: false,
    isOwnProfile: true,
  },
  '1': {
    id: '1',
    username: 'chefmariag',
    fullName: 'Maria Gonzalez',
    bio: 'Passionate home cook sharing recipes from around the world.',
    avatar: '/images/persons/chef1.png',
    followers: 12543,
    following: 342,
    posts: 87,
    isVerified: true,
    isFollowing: false,
    isOwnProfile: false,
  },
  '2': {
    id: '2',
    username: 'kenji_lopez',
    fullName: 'Kenji Lopez',
    bio: 'Food scientist and cooking enthusiast.',
    avatar: '/images/persons/chef2.png',
    followers: 89215,
    following: 156,
    posts: 203,
    isVerified: true,
    isFollowing: true,
    isOwnProfile: false,
  },
};

type TabType = 'posts' | 'liked' | 'saved' | 'recipes';

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  
  const [user, setUser] = useState(MOCK_USERS.me);
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    // Get user data based on ID
    const userData = MOCK_USERS[userId as keyof typeof MOCK_USERS] || MOCK_USERS.me;
    setUser(userData);
    
    // Filter posts based on user
    const filteredPosts = mockPosts.filter(post => 
      post.user.id === userId || 
      (userId === 'me' && Math.random() > 0.5)
    );
    
    setUserPosts(filteredPosts);
    setIsLoading(false);
  }, [userId]);

  const handleFollow = () => {
    setUser(prev => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      followers: prev.isFollowing ? prev.followers - 1 : prev.followers + 1,
    }));
  };

  const handleEditProfile = () => {
    alert('Edit profile functionality would open here');
  };

  const handleAvatarChange = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setUser(prev => ({
        ...prev,
        avatar: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-app-bg py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="bg-surface rounded-xl shadow-lg">
              <div className="h-48 bg-gray-300 rounded-t-xl" />
              <div className="px-8 pb-8 -mt-16">
                <div className="w-40 h-40 rounded-full bg-gray-300 border-4 border-surface" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-bg py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <ProfileHeader
          user={user}
          onFollow={handleFollow}
          onEditProfile={handleEditProfile}
          onAvatarChange={handleAvatarChange}
        />
        
        <div className="mt-8 bg-surface rounded-xl shadow-lg overflow-hidden">
          <ProfileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={{ 
              posts: userPosts.length, 
              liked: Math.floor(Math.random() * 20) + 5, 
              saved: Math.floor(Math.random() * 15) + 3, 
              recipes: Math.floor(Math.random() * 10) + 2 
            }}
          />
          
          <div className="p-6">
            <PostGrid 
              posts={userPosts} 
              type={activeTab === 'posts' ? 'grid' : 'list'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
