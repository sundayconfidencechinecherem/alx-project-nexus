// src/app/post/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  FaHeart, 
  FaComment, 
  FaShare, 
  FaBookmark, 
  FaArrowLeft,
  FaUtensils,
  FaClock,
  FaFire,
  FaMapMarkerAlt,
  FaPrint,
  FaFlag,
  FaRegHeart,
  FaRegBookmark,
  FaChevronLeft,
  FaTimes
} from 'react-icons/fa';
import Link from 'next/link';
import Button from '@/app/components/Button';
import CommentsSection from '@/app/components/CommentsSection';
import { mockPosts } from '@/app/data/mockPosts';
import { Post } from '@/app/types/post';
import { Comment } from '@/app/types/comment';

// Mock comments data
const MOCK_COMMENTS: Comment[] = [
  {
    id: 'comment-1',
    user: {
      id: 'user-1',
      username: 'foodcritic',
      email: 'critic@example.com',
      fullName: 'Food Critic',
      avatar: '/images/persons/chef1.png',
      isVerified: true,
      followers: 1000,
      following: 200,
      posts: 50,
      createdAt: new Date().toISOString(),
    },
    content: 'This looks absolutely delicious! Could you share the exact measurements?',
    likes: 42,
    isLiked: false,
    replies: 2,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
];

export default function SinglePostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [showImageFullscreen, setShowImageFullscreen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    
    // Find the post by ID
    const foundPost = mockPosts.find(p => p.id === postId);
    
    if (foundPost) {
      setPost(foundPost);
      setIsLiked(foundPost.isLiked);
      setIsSaved(foundPost.isSaved);
      
      // Get related posts
      const related = mockPosts
        .filter(p => 
          p.id !== postId && 
          (p.cuisine === foundPost.cuisine || 
           p.tags.some(tag => foundPost.tags.includes(tag)))
        )
        .slice(0, 3);
      setRelatedPosts(related);
    }
    
    setIsLoading(false);
  }, [postId]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (post) {
      setPost({
        ...post,
        likes: isLiked ? post.likes - 1 : post.likes + 1,
      });
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.caption || 'Check out this post',
        text: post?.caption,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleAddComment = (content: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      user: {
        id: 'me',
        username: 'yourusername',
        email: 'you@example.com',
        fullName: 'Your Name',
        avatar: '/images/persons/person3.png',
        isVerified: false,
        followers: 1248,
        following: 256,
        posts: 34,
        createdAt: new Date().toISOString(),
      },
      content,
      likes: 0,
      isLiked: false,
      replies: 0,
      createdAt: new Date(),
    };
    setComments([newComment, ...comments]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-app-bg pt-16 lg:pt-0 lg:ml-64">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            {/* Back button skeleton */}
            <div className="h-8 w-24 bg-gray-300 rounded" />
            
            {/* Post skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-300 rounded-xl" />
              <div className="space-y-4">
                <div className="h-8 w-3/4 bg-gray-300 rounded" />
                <div className="h-4 w-1/2 bg-gray-300 rounded" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-full" />
                  <div className="h-4 bg-gray-300 rounded w-5/6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-app-bg pt-16 lg:pt-0 lg:ml-64">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold text-text-primary mb-4">Post not found</h1>
          <p className="text-text-secondary mb-6">The post you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/')}>
            Back to Feed
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-bg">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-border p-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-surface-hover rounded-full"
        >
          <FaChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-text-primary">Post</h1>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block fixed top-0 left-64 right-0 z-50 bg-white border-b border-border p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Button
            variant="outline"
            icon={<FaArrowLeft />}
            onClick={() => router.back()}
            className="text-sm"
          >
            Back
          </Button>
          <h1 className="text-xl font-bold text-text-primary">Post Details</h1>
          <div className="w-24"></div> {/* Spacer for balance */}
        </div>
      </div>

      {/* Content with proper navbar spacing */}
      <div className="pt-16 lg:pt-20 lg:ml-64">
        <div className="container mx-auto px-4 py-4 lg:py-8 max-w-6xl">
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column - Image */}
            <div className="lg:sticky lg:top-24 lg:h-fit">
              {/* Image Container */}
              <div className="bg-surface rounded-xl shadow-lg overflow-hidden relative">
                <img
                  src={post.imageUrl}
                  alt={post.caption}
                  className="w-full h-auto max-h-[500px] lg:max-h-[600px] object-cover cursor-pointer"
                  onClick={() => setShowImageFullscreen(true)}
                />
                
                {/* Image Actions Overlay */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button
                    onClick={handleShare}
                    className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
                    title="Share"
                  >
                    <FaShare className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
                    title="Print"
                  >
                    <FaPrint className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Stats - Mobile */}
              <div className="lg:hidden grid grid-cols-4 gap-3 mt-4">
                <div className="bg-surface rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-text-primary">{post.likes > 999 ? `${(post.likes/1000).toFixed(1)}k` : post.likes}</div>
                  <div className="text-xs text-text-secondary">Likes</div>
                </div>
                <div className="bg-surface rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-text-primary">{post.comments > 999 ? `${(post.comments/1000).toFixed(1)}k` : post.comments}</div>
                  <div className="text-xs text-text-secondary">Comments</div>
                </div>
                <div className="bg-surface rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-text-primary">{post.shares > 999 ? `${(post.shares/1000).toFixed(1)}k` : post.shares}</div>
                  <div className="text-xs text-text-secondary">Shares</div>
                </div>
                <div className="bg-surface rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-text-primary">{post.servings}</div>
                  <div className="text-xs text-text-secondary">Servings</div>
                </div>
              </div>

              {/* Quick Stats - Desktop */}
              <div className="hidden lg:grid grid-cols-4 gap-4 mt-6">
                <div className="bg-surface rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-text-primary">{post.likes.toLocaleString()}</div>
                  <div className="text-sm text-text-secondary">Likes</div>
                </div>
                <div className="bg-surface rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-text-primary">{post.comments.toLocaleString()}</div>
                  <div className="text-sm text-text-secondary">Comments</div>
                </div>
                <div className="bg-surface rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-text-primary">{post.shares.toLocaleString()}</div>
                  <div className="text-sm text-text-secondary">Shares</div>
                </div>
                <div className="bg-surface rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-text-primary">{post.servings}</div>
                  <div className="text-sm text-text-secondary">Servings</div>
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="space-y-6 lg:space-y-8">
              {/* Post Header */}
              <div className="bg-surface rounded-xl shadow-lg p-4 lg:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Link href={`/profile/${post.user.id}`}>
                      <img
                        src={post.user.avatar}
                        alt={post.user.fullName}
                        className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
                      />
                    </Link>
                    <div>
                      <Link 
                        href={`/profile/${post.user.id}`}
                        className="flex items-center gap-1 hover:opacity-80"
                      >
                        <span className="font-bold text-text-primary text-sm lg:text-base">{post.user.fullName}</span>
                        {post.user.isVerified && (
                          <span className="text-xs px-1.5 py-0.5 bg-primary text-white rounded-full">✓</span>
                        )}
                      </Link>
                      <div className="text-xs lg:text-sm text-text-secondary">
                        @{post.user.username}
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-text-tertiary hover:text-text-primary">
                    <FaFlag className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>
                </div>

                <p className="text-text-primary whitespace-pre-line mb-4 lg:mb-6 text-sm lg:text-base">
                  {post.caption}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4 lg:mb-6">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 lg:px-3 py-1 lg:py-1.5 bg-primary/10 text-primary rounded-full text-xs lg:text-sm hover:bg-primary/20 cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Food Details */}
                <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-4 lg:mb-6">
                  {post.cuisine && (
                    <div className="flex items-center gap-2">
                      <FaUtensils className="text-primary w-3 h-3 lg:w-4 lg:h-4" />
                      <div>
                        <div className="text-xs lg:text-sm text-text-secondary">Cuisine</div>
                        <div className="font-medium text-text-primary text-sm lg:text-base">{post.cuisine}</div>
                      </div>
                    </div>
                  )}
                  {post.prepTime && (
                    <div className="flex items-center gap-2">
                      <FaClock className="text-primary w-3 h-3 lg:w-4 lg:h-4" />
                      <div>
                        <div className="text-xs lg:text-sm text-text-secondary">Prep Time</div>
                        <div className="font-medium text-text-primary text-sm lg:text-base">{post.prepTime}</div>
                      </div>
                    </div>
                  )}
                  {post.difficulty && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-xs text-white">D</span>
                      </div>
                      <div>
                        <div className="text-xs lg:text-sm text-text-secondary">Difficulty</div>
                        <div className="font-medium text-text-primary text-sm lg:text-base">{post.difficulty}</div>
                      </div>
                    </div>
                  )}
                  {post.calories && (
                    <div className="flex items-center gap-2">
                      <FaFire className="text-primary w-3 h-3 lg:w-4 lg:h-4" />
                      <div>
                        <div className="text-xs lg:text-sm text-text-secondary">Calories</div>
                        <div className="font-medium text-text-primary text-sm lg:text-base">{post.calories}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Location */}
                {post.location && (
                  <div className="flex items-center gap-2 text-text-secondary mb-4 lg:mb-6 text-sm">
                    <FaMapMarkerAlt className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span>{post.location}</span>
                  </div>
                )}

                {/* Actions - Mobile */}
                <div className="lg:hidden flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleLike}
                      className={`flex flex-col items-center gap-1 ${isLiked ? 'text-red-500' : 'text-text-secondary hover:text-red-500'}`}
                    >
                      {isLiked ? (
                        <FaHeart className="w-6 h-6 fill-current" />
                      ) : (
                        <FaRegHeart className="w-6 h-6" />
                      )}
                      <span className="text-xs">Like</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-text-secondary hover:text-blue-500">
                      <FaComment className="w-6 h-6" />
                      <span className="text-xs">Comment</span>
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex flex-col items-center gap-1 text-text-secondary hover:text-green-500"
                    >
                      <FaShare className="w-6 h-6" />
                      <span className="text-xs">Share</span>
                    </button>
                  </div>
                  <button
                    onClick={handleSave}
                    className={`flex flex-col items-center gap-1 ${isSaved ? 'text-yellow-500' : 'text-text-secondary hover:text-yellow-500'}`}
                  >
                    {isSaved ? (
                      <FaBookmark className="w-6 h-6 fill-current" />
                    ) : (
                      <FaRegBookmark className="w-6 h-6" />
                    )}
                    <span className="text-xs">Save</span>
                  </button>
                </div>

                {/* Actions - Desktop */}
                <div className="hidden lg:flex items-center justify-between pt-6 border-t border-border">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : 'text-text-secondary hover:text-text-primary'}`}
                    >
                      {isLiked ? (
                        <FaHeart className="w-6 h-6 fill-current" />
                      ) : (
                        <FaRegHeart className="w-6 h-6" />
                      )}
                      <span className="font-medium">Like</span>
                    </button>
                    <button className="flex items-center gap-2 text-text-secondary hover:text-text-primary">
                      <FaComment className="w-6 h-6" />
                      <span className="font-medium">Comment</span>
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 text-text-secondary hover:text-text-primary"
                    >
                      <FaShare className="w-6 h-6" />
                      <span className="font-medium">Share</span>
                    </button>
                  </div>
                  <button
                    onClick={handleSave}
                    className={`${isSaved ? 'text-yellow-500' : 'text-text-secondary hover:text-text-primary'}`}
                  >
                    {isSaved ? (
                      <FaBookmark className="w-6 h-6 fill-current" />
                    ) : (
                      <FaRegBookmark className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <CommentsSection
                comments={comments}
                postId={postId}
                onAddComment={handleAddComment}
              />

            
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {showImageFullscreen && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
          <button
            onClick={() => setShowImageFullscreen(false)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
          >
            <FaTimes className="w-6 h-6" />
          </button>
          <img
            src={post.imageUrl}
            alt={post.caption}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}