export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  name?: string; // Add name as optional for backward compatibility
  avatar: string;
  bio?: string;
  isVerified: boolean;
  followers: number;
  following: number;
  posts: number;
  createdAt: Date | string;
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
  createdAt: Date | string;
  tags: string[];
  location?: string;
  cuisine?: string;
  prepTime?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  calories?: number;
  servings?: number;
}

// For backward compatibility, export old types as aliases
export type { User as PostUser, Post as PostType };
