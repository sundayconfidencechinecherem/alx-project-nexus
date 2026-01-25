'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Post } from '../types/post'
import { 
  FaHeart, FaRegHeart, FaComment, FaShareAlt, 
  FaBookmark, FaRegBookmark, FaEllipsisV,
  FaClock, FaMapMarkerAlt, FaUsers, FaFire,
  FaUtensils, FaCheck
} from 'react-icons/fa'

interface PostCardProps {
  post: Post
  onLike?: (postId: string) => void
  onComment?: (postId: string) => void
  onShare?: (postId: string) => void
  onSave?: (postId: string) => void
}

export default function PostCard({ post, onLike, onComment, onShare, onSave }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [isSaved, setIsSaved] = useState(post.isSaved)
  const [likeCount, setLikeCount] = useState(post.likes)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
    onLike?.(post.id)
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    onSave?.(post.id)
  }

  const handleComment = () => {
    onComment?.(post.id)
  }

  const handleShare = () => {
    onShare?.(post.id)
  }

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDifficultyColor = () => {
    switch (post.difficulty) {
      case 'Easy': return 'bg-success'
      case 'Medium': return 'bg-warning'
      case 'Hard': return 'bg-error'
      default: return 'bg-text-tertiary'
    }
  }

  return (
    <div className="bg-surface rounded-xl shadow-lg overflow-hidden border border-border hover:shadow-xl transition-shadow duration-300">
      {/* Post Header */}
      <div className="p-4 border-b border-divider">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                <Image 
                  src={post.user.avatar} 
                  alt={post.user.name}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              {post.user.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <FaCheck className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-text-primary">{post.user.name}</h3>
                <span className="text-text-tertiary">•</span>
                <span className="text-text-tertiary text-sm">{formatDate(post.createdAt)}</span>
              </div>
              <p className="text-text-secondary text-sm">@{post.user.username}</p>
            </div>
          </div>
          <button className="p-2 hover:bg-surface-hover rounded-full transition-colors">
            <FaEllipsisV className="w-5 h-5 text-text-tertiary" />
          </button>
        </div>
      </div>

      {/* Post Image */}
      <div className="relative h-96 bg-gray-100">
        <Image
          src={post.imageUrl}
          alt={post.caption}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={post.id === '1'} // Load first image immediately
        />
      </div>

      {/* Post Actions */}
      <div className="p-4 border-b border-divider">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${isLiked ? 'text-primary' : 'text-text-primary hover:text-primary'}`}
            >
              {isLiked ? (
                <FaHeart className="w-6 h-6 fill-current" />
              ) : (
                <FaRegHeart className="w-6 h-6" />
              )}
              <span className="font-medium">{likeCount.toLocaleString()}</span>
            </button>

            <button
              onClick={handleComment}
              className="flex items-center space-x-2 p-2 rounded-lg text-text-primary hover:text-primary transition-colors"
            >
              <FaComment className="w-6 h-6" />
              <span className="font-medium">{post.comments.toLocaleString()}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center space-x-2 p-2 rounded-lg text-text-primary hover:text-primary transition-colors"
            >
              <FaShareAlt className="w-6 h-6" />
              <span className="font-medium">{post.shares.toLocaleString()}</span>
            </button>
          </div>

          <button
            onClick={handleSave}
            className={`p-2 rounded-lg transition-colors ${isSaved ? 'text-primary' : 'text-text-primary hover:text-primary'}`}
          >
            {isSaved ? (
              <FaBookmark className="w-6 h-6 fill-current" />
            ) : (
              <FaRegBookmark className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4">
        <div className="mb-4">
          <p className="text-text-primary">
            <span className="font-semibold">{post.user.username}</span>
            {' '}
            {post.caption}
          </p>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-light text-primary rounded-full text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Post Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-text-secondary">
          {post.cuisine && (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-primary-light flex items-center justify-center">
                <FaUtensils className="w-3 h-3 text-primary" />
              </div>
              <span>{post.cuisine}</span>
            </div>
          )}

          {post.prepTime && (
            <div className="flex items-center space-x-2">
              <FaClock className="w-4 h-4" />
              <span>{post.prepTime}</span>
            </div>
          )}

          {post.difficulty && (
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getDifficultyColor()}`} />
              <span>{post.difficulty}</span>
            </div>
          )}

          {post.location && (
            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt className="w-4 h-4" />
              <span>{post.location}</span>
            </div>
          )}

          {post.servings && (
            <div className="flex items-center space-x-2">
              <FaUsers className="w-4 h-4" />
              <span>{post.servings} servings</span>
            </div>
          )}

          {post.calories && (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-primary-light flex items-center justify-center">
                <FaFire className="w-3 h-3 text-primary" />
              </div>
              <span>{post.calories} cal</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
