
'use client';

import { useState } from 'react';
import { BsPatchCheckFill } from 'react-icons/bs';
import {
  FaHeart,
  FaComment,
  FaShare,
  FaBookmark,
  FaEllipsisH,
  FaExternalLinkAlt,
  FaCheck,
  FaMapMarkerAlt,
  FaClock,
  FaUtensils,
  FaGlobe,
  FaUserFriends,
  FaLock,
  FaMusic,
  FaEye
} from 'react-icons/fa';
import { Post, isRecipePost } from '../types/post';
import Link from 'next/link';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onSave?: (postId: string) => void;
}

export default function PostCard({
  post,
  onLike,
  onComment,
  onShare,
  onSave
}: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const isRecipe = isRecipePost(post);
  const isExpanded = expandedPostId === post.id;

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(post.id);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.(post.id);
  };

  const formatDate = (dateInput: Date | string) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getPrivacyIcon = () => {
    const privacy = post.privacy || 'public';
    switch (privacy) {
      case 'public':
        return <FaGlobe className="w-3 h-3 text-text-secondary" />;
      case 'friends':
        return <FaUserFriends className="w-3 h-3 text-text-secondary" />;
      case 'private':
        return <FaLock className="w-3 h-3 text-text-secondary" />;
      default:
        return <FaGlobe className="w-3 h-3 text-text-secondary" />;
    }
  };

  const needsSeeMore = !isRecipe && post.caption.length > 120;

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          
          {/* User Info */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Link href={`/profile/${post.user.id.replace('user-', '')}`} className="flex-shrink-0">
              <img
                src={post.user.avatar}
                alt={post.user.fullName}
                className="w-10 h-10 rounded-full object-cover border-2 border-primary/10"
              />
            </Link>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                
                {/* Name & Verification */}
                <div className="flex items-center gap-1">
                  <Link
                    href={`/profile/${post.user.id.replace('user-', '')}`}
                    className="inline-flex items-center gap-1 hover:opacity-80 max-w-full"
                  >
                    <span className="font-semibold text-text-primary text-sm sm:text-base truncate">
                      {post.user.fullName}
                    </span>
                    {post.user.isVerified && <BsPatchCheckFill className="text-[#1b9f20] text-sm ml-1" />}
                  </Link>
                {/* Date & Privacy */}
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-text-secondary flex-wrap ">
                  <span className=" hidden sm:inline">•</span>
                  <Link
                    href={`/post/${post.id}`}
                    className="hover:text-text-primary whitespace-nowrap"
                  >
                    {formatDate(post.createdAt)}
                  </Link>
                 {getPrivacyIcon()}
                </div>
              </div>
              </div>

              {/* Music */}
              {!isRecipe && post.music && (
                <div className="flex items-center gap-2 pt-1 text-sm text-text-secondary">
                  <FaMusic className="w-3 h-3" />
                  <span className="truncate">{post.music}</span>
                </div>
              )}

              {/* Location */}
              {post.location && (
                <div className="flex items-center gap-1 mt-1 text-sm text-text-secondary">
                  <FaMapMarkerAlt className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate max-w-[200px]">{post.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* More Actions */}
          <div className="relative flex-shrink-0 ml-2">
            <button
              onClick={() => setShowMoreActions(!showMoreActions)}
              className="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-surface-hover transition-colors"
            >
              <FaEllipsisH className="w-5 h-5" />
            </button>

            {showMoreActions && (
              <>
                <div className="fixed inset-0 z-40 md:hidden" onClick={() => setShowMoreActions(false)} />
                <div className="absolute right-0 top-full mt-1 w-48 sm:w-56 bg-surface border border-border rounded-lg shadow-lg z-50 md:z-10">
                  <Link
                    href={`/post/${post.id}`}
                    className="block w-full text-left px-4 py-3 text-sm text-text-primary hover:bg-surface-hover flex items-center gap-2"
                    onClick={() => setShowMoreActions(false)}
                  >
                    <FaExternalLinkAlt className="w-3 h-3 sm:w-4 sm:h-4" />
                    View post details
                  </Link>
                  <button
                    className="w-full text-left px-4 py-3 text-sm text-text-primary hover:bg-surface-hover"
                    onClick={() => setShowMoreActions(false)}
                  >
                    Copy link
                  </button>
                  <button
                    className="w-full text-left px-4 py-3 text-sm text-error hover:bg-surface-hover"
                    onClick={() => setShowMoreActions(false)}
                  >
                    Report post
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Image Section */}
      <Link href={`/post/${post.id}`}>
        <div className="relative cursor-pointer bg-surface-hover">
          <img
            src={post.imageUrl}
            alt={post.title || post.caption}
            className="w-full h-64 sm:h-72 md:h-80 object-cover hover:opacity-95 transition-opacity"
          />

         
          {isRecipe && (
            <div className="absolute top-3 right-3">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                <FaUtensils className="w-3 h-3" />
                <span className="font-bold text-sm">RECIPE</span>
              </div>
            </div>
          )}

          {/* Prep Time */}
          {isRecipe && post.prepTime && (
            <div className="absolute bottom-3 right-3">
              <div className="bg-surface/90 backdrop-blur-sm text-text-primary px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                <FaClock className="w-3 h-3" />
                <span className="font-bold text-sm">{post.prepTime}</span>
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-all duration-200 ${
                isLiked ? 'text-red-500' : 'text-text-secondary hover:text-red-500'
              }`}
            >
              <FaHeart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
            </button>

            <Link href={`/post/${post.id}`}>
              <button className="flex items-center space-x-2 text-text-secondary hover:text-blue-500 transition-colors">
                <FaComment className="w-6 h-6" />
              </button>
            </Link>

            <button
              onClick={() => onShare?.(post.id)}
              className="flex items-center space-x-2 text-text-secondary hover:text-green-500 transition-colors"
            >
              <FaShare className="w-6 h-6" />
            </button>
          </div>

          <button
            onClick={handleSave}
            className={`transition-all duration-200 ${
              isSaved ? 'text-yellow-500' : 'text-text-secondary hover:text-yellow-500'
            }`}
          >
            <FaBookmark className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-3 font-semibold text-text-primary text-sm">
          {post.likes > 999 ? `${(post.likes / 1000).toFixed(1)}k` : post.likes.toLocaleString()} likes
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Title */}
        {post.title && (
          <h3 className="font-bold text-text-primary text-lg truncate">{post.title}</h3>
        )}

        {/* Caption */}
        <div className="flex items-baseline">
          <span className={`text-text-primary text-sm ${!isRecipe && !isExpanded ? 'line-clamp-2' : ''}`}>
            {post.caption}
          </span>
          {needsSeeMore && (
            <button
              onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
              className="ml-1 text-text-secondary hover:text-text-primary text-sm font-medium"
            >
              {isExpanded ? 'See less' : 'See more'}
            </button>
          )}
        </div>

        {/* View Details Button */}
        {isRecipe && (
          <div className="flex justify-end pt-2">
            <Link href={`/post/${post.id}`}>
              <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:shadow">
                <FaEye className="w-3 h-3" />
                View Receipe
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
