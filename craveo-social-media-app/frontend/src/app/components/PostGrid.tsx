'use client';

import { Post } from '../types/post';
import PostCard from './PostCard';
import EmptyState from './EmptyState';
import { FaImages, FaHeart, FaBookmark, FaUtensils } from 'react-icons/fa';

interface PostGridProps {
  posts: Post[];
  type: 'grid' | 'list';
  emptyState?: {
    icon: React.ReactNode;
    title: string;
    message: string;
  };
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onSave?: (postId: string) => void;
}

export default function PostGrid({
  posts,
  type = 'grid',
  emptyState,
  onLike,
  onComment,
  onShare,
  onSave,
}: PostGridProps) {
  const defaultEmptyStates = {
    posts: {
      icon: <FaImages className="w-12 h-12" />,
      title: 'No posts yet',
      message: 'When you share food posts, they will appear here.',
    },
    liked: {
      icon: <FaHeart className="w-12 h-12" />,
      title: 'No liked posts',
      message: 'Posts you like will appear here.',
    },
    saved: {
      icon: <FaBookmark className="w-12 h-12" />,
      title: 'No saved posts',
      message: 'Posts you save will appear here.',
    },
    recipes: {
      icon: <FaUtensils className="w-12 h-12" />,
      title: 'No recipes',
      message: 'Your recipes will appear here.',
    },
  };

  const activeEmptyState = emptyState || defaultEmptyStates.posts;

  if (posts.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          title={activeEmptyState.title}
          message={activeEmptyState.message}
          showAction={false}
        />
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={onLike}
            onComment={onComment}
            onShare={onShare}
            onSave={onSave}
          />
        ))}
      </div>
    );
  }

  // Grid layout
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-surface rounded-xl shadow-lg overflow-hidden border border-border hover:shadow-xl transition-shadow"
        >
          {/* Image */}
          <div className="relative aspect-square overflow-hidden">
            <img
              src={post.imageUrl}
              alt={post.caption}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity">
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onLike?.(post.id)}
                    className="flex items-center gap-1 hover:scale-110 transition-transform"
                  >
                    <FaHeart className={post.isLiked ? 'text-red-500' : ''} />
                    <span>{post.likes.toLocaleString()}</span>
                  </button>
                  <button
                    onClick={() => onComment?.(post.id)}
                    className="flex items-center gap-1 hover:scale-110 transition-transform"
                  >
                    <span>{post.comments.toLocaleString()}</span>
                  </button>
                </div>
                <button
                  onClick={() => onSave?.(post.id)}
                  className="hover:scale-110 transition-transform"
                >
                  <FaBookmark className={post.isSaved ? 'text-yellow-500' : ''} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Caption preview */}
          <div className="p-4">
            <p className="text-text-primary line-clamp-2 text-sm">
              {post.caption}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="px-2 py-1 bg-surface-hover text-text-tertiary rounded-full text-xs">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
