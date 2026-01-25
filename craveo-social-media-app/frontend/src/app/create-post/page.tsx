'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaCamera, FaUtensils, FaClock, FaFire, FaUsers, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import ImageUpload from '../components/ImageUpload';
import TagInput from '../components/TagInput';
import Input from '../components/Input';
import Button from '../components/Button';
import { CreatePostFormData, CUISINE_OPTIONS, DIFFICULTY_OPTIONS, PREP_TIME_OPTIONS } from '../types/create-post';

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Convert image to base64 for mock
      let base64Image = '';
      if (data.image) {
        const reader = new FileReader();
        reader.onloadend = () => {
          base64Image = reader.result as string;
          console.log('Image as base64 (first 100 chars):', base64Image.substring(0, 100));
        };
        reader.readAsDataURL(data.image);
      }
      
      // Success simulation
      alert('Post created successfully!');
      // In real app: redirect to feed or post detail page
      // router.push('/');
      
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
            
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
          
          <p className="text-text-secondary text-center">
            Share your delicious creations with the food community
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Image Upload Section */}
          <div className="bg-surface rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <FaCamera className="text-primary" />
              Food Photo
            </h2>
            
            <ImageUpload
              onImageChange={handleImageChange}
              initialPreview={previewUrl}
              error={errors.image?.message}
              maxSizeMB={10}
            />
            
            <input
              type="hidden"
              {...register('image', {
                required: 'Please upload a food photo',
                validate: (value) => value !== null || 'Please upload a food photo',
              })}
            />
          </div>

          {/* Caption Section */}
          <div className="bg-surface rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Caption
            </h2>
            
            <div className="relative">
              <textarea
                {...register('caption', {
                  required: 'Caption is required',
                  maxLength: {
                    value: 2200,
                    message: 'Caption cannot exceed 2200 characters',
                  },
                })}
                onChange={handleCaptionChange}
                placeholder="Describe your food... What makes it special? Share the story behind it!"
                rows={4}
                className="w-full px-4 py-3 bg-surface border border-border rounded-lg
                         text-text-primary placeholder-text-tertiary
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         resize-none transition-all duration-200"
              />
              
              <div className="flex justify-between mt-2">
                <div className="text-sm text-text-tertiary">
                  Share your recipe, cooking tips, or dining experience
                </div>
                <div className={`text-sm ${characterCount > 2200 ? 'text-error' : 'text-text-tertiary'}`}>
                  {characterCount}/2200
                </div>
              </div>
              
              {errors.caption && (
                <p className="mt-2 text-sm text-error">{errors.caption.message}</p>
              )}
            </div>
          </div>

          {/* Tags Section */}
          <div className="bg-surface rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Tags & Categories
            </h2>
            
            <TagInput
              tags={tags}
              onTagsChange={handleTagsChange}
              placeholder="e.g., Delicious, Homemade, Recipe"
              maxTags={10}
              suggestions={['Delicious', 'Homemade', 'Restaurant', 'Recipe', 'Healthy', 'Dessert', 'Spicy', 'Vegetarian', 'Vegan', 'QuickMeal']}
              error={errors.tags?.message}
            />
          </div>

          {/* Food Details Section */}
          <div className="bg-surface rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <FaUtensils className="text-primary" />
              Food Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cuisine */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Cuisine/Category
                </label>
                <select
                  {...register('cuisine', {
                    required: 'Please select a cuisine',
                  })}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg
                           text-text-primary focus:outline-none focus:ring-2 
                           focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select cuisine...</option>
                  {CUISINE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
                {errors.cuisine && (
                  <p className="mt-2 text-sm text-error">{errors.cuisine.message}</p>
                )}
              </div>

              {/* Preparation Time */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2 flex items-center gap-2">
                  <FaClock />
                  Preparation Time
                </label>
                <select
                  {...register('prepTime', {
                    required: 'Please select preparation time',
                  })}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg
                           text-text-primary focus:outline-none focus:ring-2 
                           focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select time...</option>
                  {PREP_TIME_OPTIONS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {errors.prepTime && (
                  <p className="mt-2 text-sm text-error">{errors.prepTime.message}</p>
                )}
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Difficulty Level
                </label>
                <div className="flex gap-2">
                  {DIFFICULTY_OPTIONS.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setValue('difficulty', level, { shouldValidate: true })}
                      className={`flex-1 px-4 py-3 rounded-lg border text-sm font-medium transition-colors
                        ${watch('difficulty') === level
                          ? 'bg-primary text-white border-primary'
                          : 'bg-surface border-border text-text-primary hover:bg-surface-hover'
                        }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <input type="hidden" {...register('difficulty')} />
              </div>

              {/* Calories */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2 flex items-center gap-2">
                  <FaFire />
                  Calories (optional)
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 450"
                  min="0"
                  {...register('calories', {
                    min: { value: 0, message: 'Calories cannot be negative' },
                    max: { value: 5000, message: 'Please enter a realistic calorie count' },
                  })}
                  error={errors.calories?.message}
                />
              </div>

              {/* Servings */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2 flex items-center gap-2">
                  <FaUsers />
                  Servings (optional)
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 4"
                  min="1"
                  max="50"
                  {...register('servings', {
                    min: { value: 1, message: 'At least 1 serving' },
                    max: { value: 50, message: 'Maximum 50 servings' },
                  })}
                  error={errors.servings?.message}
                />
              </div>

              {/* Location */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-primary mb-2 flex items-center gap-2">
                  <FaMapMarkerAlt />
                  Location (optional)
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Home Kitchen, Restaurant Name, City"
                  {...register('location', {
                    maxLength: {
                      value: 100,
                      message: 'Location too long',
                    },
                  })}
                  error={errors.location?.message}
                />
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="bg-surface rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-text-secondary text-sm">
                <p>Your post will be visible to the Craveo community</p>
                <p className="text-text-tertiary text-xs mt-1">
                  Make sure to follow community guidelines
                </p>
              </div>
              
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? 'Creating...' : 'Create Post'}
                </Button>
              </div>
            </div>
          </div>
        </form>

        {/* Preview Section (for larger screens) */}
        <div className="mt-12 hidden lg:block">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Preview</h3>
          <div className="bg-surface rounded-xl shadow-lg p-6">
            {previewUrl ? (
              <div className="space-y-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="text-sm text-text-secondary">
                  <p>Caption: {caption || 'No caption yet'}</p>
                  <p className="mt-2">Tags: {tags.length > 0 ? tags.join(', ') : 'No tags yet'}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-text-tertiary">
                <p>Upload an image to see preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
