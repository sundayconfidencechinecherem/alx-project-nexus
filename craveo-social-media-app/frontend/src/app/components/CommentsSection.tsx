'use client';

import { useState } from 'react';
import { FaComment, FaSort } from 'react-icons/fa';
import CommentCard from './CommentCard';
import Button from './Button';
import Input from './Input';
import { Comment } from '../types/comment';

interface CommentsSectionProps {
  comments: Comment[];
  postId: string;
  onAddComment?: (content: string) => void;
}

export default function CommentsSection({
  comments,
  postId,
  onAddComment,
}: CommentsSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.likes - a.likes;
    }
    const dateA = typeof a.createdAt === 'string' ? new Date(a.createdAt) : a.createdAt;
    const dateB = typeof b.createdAt === 'string' ? new Date(b.createdAt) : b.createdAt;
    return dateB.getTime() - dateA.getTime();
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment?.(newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className="bg-surface rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FaComment className="text-primary" />
          <h3 className="text-xl font-bold text-text-primary">
            Comments ({comments.length})
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <FaSort className="text-text-tertiary" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular')}
            className="bg-surface-hover border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Liked</option>
          </select>
        </div>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary"></div>
          </div>
          <div className="flex-1">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="bg-surface-hover"
            />
            <div className="flex justify-between items-center mt-3">
              <div className="text-sm text-text-tertiary">
                Press Enter to post
              </div>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!newComment.trim()}
              >
                Post Comment
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {sortedComments.length === 0 ? (
          <div className="text-center py-8">
            <FaComment className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
            <h4 className="text-lg font-medium text-text-primary mb-2">
              No comments yet
            </h4>
            <p className="text-text-secondary">
              Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          sortedComments.map((comment) => (
            <div key={comment.id} className="space-y-4">
              <CommentCard comment={comment} />

              {/* Nested Replies */}
              {comment.repliesList && comment.repliesList.length > 0 && (
                <div className="ml-12 space-y-4">
                  {comment.repliesList.map((reply) => (
                    <CommentCard key={reply.id} comment={reply} />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
