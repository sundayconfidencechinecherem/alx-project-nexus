// src/app/create-post/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaArrowLeft, 
  FaCamera, 
  FaUtensils, 
  FaClock, 
  FaFire, 
  FaUsers, 
  FaMapMarkerAlt, 
  FaCheck, 
  FaHome, 
  FaUpload,
  FaTrash,
  FaTag,
  FaUtensilSpoon,
  FaChartLine,
  FaLightbulb,
  FaCameraRetro,
  FaPen,
  FaSave,
  FaHeart,
  FaShare,
  FaBell
} from 'react-icons/fa';
import ProtectedRoute from '@/app/components/ProtectedRoute';

export default function CreatePostPage() {
  const router = useRouter();
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [tags, setTags] = useState<string[]>(['Italian', 'Homemade']);
  const [tagInput, setTagInput] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [calories, setCalories] = useState('');
  const [servings, setServings] = useState('');
  const [location, setLocation] = useState('');
  
  // Post submission states
  const [postSuccess, setPostSuccess] = useState(false);
  const [newPostId, setNewPostId] = useState<string>('');
  const [showSuccessOptions, setShowSuccessOptions] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const simulateAPICall = async (postData: any): Promise<string> => {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock post ID
    const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return postId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Create post data
    const postData = {
      caption,
      tags,
      cuisine,
      prepTime,
      difficulty,
      calories: calories ? parseInt(calories) : undefined,
      servings: servings ? parseInt(servings) : undefined,
      location,
      hasImage: !!imagePreview,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      isLiked: false,
      isSaved: false,
    };
    
    try {
      // Simulate API call
      const postId = await simulateAPICall(postData);
      
      // Save post to localStorage for immediate display in feed
      const newPost = {
        id: postId,
        user: {
          id: 'current-user',
          username: 'you',
          fullName: 'You',
          avatar: '/images/persons/person3.png',
          isVerified: true,
        },
        image: imagePreview || '/images/food/default.png',
        caption,
        tags,
        cuisine,
        prepTime,
        difficulty,
        calories: calories ? parseInt(calories) : undefined,
        servings: servings ? parseInt(servings) : undefined,
        location,
        likes: 0,
        comments: 0,
        isLiked: false,
        isSaved: false,
        createdAt: new Date().toISOString(),
      };
      
      // Get existing recent posts or create new array
      const existingPosts = JSON.parse(localStorage.getItem('recent_craveo_posts') || '[]');
      existingPosts.unshift(newPost); // Add new post to beginning
      
      // Keep only last 5 posts
      const recentPosts = existingPosts.slice(0, 5);
      localStorage.setItem('recent_craveo_posts', JSON.stringify(recentPosts));
      
      // Set success states
      setNewPostId(postId);
      setPostSuccess(true);
      
      // Show success options after a delay
      setTimeout(() => {
        setShowSuccessOptions(true);
      }, 1000);
      
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPost = () => {
    alert(`Would navigate to post: /post/${newPostId}`);
    router.push('/');
  };

  const handleCreateAnother = () => {
    // Reset form
    setCaption('');
    setImagePreview('');
    setTags(['Italian', 'Homemade']);
    setTagInput('');
    setCuisine('');
    setPrepTime('');
    setDifficulty('Medium');
    setCalories('');
    setServings('');
    setLocation('');
    setPostSuccess(false);
    setShowSuccessOptions(false);
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const cuisineOptions = [
    'Italian', 'Japanese', 'Mexican', 'American', 'Chinese', 
    'Indian', 'Thai', 'Mediterranean', 'French', 'Dessert',
    'Vegetarian', 'Vegan', 'Other'
  ];

  const prepTimeOptions = [
    '15 mins', '30 mins', '45 mins', '1 hour', 
    '1.5 hours', '2 hours', '2+ hours'
  ];

  const difficultyOptions = ['Easy', 'Medium', 'Hard'];

  // If post was successful, show success screen
  if (postSuccess) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
          {/* Fixed Header for ALL screen sizes to match navbar */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border p-4 flex items-center justify-between lg:hidden">
            <button
              onClick={handleGoHome}
              className="p-2 hover:bg-surface-hover rounded-full"
            >
              <FaArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-text-primary">Post Created</h1>
            <div className="w-10"></div> {/* Spacer */}
          </div>

          {/* Desktop header - different spacing */}
          <div className="hidden lg:block fixed top-0 left-64 right-0 z-50 bg-white border-b border-border p-4">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <button
                onClick={handleGoHome}
                className="inline-flex items-center text-text-secondary hover:text-text-primary"
              >
                <FaArrowLeft className="mr-2" />
                Back to Home
              </button>
              <h1 className="text-xl font-bold text-text-primary">Post Created Successfully!</h1>
              <div className="w-24"></div> {/* Spacer for balance */}
            </div>
          </div>

          {/* Content with proper navbar spacing */}
          <div className="pt-16 lg:pt-20 lg:ml-64">
            <div className="max-w-2xl mx-auto px-4 py-8">
              {/* Success Animation/Message */}
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCheck className="text-green-600 text-4xl" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Post Created Successfully!</h1>
                <p className="text-gray-600 text-sm md:text-base">Your delicious creation is now live on Craveo.</p>
              </div>

              {/* What's happening in background */}
              <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-8">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">What's happening now:</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <FaUpload className="text-blue-600 w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm md:text-base">Post published to feed</p>
                      <p className="text-xs md:text-sm text-gray-500">Visible to all Craveo users</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <FaSave className="text-purple-600 w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm md:text-base">Saved to local feed</p>
                      <p className="text-xs md:text-sm text-gray-500">Available immediately on home page</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                      <FaBell className="text-yellow-600 w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm md:text-base">Notifying followers</p>
                      <p className="text-xs md:text-sm text-gray-500">Your followers will see your post</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Success Options (shown after delay) */}
              {showSuccessOptions && (
                <div className="space-y-3">
                  <button
                    onClick={handleGoHome}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-3 text-sm md:text-base"
                  >
                    <FaHome className="w-4 h-4 md:w-5 md:h-5" />
                    Go to Home Feed
                  </button>
                  
                  <button
                    onClick={handleCreateAnother}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-3 text-sm md:text-base"
                  >
                    <FaCamera className="w-4 h-4 md:w-5 md:h-5" />
                    Create Another Post
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Original form (when no post success yet)
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-app-bg">
        {/* Mobile Header - Fixed to match navbar */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border p-4 flex items-center justify-between lg:hidden">
          <Link href="/" className="p-2 hover:bg-surface-hover rounded-full">
            <FaArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-bold text-text-primary">Create Post</h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>

        {/* Desktop Header - Different spacing for sidebar */}
        <div className="hidden lg:block fixed top-0 left-64 right-0 z-50 bg-white border-b border-border p-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center text-text-secondary hover:text-text-primary"
            >
              <FaArrowLeft className="mr-2" />
              Back to Home
            </Link>
            <h1 className="text-xl font-bold text-text-primary">Create New Post</h1>
            <div className="w-24"></div> {/* Spacer for balance */}
          </div>
        </div>

        {/* Content with proper navbar spacing */}
        <div className="pt-16 lg:pt-20 lg:ml-64">
          <div className="max-w-4xl mx-auto px-4 py-4 md:py-8">
            {/* Desktop Header - Already shown in fixed header, but keep for spacing */}
            <div className="hidden lg:block mb-8">
              <p className="text-text-secondary">Share your delicious food creation with the community</p>
            </div>

            {/* Form Container */}
            <div className="bg-surface rounded-xl shadow-sm border border-border p-4 md:p-6">
              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                {/* Image Upload */}
                <div>
                  <label className="flex items-center gap-2 text-lg font-semibold text-text-primary mb-3 md:mb-4">
                    <FaCamera className="text-primary" />
                    Food Photo
                  </label>
                  
                  {imagePreview ? (
                    <div className="relative mb-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 md:h-64 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setImagePreview('')}
                        className="absolute top-2 right-2 bg-error text-white p-2 rounded-full hover:bg-error/90"
                      >
                        <FaTrash className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="border-2 border-dashed border-border rounded-xl p-8 md:p-12 text-center hover:border-primary transition-colors bg-surface-hover">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3 md:mb-4">
                            <FaCameraRetro className="text-primary text-xl md:text-2xl" />
                          </div>
                          <p className="text-text-primary font-medium text-sm md:text-base">Click to upload food photo</p>
                          <p className="text-text-secondary text-xs md:text-sm mt-1">or drag and drop</p>
                          <p className="text-text-tertiary text-xs mt-2">JPG, PNG up to 10MB</p>
                        </div>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>

                {/* Caption */}
                <div>
                  <label className="block text-lg font-semibold text-text-primary mb-3 md:mb-4">
                    <div className="flex items-center gap-2">
                      <FaPen className="text-primary" />
                      Description
                    </div>
                  </label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Tell us about your dish! Share the recipe, ingredients, or dining experience..."
                    rows={4}
                    className="w-full px-4 py-3 bg-surface-hover border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm md:text-base"
                    required
                  />
                  <div className="flex justify-between mt-2">
                    <p className="text-text-secondary text-xs md:text-sm">
                      Share your cooking story or recipe
                    </p>
                    <p className={`text-xs md:text-sm ${caption.length > 2200 ? 'text-error' : 'text-text-tertiary'}`}>
                      {caption.length}/2200
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-lg font-semibold text-text-primary mb-3 md:mb-4">
                    <div className="flex items-center gap-2">
                      <FaTag className="text-primary" />
                      Tags
                    </div>
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full flex items-center gap-2 text-sm"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-primary hover:text-primary-dark"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Add a tag and press Enter"
                    className="w-full px-4 py-3 bg-surface-hover border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
                  />
                </div>

                {/* Food Details */}
                <div>
                  <label className="flex items-center gap-2 text-lg font-semibold text-text-primary mb-3 md:mb-4">
                    <FaUtensils className="text-primary" />
                    Food Details
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {/* Cuisine */}
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Cuisine Type
                      </label>
                      <select
                        value={cuisine}
                        onChange={(e) => setCuisine(e.target.value)}
                        className="w-full px-4 py-3 bg-surface-hover border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
                      >
                        <option value="">Select cuisine</option>
                        {cuisineOptions.map((opt) => (
                          <option key={opt} value={opt.toLowerCase()}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    {/* Prep Time */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-2">
                        <FaClock className="w-3 h-3 md:w-4 md:h-4" />
                        Preparation Time
                      </label>
                      <select
                        value={prepTime}
                        onChange={(e) => setPrepTime(e.target.value)}
                        className="w-full px-4 py-3 bg-surface-hover border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
                      >
                        <option value="">Select time</option>
                        {prepTimeOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    {/* Difficulty */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Difficulty Level
                      </label>
                      <div className="flex gap-3 md:gap-4 flex-wrap">
                        {difficultyOptions.map((opt) => (
                          <label key={opt} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="difficulty"
                              value={opt}
                              checked={difficulty === opt}
                              onChange={(e) => setDifficulty(e.target.value)}
                              className="mr-2"
                            />
                            <span className="text-sm md:text-base">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Calories */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-2">
                        <FaFire className="w-3 h-3 md:w-4 md:h-4" />
                        Calories (optional)
                      </label>
                      <input
                        type="number"
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)}
                        placeholder="e.g., 450"
                        className="w-full px-4 py-3 bg-surface-hover border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
                      />
                    </div>

                    {/* Servings */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-2">
                        <FaUsers className="w-3 h-3 md:w-4 md:h-4" />
                        Servings (optional)
                      </label>
                      <input
                        type="number"
                        value={servings}
                        onChange={(e) => setServings(e.target.value)}
                        placeholder="e.g., 4"
                        className="w-full px-4 py-3 bg-surface-hover border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
                      />
                    </div>

                    {/* Location */}
                    <div className="sm:col-span-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-2">
                        <FaMapMarkerAlt className="w-3 h-3 md:w-4 md:h-4" />
                        Location (optional)
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., New York, NY"
                        className="w-full px-4 py-3 bg-surface-hover border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 md:pt-8 border-t border-border">
                  <button
                    type="submit"
                    disabled={loading || !caption.trim()}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 md:py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white"></div>
                        Publishing Post...
                      </>
                    ) : (
                      <>
                        <FaUpload className="w-4 h-4 md:w-5 md:h-5" />
                        Share Your Creation!
                      </>
                    )}
                  </button>
                  <p className="text-center text-text-secondary text-xs md:text-sm mt-3 md:mt-4">
                    Your post will be visible to the entire Craveo community
                  </p>
                </div>
              </form>
            </div>

            {/* Tips */}
            <div className="mt-6 md:mt-8 bg-surface border border-border rounded-lg p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-text-primary mb-3 md:mb-4 flex items-center gap-2">
                <FaLightbulb className="text-primary" />
                Tips for a great post:
              </h3>
              <ul className="space-y-2 md:space-y-3">
                <li className="flex items-start text-sm md:text-base">
                  <FaCameraRetro className="text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-text-secondary">Use good lighting for your food photos</span>
                </li>
                <li className="flex items-start text-sm md:text-base">
                  <FaPen className="text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-text-secondary">Share interesting details about the recipe or dining experience</span>
                </li>
                <li className="flex items-start text-sm md:text-base">
                  <FaTag className="text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-text-secondary">Add relevant tags to help others discover your post</span>
                </li>
                <li className="flex items-start text-sm md:text-base">
                  <FaSave className="text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-text-secondary">Your post will appear immediately in the home feed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}