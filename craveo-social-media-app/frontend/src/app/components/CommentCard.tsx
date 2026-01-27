'use client';
import { FaHeart, FaReply } from 'react-icons/fa';
import { useState } from 'react';
import Link from 'next/link';
import { Comment } from '../types/comment';

interface CommentCardProps {
  comment: Comment;
  isReply?: boolean;
}

export default function CommentCard({
  comment,
  isReply = false,
}: CommentCardProps) {
  const [isLiked, setIsLiked] = useState(comment.isLiked);
  const [likes, setLikes] = useState(comment.likes);

  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikes(newLikedState ? likes + 1 : likes - 1);
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
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: days > 365 ? 'numeric' : undefined
    });
  };

  return (
    <div className={`${isReply ? 'ml-12' : ''}`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <Link href={`/profile/${comment.user.id}`}>
          <div className="flex-shrink-0">
            <img
              src={comment.user.avatar}
              alt={comment.user.fullName}
              className="w-10 h-10 rounded-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
            />
          </div>
        </Link>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-surface-hover rounded-2xl rounded-tl-none p-4">
            {/* Comment Header */}
            <div className="flex items-center gap-2 mb-2">
              <Link 
                href={`/profile/${comment.user.id}`}
                className="font-semibold text-text-primary hover:opacity-80"
              >
                {comment.user.fullName}
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

            <button className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary">
              <FaReply />
              <span>Reply</span>
            </button>

            {comment.replies > 0 && (
              <button className="text-sm text-primary hover:text-primary-dark">
                View {comment.replies} {comment.replies === 1 ? 'reply' : 'replies'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
