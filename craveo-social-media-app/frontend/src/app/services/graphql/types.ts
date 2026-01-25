// GraphQL Type Definitions
// These types should match your GraphQL schema
// In a real project, these would be auto-generated using GraphQL Code Generator

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  bio?: string;
  isVerified: boolean;
  followers: number;
  following: number;
  posts: number;
  createdAt: string;
}

export interface Post {
  id: string;
  user: User;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
  tags: string[];
  location?: string;
  cuisine?: string;
  prepTime?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  calories?: number;
  servings?: number;
}

export interface Comment {
  id: string;
  user: User;
  content: string;
  likes: number;
  isLiked: boolean;
  replies: number;
  createdAt: string;
  repliesList?: Comment[];
}

export interface PaginatedPosts {
  posts: Post[];
  hasMore: boolean;
  totalCount: number;
  page: number;
}

export interface PaginatedComments {
  comments: Comment[];
  hasMore: boolean;
  totalCount: number;
  page: number;
}

// Input Types
export interface CreatePostInput {
  image: File;
  caption: string;
  tags: string[];
  cuisine?: string;
  prepTime?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  calories?: number;
  servings?: number;
  location?: string;
}

export interface CreateCommentInput {
  postId: string;
  content: string;
  parentCommentId?: string;
}

export interface UpdatePostInput {
  caption?: string;
  tags?: string[];
  cuisine?: string;
  prepTime?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  calories?: number;
  servings?: number;
  location?: string;
}

// Response Types
export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface LikeResponse {
  success: boolean;
  message: string;
  likes: number;
  isLiked: boolean;
}

export interface SaveResponse {
  success: boolean;
  message: string;
  isSaved: boolean;
}

// Filter Types
export interface PostFilters {
  cuisine?: string;
  tags?: string[];
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  minCalories?: number;
  maxCalories?: number;
  sortBy?: 'recent' | 'popular' | 'trending';
  userId?: string;
}

// Query/Mutation Response Types
export interface QueryResponse<T> {
  data: T;
  loading: boolean;
  error?: Error;
}

export interface MutationResponse<T> {
  data?: T;
  loading: boolean;
  error?: Error;
  called: boolean;
}
