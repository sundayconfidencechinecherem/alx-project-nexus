'use client';

import { useQuery, useMutation, useLazyQuery, useSubscription, ApolloError } from '@apollo/client';
import { 
  GET_FEED_POSTS, 
  GET_POST_DETAILS, 
  GET_POST_COMMENTS,
  GET_USER_POSTS,
  GET_LIKED_POSTS,
  GET_SAVED_POSTS,
  GET_CURRENT_USER,
  GET_USER_PROFILE,
  GET_RELATED_POSTS,
  SEARCH_POSTS,
  GET_TRENDING_TAGS,
  GET_CUISINE_STATS
} from '../services/graphql/queries';
import {
  LIKE_POST_MUTATION,
  UNLIKE_POST_MUTATION,
  SAVE_POST_MUTATION,
  UNSAVE_POST_MUTATION,
  CREATE_COMMENT_MUTATION,
  UPDATE_COMMENT_MUTATION,
  DELETE_COMMENT_MUTATION,
  LIKE_COMMENT_MUTATION,
  UNLIKE_COMMENT_MUTATION,
  CREATE_POST_MUTATION,
  UPDATE_POST_MUTATION,
  DELETE_POST_MUTATION,
  FOLLOW_USER_MUTATION,
  UNFOLLOW_USER_MUTATION,
  UPDATE_PROFILE_MUTATION,
  UPDATE_AVATAR_MUTATION,
  SHARE_POST_MUTATION
} from '../services/graphql/mutations';
import { PostFilters } from '../services/graphql/types';
import { shouldUseMockData, useMockGraphQL } from '../services/mock-graphql';

// Hook options
interface UseGraphQLOptions {
  useMock?: boolean;
  onError?: (error: ApolloError) => void;
  onCompleted?: (data: any) => void;
}

/**
 * Custom hook for GraphQL queries with mock fallback
 */
export const useGraphQL = () => {
  const mockGraphQL = useMockGraphQL();
  const useMock = shouldUseMockData();

  // Feed Posts Query
  const useFeedPosts = (page: number, limit: number, filters?: PostFilters, options?: UseGraphQLOptions) => {
    const shouldUseMock = options?.useMock ?? useMock;

    if (shouldUseMock) {
      // Return mock data
      return {
        data: { feedPosts: mockGraphQL.queries.getFeedPosts(page, limit) },
        loading: false,
        error: undefined,
        refetch: () => Promise.resolve(),
      };
    }

    // Real GraphQL query
    return useQuery(GET_FEED_POSTS, {
      variables: { page, limit, filters },
      onError: options?.onError,
      onCompleted: options?.onCompleted,
    });
  };

  // Post Details Query
  const usePostDetails = (postId: string, options?: UseGraphQLOptions) => {
    const shouldUseMock = options?.useMock ?? useMock;

    if (shouldUseMock) {
      return {
        data: { post: mockGraphQL.queries.getPostDetails(postId) },
        loading: false,
        error: undefined,
        refetch: () => Promise.resolve(),
      };
    }

    return useQuery(GET_POST_DETAILS, {
      variables: { postId },
      skip: !postId,
      onError: options?.onError,
      onCompleted: options?.onCompleted,
    });
  };

  // Post Comments Query
  const usePostComments = (postId: string, page: number, limit: number, options?: UseGraphQLOptions) => {
    const shouldUseMock = options?.useMock ?? useMock;

    if (shouldUseMock) {
      return {
        data: { postComments: mockGraphQL.queries.getPostComments(postId, page, limit) },
        loading: false,
        error: undefined,
        refetch: () => Promise.resolve(),
      };
    }

    return useQuery(GET_POST_COMMENTS, {
      variables: { postId, page, limit },
      skip: !postId,
      onError: options?.onError,
      onCompleted: options?.onCompleted,
    });
  };

  // Current User Query
  const useCurrentUser = (options?: UseGraphQLOptions) => {
    const shouldUseMock = options?.useMock ?? useMock;

    if (shouldUseMock) {
      return {
        data: { currentUser: mockGraphQL.queries.getCurrentUser() },
        loading: false,
        error: undefined,
        refetch: () => Promise.resolve(),
      };
    }

    return useQuery(GET_CURRENT_USER, {
      onError: options?.onError,
      onCompleted: options?.onCompleted,
    });
  };

  // Like Post Mutation
  const useLikePost = (options?: UseGraphQLOptions) => {
    const shouldUseMock = options?.useMock ?? useMock;

    if (shouldUseMock) {
      return [
        async (postId: string) => {
          const result = await mockGraphQL.mutations.likePost(postId);
          return { data: { likePost: result } };
        },
        { loading: false, error: undefined }
      ] as const;
    }

    return useMutation(LIKE_POST_MUTATION, {
      onError: options?.onError,
      onCompleted: options?.onCompleted,
      update: (cache, { data }) => {
        if (data?.likePost) {
          // Update cache for the liked post
          cache.modify({
            id: cache.identify({ __typename: 'Post', id: data.likePost.postId }),
            fields: {
              likes: () => data.likePost.likes,
              isLiked: () => data.likePost.isLiked,
            },
          });
        }
      },
    });
  };

  // Save Post Mutation
  const useSavePost = (options?: UseGraphQLOptions) => {
    const shouldUseMock = options?.useMock ?? useMock;

    if (shouldUseMock) {
      return [
        async (postId: string) => {
          const result = await mockGraphQL.mutations.savePost(postId);
          return { data: { savePost: result } };
        },
        { loading: false, error: undefined }
      ] as const;
    }

    return useMutation(SAVE_POST_MUTATION, {
      onError: options?.onError,
      onCompleted: options?.onCompleted,
    });
  };

  // Create Comment Mutation
  const useCreateComment = (options?: UseGraphQLOptions) => {
    const shouldUseMock = options?.useMock ?? useMock;

    if (shouldUseMock) {
      return [
        async (variables: { input: { postId: string; content: string } }) => {
          const result = await mockGraphQL.mutations.createComment(
            variables.input.postId,
            variables.input.content
          );
          return { data: { createComment: result } };
        },
        { loading: false, error: undefined }
      ] as const;
    }

    return useMutation(CREATE_COMMENT_MUTATION, {
      onError: options?.onError,
      onCompleted: options?.onCompleted,
      update: (cache, { data }) => {
        if (data?.createComment) {
          // Add new comment to cache
          cache.modify({
            id: cache.identify({ __typename: 'Post', id: data.createComment.postId }),
            fields: {
              comments: (existingComments = []) => {
                return [...existingComments, data.createComment];
              },
            },
          });
        }
      },
    });
  };

  // Follow User Mutation
  const useFollowUser = (options?: UseGraphQLOptions) => {
    const shouldUseMock = options?.useMock ?? useMock;

    if (shouldUseMock) {
      return [
        async (userId: string) => {
          const result = await mockGraphQL.mutations.followUser(userId);
          return { data: { followUser: result } };
        },
        { loading: false, error: undefined }
      ] as const;
    }

    return useMutation(FOLLOW_USER_MUTATION, {
      onError: options?.onError,
      onCompleted: options?.onCompleted,
    });
  };

  // Return all hooks
  return {
    // Queries
    useFeedPosts,
    usePostDetails,
    usePostComments,
    useCurrentUser,
    useUserPosts: (userId: string, page: number, limit: number, options?: UseGraphQLOptions) => 
      useQuery(GET_USER_POSTS, { variables: { userId, page, limit }, ...options }),
    useLikedPosts: (userId: string, page: number, limit: number, options?: UseGraphQLOptions) => 
      useQuery(GET_LIKED_POSTS, { variables: { userId, page, limit }, ...options }),
    useSavedPosts: (userId: string, page: number, limit: number, options?: UseGraphQLOptions) => 
      useQuery(GET_SAVED_POSTS, { variables: { userId, page, limit }, ...options }),
    useUserProfile: (userId: string, options?: UseGraphQLOptions) => 
      useQuery(GET_USER_PROFILE, { variables: { userId }, ...options }),
    useRelatedPosts: (postId: string, limit: number, options?: UseGraphQLOptions) => 
      useQuery(GET_RELATED_POSTS, { variables: { postId, limit }, ...options }),
    useSearchPosts: (query: string, page: number, limit: number, options?: UseGraphQLOptions) => 
      useQuery(SEARCH_POSTS, { variables: { query, page, limit }, skip: !query, ...options }),
    useTrendingTags: (limit: number, options?: UseGraphQLOptions) => 
      useQuery(GET_TRENDING_TAGS, { variables: { limit }, ...options }),
    useCuisineStats: (userId: string, options?: UseGraphQLOptions) => 
      useQuery(GET_CUISINE_STATS, { variables: { userId }, ...options }),

    // Mutations
    useLikePost,
    useUnlikePost: (options?: UseGraphQLOptions) => useMutation(UNLIKE_POST_MUTATION, options),
    useSavePost,
    useUnsavePost: (options?: UseGraphQLOptions) => useMutation(UNSAVE_POST_MUTATION, options),
    useCreateComment,
    useUpdateComment: (options?: UseGraphQLOptions) => useMutation(UPDATE_COMMENT_MUTATION, options),
    useDeleteComment: (options?: UseGraphQLOptions) => useMutation(DELETE_COMMENT_MUTATION, options),
    useLikeComment: (options?: UseGraphQLOptions) => useMutation(LIKE_COMMENT_MUTATION, options),
    useUnlikeComment: (options?: UseGraphQLOptions) => useMutation(UNLIKE_COMMENT_MUTATION, options),
    useCreatePost: (options?: UseGraphQLOptions) => useMutation(CREATE_POST_MUTATION, options),
    useUpdatePost: (options?: UseGraphQLOptions) => useMutation(UPDATE_POST_MUTATION, options),
    useDeletePost: (options?: UseGraphQLOptions) => useMutation(DELETE_POST_MUTATION, options),
    useFollowUser,
    useUnfollowUser: (options?: UseGraphQLOptions) => useMutation(UNFOLLOW_USER_MUTATION, options),
    useUpdateProfile: (options?: UseGraphQLOptions) => useMutation(UPDATE_PROFILE_MUTATION, options),
    useUpdateAvatar: (options?: UseGraphQLOptions) => useMutation(UPDATE_AVATAR_MUTATION, options),
    useSharePost: (options?: UseGraphQLOptions) => useMutation(SHARE_POST_MUTATION, options),

    // Lazy Queries
    useLazyFeedPosts: () => useLazyQuery(GET_FEED_POSTS),
    useLazySearchPosts: () => useLazyQuery(SEARCH_POSTS),

    // Helper functions
    shouldUseMockData: () => useMock,
  };
};

/**
 * Hook for common GraphQL operations with optimistic updates
 */
export const useGraphQLOperations = () => {
  const { useLikePost, useSavePost, useCreateComment, useFollowUser } = useGraphQL();
  const [likePostMutation] = useLikePost();
  const [savePostMutation] = useSavePost();
  const [createCommentMutation] = useCreateComment();
  const [followUserMutation] = useFollowUser();

  const likePost = async (postId: string) => {
    try {
      await likePostMutation({
        variables: { postId },
        optimisticResponse: {
          likePost: {
            __typename: 'LikeResponse',
            success: true,
            message: 'Post liked',
            likes: 0, // Will be updated by cache
            isLiked: true,
          },
        },
      });
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const savePost = async (postId: string) => {
    try {
      await savePostMutation({
        variables: { postId },
        optimisticResponse: {
          savePost: {
            __typename: 'SaveResponse',
            success: true,
            message: 'Post saved',
            isSaved: true,
          },
        },
      });
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const createComment = async (postId: string, content: string) => {
    try {
      await createCommentMutation({
        variables: {
          input: {
            postId,
            content,
          },
        },
      });
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const followUser = async (userId: string) => {
    try {
      await followUserMutation({
        variables: { userId },
        optimisticResponse: {
          followUser: {
            __typename: 'FollowResponse',
            success: true,
            message: 'User followed',
            isFollowing: true,
            followers: 0, // Will be updated by cache
          },
        },
      });
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  return {
    likePost,
    savePost,
    createComment,
    followUser,
  };
};
