'use client';

import { useState } from 'react';
import { FaHeart, FaComment, FaShare, FaBookmark, FaEllipsisH, FaExternalLinkAlt, FaCheck } from 'react-icons/fa';
import { Post } from '../types/post';
import Link from 'next/link';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onSave?: (postId: string) => void;
}

export default function PostCard({ post, onLike, onComment, onShare, onSave }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [showMoreActions, setShowMoreActions] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(post.id);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.(post.id);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-surface rounded-xl shadow-lg overflow-hidden border border-border hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="p-4 border-b border-divider">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href={`/profile/${post.user.id.replace('user-', '')}`}>
              <div className="relative cursor-pointer">
                <img
                  src={post.user.avatar}
                  alt={post.user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {post.user.isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-surface flex items-center justify-center">
                    <FaCheck className="w-2 h-2 text-white" />
                  </div>
                )}
              </div>
            </Link>
            
            <div>
              <Link 
                href={`/profile/${post.user.id.replace('user-', '')}`}
                className="flex items-center gap-1 hover:opacity-80"
              >
                <span className="font-semibold text-text-primary">{post.user.name}</span>
                {post.user.isVerified && (
                  <span className="text-xs px-1.5 py-0.5 bg-primary text-white rounded-full">✓</span>
                )}
              </Link>
              
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <span>@{post.user.username}</span>
                <span className="w-1 h-1 bg-text-tertiary rounded-full"></span>
                <Link 
                  href={`/post/${post.id}`}
                  className="hover:text-text-primary"
                >
                  {formatDate(post.createdAt)}
                </Link>
                {post.location && (
                  <>
                    <span className="w-1 h-1 bg-text-tertiary rounded-full"></span>
                    <span className="flex items-center gap-1">
                      <span>{post.location}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowMoreActions(!showMoreActions)}
              className="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-surface-hover"
            >
              <FaEllipsisH />
            </button>
            
            {showMoreActions && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-surface border border-border rounded-lg shadow-lg z-10">
                <Link 
                  href={`/post/${post.id}`}
                  className="block w-full text-left px-4 py-3 text-sm text-text-primary hover:bg-surface-hover flex items-center gap-2"
                >
                  <FaExternalLinkAlt className="w-3 h-3" />
                  View post details
                </Link>
                <button className="w-full text-left px-4 py-3 text-sm text-text-primary hover:bg-surface-hover">
                  Copy link
                </button>
                <button className="w-full text-left px-4 py-3 text-sm text-error hover:bg-surface-hover">
                  Report post
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image with link to single post */}
      <Link href={`/post/${post.id}`}>
        <div className="relative cursor-pointer">
          <img
            src={post.imageUrl}
            alt={post.caption}
            className="w-full h-64 object-cover hover:opacity-95 transition-opacity"
          />
        </div>
      </Link>

      {/* Actions */}
      <div className="p-4 border-b border-divider">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 ${isLiked ? 'text-red-500' : 'text-text-secondary hover:text-text-primary'}`}
            >
              <FaHeart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
              <span className="font-medium">{post.likes.toLocaleString()}</span>
            </button>
            
            <Link href={`/post/${post.id}`}>
              <button className="flex items-center space-x-2 text-text-secondary hover:text-text-primary">
                <FaComment className="w-6 h-6" />
                <span className="font-medium">{post.comments.toLocaleString()}</span>
              </button>
            </Link>
            
            <button
              onClick={() => onShare?.(post.id)}
              className="flex items-center space-x-2 text-text-secondary hover:text-text-primary"
            >
              <FaShare className="w-6 h-6" />
              <span className="font-medium">{post.shares.toLocaleString()}</span>
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

      {/* Content */}
      <div className="p-4">
        <div className="space-y-3">
          <Link href={`/post/${post.id}`}>
            <p className="text-text-primary whitespace-pre-line line-clamp-2 hover:text-primary cursor-pointer">
              {post.caption}
            </p>
          </Link>
          
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link 
                key={tag}
                href={`/explore?tag=${tag}`}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 cursor-pointer"
              >
                #{tag}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {post.cuisine && (
              <div className="flex items-center gap-2">
                <span className="text-text-secondary">Cuisine:</span>
                <span className="font-medium text-text-primary">{post.cuisine}</span>
              </div>
            )}
            {post.prepTime && (
              <div className="flex items-center gap-2">
                <span className="text-text-secondary">Prep Time:</span>
                <span className="font-medium text-text-primary">{post.prepTime}</span>
              </div>
            )}
            {post.difficulty && (
              <div className="flex items-center gap-2">
                <span className="text-text-secondary">Difficulty:</span>
                <span className="font-medium text-text-primary">{post.difficulty}</span>
              </div>
            )}
            {post.calories && (
              <div className="flex items-center gap-2">
                <span className="text-text-secondary">Calories:</span>
                <span className="font-medium text-text-primary">{post.calories}</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-divider">
            <Link href={`/post/${post.id}`}>
              <button className="text-text-secondary hover:text-text-primary text-sm">
                View all {post.comments.toLocaleString()} comments
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
