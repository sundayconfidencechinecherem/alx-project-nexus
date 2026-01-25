export interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isVerified: boolean;
  };
  content: string;
  likes: number;
  isLiked: boolean;
  replies: number;
  createdAt: Date;
  repliesList?: Comment[];
}

export interface PostDetail extends Post {
  ingredients?: string[];
  instructions?: string[];
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  relatedPosts: Post[];
}
