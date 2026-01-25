'use client';

import { FaHeart, FaReply, FaEllipsisH } from 'react-icons/fa';
import { useState } from 'react';
import Link from 'next/link';

interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isVerified: boolean;
  };
  content: string;
  likes: number;
  isLiked: boolean;
  replies: number;
  createdAt: Date | string;
  isReply?: boolean;
}

interface CommentCardProps {
  comment: Comment;
  onLike?: (commentId: string) => void;
  onReply?: (commentId: string) => void;
  onShowReplies?: (commentId: string) => void;
}

export default function CommentCard({
  comment,
  onLike,
  onReply,
  onShowReplies,
}: CommentCardProps) {
  const [isLiked, setIsLiked] = useState(comment.isLiked);
  const [likes, setLikes] = useState(comment.likes);
  const [showOptions, setShowOptions] = useState(false);

  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikes(newLikedState ? likes + 1 : likes - 1);
    onLike?.(comment.id);
  };

  const handleReply = () => {
    onReply?.(comment.id);
  };

  const handleShowReplies = () => {
    onShowReplies?.(comment.id);
  };

  const formatDate = (dateInput: Date | string) => {
    // Convert to Date object if it's a string
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
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: days > 365 ? 'numeric' : undefined
    });
  };

  return (
    <div className={`${comment.isReply ? 'ml-12' : ''}`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <Link href={`/profile/${comment.user.id}`}>
          <div className="flex-shrink-0">
            <img
              src={comment.user.avatar}
              alt={comment.user.name}
              className="w-10 h-10 rounded-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
            />
          </div>
        </Link>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-surface-hover rounded-2xl rounded-tl-none p-4">
            {/* Comment Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Link 
                  href={`/profile/${comment.user.id}`}
                  className="font-semibold text-text-primary hover:opacity-80"
                >
                  {comment.user.name}
                </Link>
                {comment.user.isVerified && (
                  <span className="text-xs px-1.5 py-0.5 bg-primary text-white rounded-full">✓</span>
                )}
                <span className="text-sm text-text-secondary">
                  @{comment.user.username}
                </span>
                <span className="text-xs text-text-tertiary">
                  {formatDate(comment.createdAt)}
                </span>
              </div>

              {/* Options Button */}
              <div className="relative">
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="p-1 text-text-tertiary hover:text-text-primary rounded-full hover:bg-surface"
                >
                  <FaEllipsisH />
                </button>
                
                {showOptions && (
                  <div className="absolute right-0 top-full mt-1 w-40 bg-surface border border-border rounded-lg shadow-lg z-10">
                    <button className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-surface-hover">
                      Copy text
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-error hover:bg-surface-hover">
                      Report comment
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Comment Text */}
            <p className="text-text-primary whitespace-pre-line">
              {comment.content}
            </p>
          </div>

          {/* Comment Actions */}
          <div className="flex items-center gap-4 mt-2 ml-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-sm ${isLiked ? 'text-red-500' : 'text-text-secondary hover:text-text-primary'}`}
            >
              <FaHeart className={isLiked ? 'fill-current' : ''} />
              <span>{likes}</span>
            </button>

            <button
              onClick={handleReply}
              className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
            >
              <FaReply />
              <span>Reply</span>
            </button>

            {comment.replies > 0 && (
              <button
                onClick={handleShowReplies}
                className="text-sm text-primary hover:text-primary-dark"
              >
                View {comment.replies} {comment.replies === 1 ? 'reply' : 'replies'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
