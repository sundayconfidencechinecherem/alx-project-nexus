'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import PostCard from './PostCard';
import SkeletonPost from './SkeletonPost';
import EmptyState from './EmptyState';
import { Post } from '../types/post';
import { mockPosts } from '../data/mockPosts';

interface FeedProps {
  initialPosts?: Post[];
  showFilters?: boolean;
}

export default function Feed({ initialPosts = [], showFilters = true }: FeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'recent' | 'popular'>('recent');
  const [error, setError] = useState<string | null>(null);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  // Load more posts when scrolled to bottom
  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMorePosts();
    }
  }, [inView, hasMore, loading]);

  // Simulate fetching posts from API
  const loadMorePosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate more mock posts
      const newPosts = generateMockPosts(page * 4, 4);
      
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      setError('Failed to load more posts. Please try again.');
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate additional mock posts
  const generateMockPosts = (startIndex: number, count: number): Post[] => {
    const newPosts: Post[] = [];
    const foodImages = ['pasta.png', 'sushi.png', 'tacos.png', 'steak.png', 'rice.png', 'vlogerfood.png'];
    const personImages = ['chef1.png', 'chef2.png', 'person1.png', 'person2.png', 'person3.png'];
    const cuisines = ['Italian', 'Japanese', 'Mexican', 'American', 'Thai', 'Indian', 'French'];
    const difficulties = ['Easy', 'Medium', 'Hard'] as const;
    
    for (let i = 0; i < count; i++) {
      const foodImage = foodImages[(startIndex + i) % foodImages.length];
      const personImage = personImages[(startIndex + i) % personImages.length];
      const cuisine = cuisines[(startIndex + i) % cuisines.length];
      const difficulty = difficulties[(startIndex + i) % difficulties.length];
      
      newPosts.push({
        id: `post-${startIndex + i + 1}`,
        user: {
          id: `user-${startIndex + i + 1}`,
          name: `Chef ${['Maria', 'Ken', 'Sofia', 'Alex', 'Liam'][(startIndex + i) % 5]}`,
          username: `chef${startIndex + i + 1}`,
          avatar: `/images/persons/${personImage}`,
          isVerified: Math.random() > 0.5,
          followers: Math.floor(Math.random() * 10000) + 1000,
          following: Math.floor(Math.random() * 500) + 50,
        },
        imageUrl: `/images/food/${foodImage}`,
        caption: `Delicious ${cuisine.toLowerCase()} cuisine! Made with love and fresh ingredients. Perfect for sharing with friends and family. 🍽️ #${cuisine} #Foodie`,
        likes: Math.floor(Math.random() * 3000) + 100,
        comments: Math.floor(Math.random() * 200) + 10,
        shares: Math.floor(Math.random() * 100) + 5,
        isLiked: Math.random() > 0.7,
        isSaved: Math.random() > 0.8,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
        tags: [cuisine, 'Foodie', 'Homemade', 'Recipe'],
        location: ['Rome, Italy', 'Tokyo, Japan', 'Mexico City', 'New York, USA', 'Paris, France'][(startIndex + i) % 5],
        cuisine,
        prepTime: `${Math.floor(Math.random() * 60) + 15} mins`,
        difficulty,
        calories: Math.floor(Math.random() * 800) + 200,
        servings: Math.floor(Math.random() * 6) + 1,
      });
    }
    
    return newPosts;
  };

  // Handle post interactions
  const handleLike = (postId: string) => {
    console.log('Liked post:', postId);
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1, isLiked: true }
        : post
    ));
  };

  const handleComment = (postId: string) => {
    console.log('Comment on post:', postId);
  };

  const handleShare = (postId: string) => {
    console.log('Share post:', postId);
  };

  const handleSave = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isSaved: !post.isSaved }
        : post
    ));
  };

  // Filter posts based on selected filter
  const filteredPosts = [...posts].sort((a, b) => {
    if (filter === 'popular') {
      return b.likes - a.likes;
    }
    // recent (default) - sort by date
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Feed Header with Filters */}
      {showFilters && (
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Food Feed</h1>
              <p className="text-text-secondary mt-2">Discover delicious posts from food lovers worldwide</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-text-secondary">Sort by:</div>
              <div className="flex bg-surface-hover rounded-lg p-1">
                <button
                  onClick={() => setFilter('recent')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'recent' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  Recent
                </button>
                <button
                  onClick={() => setFilter('popular')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'popular' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  Popular
                </button>
              </div>
            </div>
          </div>
          
          {/* Cuisine Filters */}
          <div className="mt-6">
            <div className="text-sm text-text-secondary mb-2">Filter by cuisine:</div>
            <div className="flex flex-wrap gap-2">
              {['All', 'Italian', 'Japanese', 'Mexican', 'American', 'Thai', 'Dessert'].map((cuisine) => (
                <button
                  key={cuisine}
                  className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium text-text-primary hover:bg-surface-hover transition-colors"
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
          <p className="text-error">{error}</p>
          <button
            onClick={loadMorePosts}
            className="mt-2 text-sm text-error hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Posts Grid */}
      {filteredPosts.length === 0 && !loading ? (
        <EmptyState 
          onAction={() => console.log('Create post clicked')}
        />
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
              onSave={handleSave}
            />
          ))}

          {/* Loading Skeletons */}
          {loading && (
            <>
              <SkeletonPost />
              <SkeletonPost />
            </>
          )}

          {/* Infinite scroll trigger */}
          {hasMore && !loading && (
            <div ref={ref} className="h-10 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* No more posts */}
          {!hasMore && posts.length > 0 && (
            <div className="text-center py-8">
              <p className="text-text-tertiary">You've reached the end! 🍽️</p>
              <p className="text-text-secondary text-sm mt-1">Check back later for more delicious posts</p>
            </div>
          )}
        </div>
      )}

      {/* Posts Count */}
      {posts.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-text-tertiary">Showing {posts.length} delicious posts</p>
        </div>
      )}
    </div>
  );
}
