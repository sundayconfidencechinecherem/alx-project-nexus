export interface CreatePostFormData {
  image: File | null;
  caption: string;
  tags: string[];
  cuisine: string;
  prepTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  calories?: number;
  servings?: number;
  location?: string;
}

export interface CuisineOption {
  value: string;
  label: string;
  icon?: string;
}

export const CUISINE_OPTIONS: CuisineOption[] = [
  { value: 'italian', label: 'Italian', icon: '🍕' },
  { value: 'japanese', label: 'Japanese', icon: '🍣' },
  { value: 'mexican', label: 'Mexican', icon: '🌮' },
  { value: 'american', label: 'American', icon: '🍔' },
  { value: 'chinese', label: 'Chinese', icon: '🥢' },
  { value: 'indian', label: 'Indian', icon: '🍛' },
  { value: 'thai', label: 'Thai', icon: '🍜' },
  { value: 'mediterranean', label: 'Mediterranean', icon: '🥗' },
  { value: 'french', label: 'French', icon: '🥐' },
  { value: 'dessert', label: 'Dessert', icon: '🍰' },
  { value: 'vegetarian', label: 'Vegetarian', icon: '🥦' },
  { value: 'vegan', label: 'Vegan', icon: '🌱' },
  { value: 'other', label: 'Other', icon: '🍽️' },
];

export const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'] as const;
export const PREP_TIME_OPTIONS = [
  '15 mins',
  '30 mins',
  '45 mins',
  '1 hour',
  '1.5 hours',
  '2 hours',
  '2+ hours',
];
