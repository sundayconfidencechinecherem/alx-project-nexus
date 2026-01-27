/**
 * Mock GraphQL Service 
 */

import { Post, User, Comment, PaginatedPosts, PaginatedComments } from './types';
import { mockPosts } from '../../data/mockPosts';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockUsers: User[] = [
  {
    id: '1',
    username: 'chefmariag',
    email: 'maria@example.com',
    fullName: 'Chef Maria Gonzalez',
    avatar: '/images/persons/chef1.png',
    bio: 'Passionate home cook sharing recipes from around the world.',
    isVerified: true,
    followers: 12543,
    following: 342,
    posts: 87,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'kenji_lopez',
    email: 'kenji@example.com',
    fullName: 'Kenji Lopez',
    avatar: '/images/persons/chef2.png',
    bio: 'Food scientist and cooking enthusiast.',
    isVerified: true,
    followers: 89215,
    following: 156,
    posts: 203,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'me',
    username: 'currentuser',
    email: 'current@example.com',
    fullName: 'Current User',
    avatar: '/images/persons/person3.png',
    bio: 'Welcome to my food journey!',
    isVerified: false,
    followers: 1248,
    following: 256,
    posts: 34,
    createdAt: new Date().toISOString(),
  },
];

const mockComments: Comment[] = [
  {
    id: 'comment-1',
    user: mockUsers[0],
    content: 'This looks absolutely delicious! Could you share the exact measurements?',
    likes: 42,
    isLiked: false,
    replies: 2,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'comment-2',
    user: mockUsers[1],
    content: 'Great technique! Have you tried using fresh herbs instead of dried?',
    likes: 28,
    isLiked: true,
    replies: 1,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockGraphQL = {
  queries: {
    getCurrentUser: async (): Promise<User> => {
      await delay(500);
      return mockUsers[2];
    },

    getUserProfile: async (userId: string): Promise<User> => {
      await delay(500);
      const user = mockUsers.find(u => u.id === userId) || mockUsers[2];
      return user;
    },

    getFeedPosts: async (page: number, limit: number): Promise<PaginatedPosts> => {
      await delay(800);
      const start = (page - 1) * limit;
      const end = start + limit;
      const posts = mockPosts.slice(start, end).map(post => ({
        ...post,
        user: {
          ...post.user,
          email: post.user.email || '',
          fullName: post.user.fullName || '',
          posts: post.user.posts || 0,
          createdAt: typeof post.user.createdAt === 'string' 
            ? post.user.createdAt 
            : post.user.createdAt.toISOString(),
        },
        createdAt: typeof post.createdAt === 'string' 
          ? post.createdAt 
          : post.createdAt.toISOString(),
      })) as Post[];
      
      return {
        posts,
        hasMore: end < mockPosts.length,
        totalCount: mockPosts.length,
        page,
      };
    },

    getPostDetails: async (postId: string): Promise<Post> => {
      await delay(500);
      const post = mockPosts.find(p => p.id === postId);
      if (!post) throw new Error('Post not found');
      
      return {
        ...post,
        user: {
          ...post.user,
          email: post.user.email || '',
          fullName: post.user.fullName || '',
          posts: post.user.posts || 0,
          createdAt: typeof post.user.createdAt === 'string' 
            ? post.user.createdAt 
            : post.user.createdAt.toISOString(),
        },
        createdAt: typeof post.createdAt === 'string' 
          ? post.createdAt 
          : post.createdAt.toISOString(),
      } as Post;
    },

    getPostComments: async (postId: string, page: number, limit: number): Promise<PaginatedComments> => {
      await delay(600);
      const start = (page - 1) * limit;
      const end = start + limit;
      const comments = mockComments.slice(start, end);
      
      return {
        comments,
        hasMore: end < mockComments.length,
        totalCount: mockComments.length,
        page,
      };
    },

    getRelatedPosts: async (postId: string, limit: number): Promise<Post[]> => {
      await delay(400);
      return mockPosts
        .filter(p => p.id !== postId)
        .slice(0, limit)
        .map(post => ({
          ...post,
          user: {
            ...post.user,
            email: post.user.email || '',
            fullName: post.user.fullName || '',
            posts: post.user.posts || 0,
            createdAt: typeof post.user.createdAt === 'string' 
              ? post.user.createdAt 
              : post.user.createdAt.toISOString(),
          },
          createdAt: typeof post.createdAt === 'string' 
            ? post.createdAt 
            : post.createdAt.toISOString(),
        })) as Post[];
    },
  },

  mutations: {
    likePost: async (postId: string): Promise<{ likes: number; isLiked: boolean }> => {
      await delay(300);
      const post = mockPosts.find(p => p.id === postId);
      if (!post) throw new Error('Post not found');
      
      const newLikedState = !post.isLiked;
      const newLikes = newLikedState ? post.likes + 1 : post.likes - 1;
      
      return {
        likes: newLikes,
        isLiked: newLikedState,
      };
    },

    savePost: async (postId: string): Promise<{ isSaved: boolean }> => {
      await delay(300);
      const post = mockPosts.find(p => p.id === postId);
      if (!post) throw new Error('Post not found');
      
      return {
        isSaved: !post.isSaved,
      };
    },

    createComment: async (postId: string, content: string): Promise<Comment> => {
      await delay(500);
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        user: mockUsers[2],
        content,
        likes: 0,
        isLiked: false,
        replies: 0,
        createdAt: new Date().toISOString(),
      };
      
      return newComment;
    },

    followUser: async (userId: string): Promise<{ isFollowing: boolean; followers: number }> => {
      await delay(400);
      const user = mockUsers.find(u => u.id === userId);
      if (!user) throw new Error('User not found');
      
      const newFollowingState = true;
      const newFollowers = user.followers + 1;
      
      return {
        isFollowing: newFollowingState,
        followers: newFollowers,
      };
    },
  },
};

// Export hooks for components
export const useMockGraphQL = () => {
  return mockGraphQL;
};

export const shouldUseMockData = () => {
  return process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' ||
         process.env.NODE_ENV === 'development';
};
