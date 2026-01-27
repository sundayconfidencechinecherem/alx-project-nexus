'use client';

import React from 'react';
import { isUsingMockData } from '../services/apollo-client';
import { mockGraphQL } from '../services/graphql/mockService';

// Define operation types
type OperationVariables = Record<string, any>;

/**
 * Universal GraphQL hook 
 */
export const useGraphQL = () => {
  const useMock = isUsingMockData();

  // For mock data,
  if (useMock) {
    return {
      // Mock queries
      useFeedPosts: (variables?: { page: number; limit: number }) => {
        const [data, setData] = React.useState<any>(null);
        const [loading, setLoading] = React.useState(true);
        const [error, setError] = React.useState<any>(null);

        React.useEffect(() => {
          const fetchData = async () => {
            try {
              setLoading(true);
              const result = await mockGraphQL.queries.getFeedPosts(
                variables?.page || 1,
                variables?.limit || 10
              );
              setData({ feedPosts: result });
            } catch (err) {
              setError(err);
            } finally {
              setLoading(false);
            }
          };
          fetchData();
        }, [variables?.page, variables?.limit]);

        return {
          data,
          loading,
          error,
          refetch: () => Promise.resolve({ data }),
        };
      },

      useCurrentUser: () => {
        const [data, setData] = React.useState<any>(null);
        const [loading, setLoading] = React.useState(true);
        const [error, setError] = React.useState<any>(null);

        React.useEffect(() => {
          const fetchData = async () => {
            try {
              setLoading(true);
              const user = await mockGraphQL.queries.getCurrentUser();
              setData({ currentUser: user });
            } catch (err) {
              setError(err);
            } finally {
              setLoading(false);
            }
          };
          fetchData();
        }, []);

        return {
          data,
          loading,
          error,
          refetch: () => Promise.resolve({ data }),
        };
      },

      usePostDetails: (postId: string) => {
        const [data, setData] = React.useState<any>(null);
        const [loading, setLoading] = React.useState(true);
        const [error, setError] = React.useState<any>(null);

        React.useEffect(() => {
          const fetchData = async () => {
            try {
              setLoading(true);
              const post = await mockGraphQL.queries.getPostDetails(postId);
              setData({ post });
            } catch (err) {
              setError(err);
            } finally {
              setLoading(false);
            }
          };
          fetchData();
        }, [postId]);

        return {
          data,
          loading,
          error,
          refetch: () => Promise.resolve({ data }),
        };
      },

      useUserProfile: (userId: string) => {
        const [data, setData] = React.useState<any>(null);
        const [loading, setLoading] = React.useState(true);
        const [error, setError] = React.useState<any>(null);

        React.useEffect(() => {
          const fetchData = async () => {
            try {
              setLoading(true);
              const user = await mockGraphQL.queries.getUserProfile(userId);
              setData({ user });
            } catch (err) {
              setError(err);
            } finally {
              setLoading(false);
            }
          };
          fetchData();
        }, [userId]);

        return {
          data,
          loading,
          error,
          refetch: () => Promise.resolve({ data }),
        };
      },

      // Mock mutations
      useLikePost: () => {
        const [loading, setLoading] = React.useState(false);
        const [error, setError] = React.useState<any>(null);

        const mutate = async (variables: { postId: string }) => {
          try {
            setLoading(true);
            const result = await mockGraphQL.mutations.likePost(variables.postId);
            return { data: { likePost: result } };
          } catch (err) {
            setError(err);
            throw err;
          } finally {
            setLoading(false);
          }
        };

        return [mutate, { loading, error }];
      },

      useSavePost: () => {
        const [loading, setLoading] = React.useState(false);
        const [error, setError] = React.useState<any>(null);

        const mutate = async (variables: { postId: string }) => {
          try {
            setLoading(true);
            const result = await mockGraphQL.mutations.savePost(variables.postId);
            return { data: { savePost: result } };
          } catch (err) {
            setError(err);
            throw err;
          } finally {
            setLoading(false);
          }
        };

        return [mutate, { loading, error }];
      },

      useCreateComment: () => {
        const [loading, setLoading] = React.useState(false);
        const [error, setError] = React.useState<any>(null);

        const mutate = async (variables: { postId: string; content: string }) => {
          try {
            setLoading(true);
            const result = await mockGraphQL.mutations.createComment(
              variables.postId,
              variables.content
            );
            return { data: { createComment: result } };
          } catch (err) {
            setError(err);
            throw err;
          } finally {
            setLoading(false);
          }
        };

        return [mutate, { loading, error }];
      },

      useFollowUser: () => {
        const [loading, setLoading] = React.useState(false);
        const [error, setError] = React.useState<any>(null);

        const mutate = async (variables: { userId: string }) => {
          try {
            setLoading(true);
            const result = await mockGraphQL.mutations.followUser(variables.userId);
            return { data: { followUser: result } };
          } catch (err) {
            setError(err);
            throw err;
          } finally {
            setLoading(false);
          }
        };

        return [mutate, { loading, error }];
      },

      useCreatePost: () => {
        const [loading, setLoading] = React.useState(false);
        const [error, setError] = React.useState<any>(null);

        const mutate = async (variables: any) => {
          try {
            setLoading(true);
            // Mock post creation
            const result = {
              id: `post-${Date.now()}`,
              ...variables,
              likes: 0,
              comments: 0,
              isLiked: false,
              isSaved: false,
              createdAt: new Date().toISOString(),
              user: await mockGraphQL.queries.getCurrentUser(),
            };
            return { data: { createPost: result } };
          } catch (err) {
            setError(err);
            throw err;
          } finally {
            setLoading(false);
          }
        };

        return [mutate, { loading, error }];
      },

      // Utility
      isUsingMockData: true,
    };
  }

  // If not using mock data, return empty hooks for now
  return {
    // Queries
    useFeedPosts: () => ({ 
      data: { feedPosts: { posts: [], hasMore: false, totalCount: 0, page: 1 } }, 
      loading: false, 
      error: null,
      refetch: () => Promise.resolve()
    }),
    
    useCurrentUser: () => ({ 
      data: { currentUser: null }, 
      loading: false, 
      error: null,
      refetch: () => Promise.resolve()
    }),
    
    usePostDetails: () => ({ 
      data: { post: null }, 
      loading: false, 
      error: null,
      refetch: () => Promise.resolve()
    }),
    
    useUserProfile: () => ({ 
      data: { user: null }, 
      loading: false, 
      error: null,
      refetch: () => Promise.resolve()
    }),

    // Mutations
    useLikePost: () => [
      () => Promise.resolve({ data: { likePost: { success: true, likes: 0, isLiked: true } } }),
      { loading: false, error: null }
    ],
    
    useSavePost: () => [
      () => Promise.resolve({ data: { savePost: { success: true, isSaved: true } } }),
      { loading: false, error: null }
    ],
    
    useCreateComment: () => [
      () => Promise.resolve({ data: { createComment: null } }),
      { loading: false, error: null }
    ],
    
    useFollowUser: () => [
      () => Promise.resolve({ data: { followUser: { success: true, isFollowing: true, followers: 0 } } }),
      { loading: false, error: null }
    ],
    
    useCreatePost: () => [
      () => Promise.resolve({ data: { createPost: null } }),
      { loading: false, error: null }
    ],

    // Utility
    isUsingMockData: false,
  };
};
