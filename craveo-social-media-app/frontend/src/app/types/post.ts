export interface User {
  id: string
  name: string
  username: string
  avatar: string
  isVerified?: boolean
  followers?: number
  following?: number
}

export interface Post {
  id: string
  user: User
  imageUrl: string
  caption: string
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  isSaved: boolean
  createdAt: Date | string
  tags: string[]
  location?: string
  cuisine?: string
  prepTime?: string
  difficulty?: 'Easy' | 'Medium' | 'Hard'
  calories?: number
  servings?: number
}

export interface Comment {
  id: string
  user: User
  content: string
  likes: number
  createdAt: Date | string
  replies?: Comment[]
}

export interface Like {
  id: string
  user: User
  postId: string
  createdAt: Date
}
