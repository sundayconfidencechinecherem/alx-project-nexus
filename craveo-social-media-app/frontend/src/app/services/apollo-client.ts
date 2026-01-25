import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// Mock GraphQL endpoint (replace with your actual GraphQL endpoint)
const MOCK_GRAPHQL_URI = 'https://mock-graphql.craveo.app/graphql';

// In a real app, this would be your actual GraphQL endpoint
// const GRAPHQL_URI = process.env.NEXT_PUBLIC_GRAPHQL_URI || 'http://localhost:4000/graphql';

// Create HTTP link
const httpLink = createHttpLink({
  uri: MOCK_GRAPHQL_URI,
  // credentials: 'include', // Include cookies if needed
});

// Auth link to add token to headers
const authLink = setContext((_, { headers }) => {
  // Get token from localStorage
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('craveo_tokens')
      ? JSON.parse(localStorage.getItem('craveo_tokens')!).accessToken
      : null
    : null;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      
      // Handle specific errors
      if (message.includes('Unauthorized') || message.includes('Invalid token')) {
        // Clear auth tokens and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('craveo_user');
          localStorage.removeItem('craveo_tokens');
          window.location.href = '/auth/login';
        }
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    
    // You can add more specific network error handling here
    if (networkError.message.includes('Failed to fetch')) {
      console.error('Network connectivity issue. Please check your connection.');
    }
  }
});

// Logging link (for development)
const loggingLink = new ApolloLink((operation, forward) => {
  console.log(`GraphQL Request: ${operation.operationName}`, {
    variables: operation.variables,
  });

  return forward(operation).map((response) => {
    console.log(`GraphQL Response: ${operation.operationName}`, response);
    return response;
  });
});

// Create the Apollo Client instance
const createApolloClient = () => {
  // Only add logging in development
  const links = process.env.NODE_ENV === 'development'
    ? [errorLink, authLink, loggingLink, httpLink]
    : [errorLink, authLink, httpLink];

  return new ApolloClient({
    link: from(links),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            // Define custom cache policies here
            posts: {
              keyArgs: false,
              merge(existing = [], incoming) {
                return [...existing, ...incoming];
              },
            },
            comments: {
              keyArgs: ['postId'],
              merge(existing = [], incoming) {
                return [...existing, ...incoming];
              },
            },
          },
        },
        Post: {
          fields: {
            // Normalize post fields
            comments: {
              merge(existing, incoming) {
                return incoming;
              },
            },
          },
        },
        User: {
          keyFields: ['id'], // Use id as cache key
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network', // Good for real-time updates
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'network-only', // Always fetch fresh data for queries
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
    // Enable DevTools in development
    connectToDevTools: process.env.NODE_ENV === 'development',
  });
};

// Export a singleton instance
let apolloClient: ApolloClient<any> | undefined;

export const initializeApollo = (initialState = {}) => {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client,
  // the initial state gets hydrated here
  if (initialState) {
    const existingCache = _apolloClient.extract();
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
};

export const useApollo = (initialState: any) => {
  return initializeApollo(initialState);
};

// Export the client instance for direct use
export const apolloClientInstance = initializeApollo();

// Helper function to clear Apollo cache
export const clearApolloCache = async () => {
  if (apolloClient) {
    await apolloClient.resetStore();
  }
};

// Helper function to refetch queries
export const refetchQueries = async (queryNames: string[]) => {
  if (apolloClient) {
    await apolloClient.refetchQueries({
      include: queryNames,
    });
  }
};
