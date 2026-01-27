'use client';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import PostCard from './PostCard';
import SkeletonPost from './SkeletonPost';
import EmptyState from './EmptyState';
import { Post } from '../types/post';
import { mockPosts } from '../data/mockPosts';
import PromotionScrollCard from './PromotionScrollCard';

interface FeedProps {
  initialPosts?: Post[];
  showFilters?: boolean;
}

export default function Feed({ 
  initialPosts = [], 
  showFilters = false 
}: FeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'recent' | 'popular'>('recent');
  const [error, setError] = useState<string | null>(null);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    setPosts(initialPosts);
    setPage(1);
    setHasMore(true);
  }, [initialPosts]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMorePosts();
    }
  }, [inView, hasMore, loading]);

  const loadMorePosts = async () => {
    if (posts.length <= initialPosts.length && initialPosts.length > 0) {
      setHasMore(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
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
      const fullName = `Chef ${['Maria', 'Ken', 'Sofia', 'Alex', 'Liam'][(startIndex + i) % 5]}`;
      
      newPosts.push({
        id: `mock-post-${startIndex + i + 1}`,
        user: {
          id: `mock-user-${startIndex + i + 1}`,
          username: `chef${startIndex + i + 1}`,
          email: `chef${startIndex + i + 1}@example.com`,
          fullName: fullName,
          name: fullName,
          avatar: `/images/persons/${personImage}`,
          isVerified: Math.random() > 0.5,
          followers: Math.floor(Math.random() * 10000) + 1000,
          following: Math.floor(Math.random() * 500) + 50,
          posts: Math.floor(Math.random() * 100) + 10,
          createdAt: new Date(),
          bio: `Passionate ${cuisine.toLowerCase()} cuisine chef`,
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

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1, isLiked: true }
        : post
    ));
  };

  const handleComment = (postId: string) => {
    // Handle comment logic
  };

  const handleShare = (postId: string) => {
    // Handle share logic
  };

  const handleSave = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isSaved: !post.isSaved }
        : post
    ));
  };

  const filteredPosts = [...posts].sort((a, b) => {
    if (filter === 'popular') {
      return b.likes - a.likes;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });


  const getFeedWithPromotions = () => {
    const items: Array<{ 
      type: 'post', 
      data: Post 
    } | { 
      type: 'promotion-scroll-card',
      data: null
    }> = [];
    
    filteredPosts.forEach((post, index) => {
      // Add the post
      items.push({ type: 'post', data: post });
      if ((index + 1) % 3 === 0) {
        items.push({ 
          type: 'promotion-scroll-card',
          data: null 
        });
      }
    });
    
    return items;
  };

  const feedItems = getFeedWithPromotions();

  return (
    <div className="w-full">
      {showFilters && (
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-text-secondary">Sort by:</span>
              <div className="flex bg-surface-hover rounded-lg p-1">
                <button
                  onClick={() => setFilter('recent')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === 'recent' 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-white'
                  }`}
                >
                  Recent
                </button>
                <button
                  onClick={() => setFilter('popular')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === 'popular' 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-white'
                  }`}
                >
                  Popular
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
          <p className="text-error text-sm">{error}</p>
          <button
            onClick={loadMorePosts}
            className="mt-2 text-sm text-error hover:underline font-medium"
          >
            Try again
          </button>
        </div>
      )}

      {filteredPosts.length === 0 && !loading ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          {feedItems.map((item, index) => {
            if (item.type === 'post') {
              return (
                <PostCard
                  key={`post-${item.data.id}`}
                  post={item.data}
                  onLike={handleLike}
                  onComment={handleComment}
                  onShare={handleShare}
                  onSave={handleSave}
                />
              );
            } else {
           
              return (
                <div key={`promotion-${index}`} className="my-6 xl:hidden">
                  <PromotionScrollCard />
                </div>
              );
            }
          })}

          {/* Loading Skeletons */}
          {loading && (
            <>
              <SkeletonPost />
              <SkeletonPost />
            </>
          )}

          {/* Infinite Scroll Trigger */}
          {hasMore && !loading && posts.length >= initialPosts.length && (
            <div ref={ref} className="h-16 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* End of Feed */}
          {!hasMore && posts.length > 0 && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                <span className="text-2xl">🍽️</span>
              </div>
              <p className="text-text-tertiary font-medium">You've reached the end!</p>
              <p className="text-text-secondary text-sm mt-1">Check back later for more delicious posts</p>
            </div>
          )}
        </div>
      )}

      {/* Posts Count */}
      {posts.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-text-tertiary text-sm">
            Showing <span className="font-medium text-text-primary">{posts.length}</span> delicious posts
            {initialPosts.length > 0 && (
              <span> • <span className="font-medium text-text-primary">{initialPosts.length}</span> from your activity</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}