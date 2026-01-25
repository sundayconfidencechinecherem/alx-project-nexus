import { gql } from '@apollo/client';
import { USER_FRAGMENT, POST_FRAGMENT, COMMENT_FRAGMENT } from './queries';

// Auth Mutations
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        ...UserFragment
      }
      tokens {
        accessToken
        refreshToken
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        ...UserFragment
      }
      tokens {
        accessToken
        refreshToken
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      success
      message
    }
  }
`;

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken {
    refreshToken {
      accessToken
      refreshToken
    }
  }
`;

// Post Mutations
export const CREATE_POST_MUTATION = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      ...PostFragment
    }
  }
  ${POST_FRAGMENT}
`;

export const UPDATE_POST_MUTATION = gql`
  mutation UpdatePost($postId: ID!, $input: UpdatePostInput!) {
    updatePost(postId: $postId, input: $input) {
      ...PostFragment
    }
  }
  ${POST_FRAGMENT}
`;

export const DELETE_POST_MUTATION = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId) {
      success
      message
    }
  }
`;

export const LIKE_POST_MUTATION = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      success
      message
      likes
      isLiked
    }
  }
`;

export const UNLIKE_POST_MUTATION = gql`
  mutation UnlikePost($postId: ID!) {
    unlikePost(postId: $postId) {
      success
      message
      likes
      isLiked
    }
  }
`;

export const SAVE_POST_MUTATION = gql`
  mutation SavePost($postId: ID!) {
    savePost(postId: $postId) {
      success
      message
      isSaved
    }
  }
`;

export const UNSAVE_POST_MUTATION = gql`
  mutation UnsavePost($postId: ID!) {
    unsavePost(postId: $postId) {
      success
      message
      isSaved
    }
  }
`;

export const SHARE_POST_MUTATION = gql`
  mutation SharePost($postId: ID!) {
    sharePost(postId: $postId) {
      success
      message
      shares
    }
  }
`;

// Comment Mutations
export const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      ...CommentFragment
    }
  }
  ${COMMENT_FRAGMENT}
`;

export const UPDATE_COMMENT_MUTATION = gql`
  mutation UpdateComment($commentId: ID!, $content: String!) {
    updateComment(commentId: $commentId, content: $content) {
      ...CommentFragment
    }
  }
  ${COMMENT_FRAGMENT}
`;

export const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteComment($commentId: ID!) {
    deleteComment(commentId: $commentId) {
      success
      message
    }
  }
`;

export const LIKE_COMMENT_MUTATION = gql`
  mutation LikeComment($commentId: ID!) {
    likeComment(commentId: $commentId) {
      success
      message
      likes
      isLiked
    }
  }
`;

export const UNLIKE_COMMENT_MUTATION = gql`
  mutation UnlikeComment($commentId: ID!) {
    unlikeComment(commentId: $commentId) {
      success
      message
      likes
      isLiked
    }
  }
`;

// User Mutations
export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      ...UserFragment
    }
  }
  ${USER_FRAGMENT}
`;

export const UPDATE_AVATAR_MUTATION = gql`
  mutation UpdateAvatar($avatar: Upload!) {
    updateAvatar(avatar: $avatar) {
      ...UserFragment
    }
  }
  ${USER_FRAGMENT}
`;

export const FOLLOW_USER_MUTATION = gql`
  mutation FollowUser($userId: ID!) {
    followUser(userId: $userId) {
      success
      message
      isFollowing
      followers
    }
  }
`;

export const UNFOLLOW_USER_MUTATION = gql`
  mutation UnfollowUser($userId: ID!) {
    unfollowUser(userId: $userId) {
      success
      message
      isFollowing
      followers
    }
  }
`;

// Report Mutations
export const REPORT_POST_MUTATION = gql`
  mutation ReportPost($postId: ID!, $reason: String!) {
    reportPost(postId: $postId, reason: $reason) {
      success
      message
    }
  }
`;

export const REPORT_COMMENT_MUTATION = gql`
  mutation ReportComment($commentId: ID!, $reason: String!) {
    reportComment(commentId: $commentId, reason: $reason) {
      success
      message
    }
  }
`;

// Email Verification
export const VERIFY_EMAIL_MUTATION = gql`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      success
      message
    }
  }
`;

export const RESEND_VERIFICATION_EMAIL = gql`
  mutation ResendVerificationEmail {
    resendVerificationEmail {
      success
      message
    }
  }
`;

// Password Reset
export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      success
      message
    }
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($token: String!, $password: String!) {
    resetPassword(token: $token, password: $password) {
      success
      message
    }
  }
`;
