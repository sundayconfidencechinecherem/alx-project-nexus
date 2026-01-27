import { 
  ApolloClient, 
  InMemoryCache, 
  createHttpLink,
  ApolloLink,
  Observable,
  Operation
} from '@apollo/client';

// Import your mock data service
import { mockGraphQL } from './graphql/mockService';

// Check if we should use mock data
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || 
                      process.env.NODE_ENV === 'development';

// Create mock Apollo Link for development
const createMockLink = (): ApolloLink => {
  return new ApolloLink((operation: Operation) => {
    const { operationName, variables } = operation;

    return new Observable((observer) => {
      (async () => {
        try {
          
          let result: any;
          const operationType = operationName?.includes('Mutation') ? 'mutations' : 'queries';

          // Handle different operations
          if (operationType === 'queries') {
            switch (operationName) {
              case 'GetCurrentUser':
                result = { currentUser: await mockGraphQL.queries.getCurrentUser() };
                break;
              case 'GetFeedPosts':
                result = { 
                  feedPosts: await mockGraphQL.queries.getFeedPosts(
                    variables?.page || 1, 
                    variables?.limit || 10
                  ) 
                };
                break;
              case 'GetPostDetails':
                result = { 
                  post: await mockGraphQL.queries.getPostDetails(variables?.postId)
                };
                break;
              case 'GetUserProfile':
                result = { 
                  user: await mockGraphQL.queries.getUserProfile(variables?.userId)
                };
                break;
              case 'GetPostComments':
                result = { 
                  comments: await mockGraphQL.queries.getPostComments(
                    variables?.postId,
                    variables?.page || 1,
                    variables?.limit || 10
                  ) 
                };
                break;
              default:
                result = { data: null };
            }
          } else {
            // Handle mutations
            switch (operationName) {
              case 'LikePost':
                result = { 
                  likePost: await mockGraphQL.mutations.likePost(variables?.postId)
                };
                break;
              case 'SavePost':
                result = { 
                  savePost: await mockGraphQL.mutations.savePost(variables?.postId)
                };
                break;
              case 'CreateComment':
                result = { 
                  createComment: await mockGraphQL.mutations.createComment(
                    variables?.postId, 
                    variables?.content
                  )
                };
                break;
              case 'FollowUser':
                result = { 
                  followUser: await mockGraphQL.mutations.followUser(variables?.userId)
                };
                break;
              case 'CreatePost':
                // Mock post creation
                result = { 
                  createPost: {
                    id: `post-${Date.now()}`,
                    ...variables,
                    likes: 0,
                    comments: 0,
                    isLiked: false,
                    isSaved: false,
                    createdAt: new Date().toISOString(),
                    user: await mockGraphQL.queries.getCurrentUser()
                  }
                };
                break;
              default:
                result = { success: true };
            }
          }

          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 300));

          observer.next({
            data: result,
          });
          observer.complete();
        } catch (error: any) {
          observer.error(error);
        }
      })();
    });
  });
};

// Create HTTP link for real GraphQL API
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://mock-graphql.craveo.app/graphql',
  credentials: 'include',
});

// error handling using ApolloLink
const errorLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    const subscription = forward(operation).subscribe({
      next: (response) => {
        if (response.errors) {
          console.error('[GraphQL errors]:', response.errors);
        }
        observer.next(response);
      },
      error: (error) => {
        console.error('[Network error]:', error);
        observer.error(error);
      },
      complete: () => observer.complete(),
    });

    return () => subscription.unsubscribe();
  });
});

// Decide which link to use ?
const link = USE_MOCK_DATA
  ? ApolloLink.from([errorLink, createMockLink()])
  : ApolloLink.from([errorLink, httpLink]);

// Configure cache
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        feedPosts: {
          keyArgs: false,
          merge(existing: any, incoming: any) {
            if (!incoming) return existing;
            if (!existing) return incoming;
            
            // Merge paginated posts
            return {
              ...incoming,
              posts: [...existing.posts, ...incoming.posts],
            };
          },
        },
      },
    },
  },
});

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link,
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

// Helper to reset cache (useful for logout)
export const resetApolloCache = () => {
  apolloClient.resetStore();
};

// Helper to check if we're using mock data
export const isUsingMockData = () => USE_MOCK_DATA;
