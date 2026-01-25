'use client'

import PostCard from './components/PostCard'
import { mockPosts } from './data/mockPosts'

export default function Home() {
  const handleLike = (postId: string) => {
    console.log('Liked post:', postId)
  }

  const handleComment = (postId: string) => {
    console.log('Comment on post:', postId)
  }

  const handleShare = (postId: string) => {
    console.log('Share post:', postId)
  }

  const handleSave = (postId: string) => {
    console.log('Save post:', postId)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Food Feed</h1>
        <p className="text-text-secondary mt-2">Discover delicious posts from food lovers worldwide</p>
      </div>

      <div className="space-y-6">
        {mockPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            onSave={handleSave}
          />
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-text-tertiary">Showing {mockPosts.length} delicious posts</p>
      </div>
    </div>
  )
}
