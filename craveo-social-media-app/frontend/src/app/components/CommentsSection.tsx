'use client';

import { useState } from 'react';
import { FaComment, FaSort } from 'react-icons/fa';
import CommentCard from './CommentCard';
import Button from './Button';
import Input from './Input';

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
  createdAt: Date;
  repliesList?: Comment[];
}

interface CommentsSectionProps {
  comments: Comment[];
  postId: string;
  onAddComment?: (content: string) => void;
  onLikeComment?: (commentId: string) => void;
  onReplyToComment?: (commentId: string, content: string) => void;
}

export default function CommentsSection({
  comments,
  postId,
  onAddComment,
  onLikeComment,
  onReplyToComment,
}: CommentsSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.likes - a.likes;
    }
    // recent
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment?.(newComment.trim());
      setNewComment('');
    }
  };

  const handleSubmitReply = (commentId: string) => {
    if (replyContent.trim()) {
      onReplyToComment?.(commentId, replyContent.trim());
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const handleLikeComment = (commentId: string) => {
    onLikeComment?.(commentId);
  };

  const handleReplyToComment = (commentId: string) => {
    setReplyingTo(commentId);
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
              <CommentCard
                comment={comment}
                onLike={() => handleLikeComment(comment.id)}
                onReply={() => handleReplyToComment(comment.id)}
              />

              {/* Reply Form (when active) */}
              {replyingTo === comment.id && (
                <div className="ml-12">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary"></div>
                    </div>
                    <div className="flex-1">
                      <Input
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={`Replying to @${comment.user.username}...`}
                        className="bg-surface-hover text-sm"
                        autoFocus
                      />
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleSubmitReply(comment.id)}
                          disabled={!replyContent.trim()}
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Nested Replies */}
              {comment.repliesList && comment.repliesList.length > 0 && (
                <div className="ml-12 space-y-4">
                  {comment.repliesList.map((reply) => (
                    <CommentCard
                      key={reply.id}
                      comment={{ ...reply, isReply: true }}
                      onLike={() => handleLikeComment(reply.id)}
                      onReply={() => handleReplyToComment(reply.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Load More (if applicable) */}
      {comments.length > 5 && (
        <div className="text-center mt-8">
          <Button variant="outline" size="sm">
            Load More Comments
          </Button>
        </div>
      )}
    </div>
  );
}
