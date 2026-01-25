import { gql } from '@apollo/client';

// Fragments for reusable fields
export const USER_FRAGMENT = gql`
  fragment UserFragment on User {
    id
    username
    email
    fullName
    avatar
    bio
    isVerified
    followers
    following
    posts
    createdAt
  }
`;

export const POST_FRAGMENT = gql`
  fragment PostFragment on Post {
    id
    imageUrl
    caption
    likes
    comments
    shares
    isLiked
    isSaved
    createdAt
    tags
    location
    cuisine
    prepTime
    difficulty
    calories
    servings
    user {
      ...UserFragment
    }
  }
  ${USER_FRAGMENT}
`;

export const COMMENT_FRAGMENT = gql`
  fragment CommentFragment on Comment {
    id
    content
    likes
    isLiked
    replies
    createdAt
    user {
      ...UserFragment
    }
    repliesList {
      id
      content
      likes
      isLiked
      replies
      createdAt
      user {
        ...UserFragment
      }
    }
  }
  ${USER_FRAGMENT}
`;

// Queries
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      ...UserFragment
    }
  }
  ${USER_FRAGMENT}
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: ID!) {
    user(id: $userId) {
      ...UserFragment
    }
  }
  ${USER_FRAGMENT}
`;

export const GET_FEED_POSTS = gql`
  query GetFeedPosts($page: Int!, $limit: Int!, $filters: PostFilters) {
    feedPosts(page: $page, limit: $limit, filters: $filters) {
      posts {
        ...PostFragment
      }
      hasMore
      totalCount
      page
    }
  }
  ${POST_FRAGMENT}
`;

export const GET_USER_POSTS = gql`
  query GetUserPosts($userId: ID!, $page: Int!, $limit: Int!) {
    userPosts(userId: $userId, page: $page, limit: $limit) {
      posts {
        ...PostFragment
      }
      hasMore
      totalCount
      page
    }
  }
  ${POST_FRAGMENT}
`;

export const GET_LIKED_POSTS = gql`
  query GetLikedPosts($userId: ID!, $page: Int!, $limit: Int!) {
    likedPosts(userId: $userId, page: $page, limit: $limit) {
      posts {
        ...PostFragment
      }
      hasMore
      totalCount
      page
    }
  }
  ${POST_FRAGMENT}
`;

export const GET_SAVED_POSTS = gql`
  query GetSavedPosts($userId: ID!, $page: Int!, $limit: Int!) {
    savedPosts(userId: $userId, page: $page, limit: $limit) {
      posts {
        ...PostFragment
      }
      hasMore
      totalCount
      page
    }
  }
  ${POST_FRAGMENT}
`;

export const GET_POST_DETAILS = gql`
  query GetPostDetails($postId: ID!) {
    post(id: $postId) {
      ...PostFragment
    }
  }
  ${POST_FRAGMENT}
`;

export const GET_POST_COMMENTS = gql`
  query GetPostComments($postId: ID!, $page: Int!, $limit: Int!) {
    postComments(postId: $postId, page: $page, limit: $limit) {
      comments {
        ...CommentFragment
      }
      hasMore
      totalCount
      page
    }
  }
  ${COMMENT_FRAGMENT}
`;

export const GET_RELATED_POSTS = gql`
  query GetRelatedPosts($postId: ID!, $limit: Int!) {
    relatedPosts(postId: $postId, limit: $limit) {
      ...PostFragment
    }
  }
  ${POST_FRAGMENT}
`;

export const SEARCH_POSTS = gql`
  query SearchPosts($query: String!, $page: Int!, $limit: Int!) {
    searchPosts(query: $query, page: $page, limit: $limit) {
      posts {
        ...PostFragment
      }
      hasMore
      totalCount
      page
    }
  }
  ${POST_FRAGMENT}
`;

export const GET_TRENDING_TAGS = gql`
  query GetTrendingTags($limit: Int!) {
    trendingTags(limit: $limit) {
      tag
      count
    }
  }
`;

export const GET_CUISINE_STATS = gql`
  query GetCuisineStats($userId: ID!) {
    cuisineStats(userId: $userId) {
      cuisine
      count
    }
  }
`;

// Subscription queries (for real-time updates)
export const POST_LIKED_SUBSCRIPTION = gql`
  subscription OnPostLiked($postId: ID!) {
    postLiked(postId: $postId) {
      postId
      likes
      isLiked
    }
  }
`;

export const COMMENT_ADDED_SUBSCRIPTION = gql`
  subscription OnCommentAdded($postId: ID!) {
    commentAdded(postId: $postId) {
      ...CommentFragment
    }
  }
  ${COMMENT_FRAGMENT}
`;
