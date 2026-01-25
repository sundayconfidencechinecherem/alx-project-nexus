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
  FaUsers,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
  FaPrint,
  FaFlag
} from 'react-icons/fa';
import Link from 'next/link';
import Button from '@/app/components/Button';
import CommentsSection from '@/app/components/CommentsSection';
import PostCard from '@/app/components/PostCard';
import { mockPosts } from '@/app/data/mockPosts';
import { Post } from '@/app/types/post';
import { Comment } from '@/app/types/comment';

// Mock comments data
const MOCK_COMMENTS: Comment[] = [
  {
    id: 'comment-1',
    user: {
      id: 'user-1',
      name: 'Food Critic',
      username: 'foodcritic',
      avatar: '/images/persons/chef1.png',
      isVerified: true,
    },
    content: 'This looks absolutely delicious! Could you share the exact measurements for the spices?',
    likes: 42,
    isLiked: false,
    replies: 2,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    repliesList: [
      {
        id: 'reply-1',
        user: {
          id: 'me',
          name: 'Your Name',
          username: 'yourusername',
          avatar: '/images/persons/person3.png',
          isVerified: false,
        },
        content: 'Sure! I used 1 tsp of paprika, 1/2 tsp of cumin, and 1/4 tsp of cayenne pepper.',
        likes: 8,
        isLiked: true,
        replies: 0,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
      {
        id: 'reply-2',
        user: {
          id: 'user-3',
          name: 'Home Cook',
          username: 'homecook',
          avatar: '/images/persons/person1.png',
          isVerified: false,
        },
        content: 'I tried this recipe and it turned out amazing! Thanks for sharing!',
        likes: 15,
        isLiked: false,
        replies: 0,
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
      },
    ],
  },
  {
    id: 'comment-2',
    user: {
      id: 'user-2',
      name: 'Chef Expert',
      username: 'chefexpert',
      avatar: '/images/persons/chef2.png',
      isVerified: true,
    },
    content: 'Great technique! Have you tried using fresh herbs instead of dried? Makes a huge difference.',
    likes: 28,
    isLiked: true,
    replies: 1,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: 'comment-3',
    user: {
      id: 'user-4',
      name: 'Beginner Cook',
      username: 'beginnercook',
      avatar: '/images/persons/person2.png',
      isVerified: false,
    },
    content: 'This seems a bit complicated for me. Any tips for beginners?',
    likes: 12,
    isLiked: false,
    replies: 0,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
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

  useEffect(() => {
    setIsLoading(true);
    
    // Find the post by ID
    const foundPost = mockPosts.find(p => p.id === postId);
    
    if (foundPost) {
      setPost(foundPost);
      setIsLiked(foundPost.isLiked);
      setIsSaved(foundPost.isSaved);
      
      // Get related posts (same cuisine or tags)
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
        name: 'Your Name',
        username: 'yourusername',
        avatar: '/images/persons/person3.png',
        isVerified: false,
      },
      content,
      likes: 0,
      isLiked: false,
      replies: 0,
      createdAt: new Date(),
    };
    setComments([newComment, ...comments]);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, isLiked: !comment.isLiked, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1 }
        : comment
    ));
  };

  const handleReplyToComment = (commentId: string, content: string) => {
    console.log(`Replying to ${commentId}: ${content}`);
    // In real app, this would update the comment's replies
  };

  const formatDate = (dateInput: Date | string) => {
    // Convert to Date object if it's a string
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-app-bg py-8">
        <div className="container mx-auto px-4">
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
      <div className="min-h-screen bg-app-bg py-8">
        <div className="container mx-auto px-4 text-center">
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
    <div className="min-h-screen bg-app-bg py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="outline"
            icon={<FaArrowLeft />}
            onClick={() => router.back()}
          >
            Back
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <div className="bg-surface rounded-xl shadow-lg overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.caption}
                className="w-full h-auto max-h-[600px] object-cover"
              />
              
              {/* Image Actions Overlay */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={handleShare}
                  className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
                  title="Share"
                >
                  <FaShare />
                </button>
                <button
                  onClick={() => window.print()}
                  className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
                  title="Print"
                >
                  <FaPrint />
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4 mt-4">
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
          <div className="space-y-8">
            {/* Post Header */}
            <div className="bg-surface rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Link href={`/profile/${post.user.id}`}>
                    <img
                      src={post.user.avatar}
                      alt={post.user.name}
                      className="w-12 h-12 rounded-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
                    />
                  </Link>
                  <div>
                    <Link 
                      href={`/profile/${post.user.id}`}
                      className="flex items-center gap-1 hover:opacity-80"
                    >
                      <span className="font-bold text-text-primary">{post.user.name}</span>
                      {post.user.isVerified && (
                        <span className="text-xs px-1.5 py-0.5 bg-primary text-white rounded-full">✓</span>
                      )}
                    </Link>
                    <div className="text-sm text-text-secondary">
                      @{post.user.username} • {formatDate(post.createdAt)}
                    </div>
                  </div>
                </div>
                <button className="p-2 text-text-tertiary hover:text-text-primary">
                  <FaFlag />
                </button>
              </div>

              <h1 className="text-2xl font-bold text-text-primary mb-4">
                {post.caption.split('\n')[0]}
              </h1>

              <p className="text-text-primary whitespace-pre-line mb-6">
                {post.caption}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Food Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {post.cuisine && (
                  <div className="flex items-center gap-2">
                    <FaUtensils className="text-primary" />
                    <div>
                      <div className="text-sm text-text-secondary">Cuisine</div>
                      <div className="font-medium text-text-primary">{post.cuisine}</div>
                    </div>
                  </div>
                )}
                {post.prepTime && (
                  <div className="flex items-center gap-2">
                    <FaClock className="text-primary" />
                    <div>
                      <div className="text-sm text-text-secondary">Prep Time</div>
                      <div className="font-medium text-text-primary">{post.prepTime}</div>
                    </div>
                  </div>
                )}
                {post.difficulty && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-xs text-white">D</span>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary">Difficulty</div>
                      <div className="font-medium text-text-primary">{post.difficulty}</div>
                    </div>
                  </div>
                )}
                {post.calories && (
                  <div className="flex items-center gap-2">
                    <FaFire className="text-primary" />
                    <div>
                      <div className="text-sm text-text-secondary">Calories</div>
                      <div className="font-medium text-text-primary">{post.calories}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Location */}
              {post.location && (
                <div className="flex items-center gap-2 text-text-secondary mb-6">
                  <FaMapMarkerAlt />
                  <span>{post.location}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-border">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : 'text-text-secondary hover:text-text-primary'}`}
                  >
                    <FaHeart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
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
                  <FaBookmark className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <CommentsSection
              comments={comments}
              postId={postId}
              onAddComment={handleAddComment}
              onLikeComment={handleLikeComment}
              onReplyToComment={handleReplyToComment}
            />

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="bg-surface rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-text-primary mb-6">
                  Related Posts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <div
                      key={relatedPost.id}
                      className="bg-surface-hover rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => router.push(`/post/${relatedPost.id}`)}
                    >
                      <img
                        src={relatedPost.imageUrl}
                        alt={relatedPost.caption}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <p className="text-text-primary line-clamp-2 text-sm mb-2">
                          {relatedPost.caption}
                        </p>
                        <div className="flex items-center justify-between text-xs text-text-secondary">
                          <span>{relatedPost.cuisine}</span>
                          <span>{relatedPost.likes.toLocaleString()} likes</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
