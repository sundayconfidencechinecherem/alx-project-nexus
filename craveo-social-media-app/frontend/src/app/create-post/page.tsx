'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaCamera, FaUtensils, FaClock, FaFire, FaUsers, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import ImageUpload from '@/app/components/ImageUpload';
import TagInput from '@/app/components/TagInput';
import Input from '@/app/components/Input';
import Button from '@/app/components/Button';
import ProtectedRoute from '@/app/components/ProtectedRoute';

// Define types locally if needed
interface CreatePostFormData {
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

const CUISINE_OPTIONS = [
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

const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'] as const;
const PREP_TIME_OPTIONS = [
  '15 mins',
  '30 mins',
  '45 mins',
  '1 hour',
  '1.5 hours',
  '2 hours',
  '2+ hours',
];

export default function CreatePostPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [characterCount, setCharacterCount] = useState(0);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<CreatePostFormData>({
    defaultValues: {
      caption: '',
      tags: [],
      cuisine: '',
      prepTime: '',
      difficulty: 'Medium',
      calories: undefined,
      servings: undefined,
      location: '',
    },
  });

  const tags = watch('tags');
  const caption = watch('caption');

  const handleImageChange = (file: File | null, previewUrl: string) => {
    setValue('image', file, { shouldValidate: true });
    setPreviewUrl(previewUrl);
    trigger('image');
  };

  const handleTagsChange = (newTags: string[]) => {
    setValue('tags', newTags, { shouldValidate: true });
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setValue('caption', value, { shouldValidate: true });
    setCharacterCount(value.length);
  };

  const onSubmit = async (data: CreatePostFormData) => {
    setIsSubmitting(true);
    console.log('Submitting post:', data);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-app-bg py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                className="flex items-center text-text-secondary hover:text-text-primary transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Back to Feed
              </Link>
              
              <h1 className="text-2xl font-bold text-text-primary">Create New Post</h1>
              
              <div className="w-24"></div>
            </div>
            
            <p className="text-text-secondary text-center">
              Share your delicious creations with the food community
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Form content would go here - simplified for now */}
            <div className="bg-surface rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Create Post Form</h2>
              <p className="text-text-secondary">Form would go here</p>
              <Button type="submit" loading={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Post'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
