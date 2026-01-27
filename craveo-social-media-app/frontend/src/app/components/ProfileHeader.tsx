'use client';

import { FaCamera, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import Button from './Button';
import { useState } from 'react';

interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  bio: string;
  avatar: string;
  followers: number;
  following: number;
  posts: number;
  isVerified: boolean;
  isFollowing: boolean;
  isOwnProfile: boolean;
}

interface ProfileHeaderProps {
  user: UserProfile;
  onFollow?: () => void;
  onEditProfile?: () => void;
  onAvatarChange?: (file: File) => void;
}

export default function ProfileHeader({
  user,
  onFollow,
  onEditProfile,
  onAvatarChange,
}: ProfileHeaderProps) {
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(user.bio);
  const [isUploading, setIsUploading] = useState(false);

  const handleFollowClick = () => {
    if (onFollow) onFollow();
  };

  const handleEditClick = () => {
    if (onEditProfile) onEditProfile();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAvatarChange) {
      setIsUploading(true);
      onAvatarChange(file);
      
      setTimeout(() => setIsUploading(false), 1000);
    }
  };

  const handleSaveBio = () => {

    setIsEditingBio(false);
  };

  const handleCancelBio = () => {
    setBioText(user.bio);
    setIsEditingBio(false);
  };

  return (
    <div className="bg-surface rounded-xl shadow-lg overflow-hidden">
      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-primary to-secondary relative">
        {user.isOwnProfile && (
          <div className="absolute top-4 right-4">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <div className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg flex items-center gap-2 text-text-primary hover:bg-white transition-colors">
                <FaCamera />
                <span>Change Cover</span>
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-8 pb-8 -mt-16 relative">
        {/* Avatar */}
        <div className="relative">
          <div className="w-40 h-40 rounded-full border-4 border-surface overflow-hidden bg-surface-hover">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-full h-full object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          
          {user.isOwnProfile && (
            <label className="absolute bottom-4 right-4 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors shadow-lg">
                <FaCamera className="w-5 h-5" />
              </div>
            </label>
          )}
        </div>

        {/* User Info */}
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-text-primary">
              {user.fullName}
            </h1>
            {user.isVerified && (
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">✓</span>
              </div>
            )}
          </div>
          
          <p className="text-text-secondary text-lg">@{user.username}</p>
          
          {/* Bio */}
          <div className="mt-6">
            {isEditingBio ? (
              <div className="space-y-3">
                <textarea
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-hover border border-border rounded-lg text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  maxLength={160}
                />
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<FaCheck />}
                    onClick={handleSaveBio}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<FaTimes />}
                    onClick={handleCancelBio}
                  >
                    Cancel
                  </Button>
                  <div className="flex-1 text-right text-sm text-text-tertiary">
                    {bioText.length}/160
                  </div>
                </div>
              </div>
            ) : (
              <div className="group">
                <p className="text-text-primary whitespace-pre-line">
                  {user.bio || 'No bio yet'}
                </p>
                {user.isOwnProfile && (
                  <button
                    onClick={() => setIsEditingBio(true)}
                    className="mt-2 text-primary hover:text-primary-dark text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Edit bio
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-text-primary">
                {user.posts.toLocaleString()}
              </div>
              <div className="text-text-secondary text-sm">Posts</div>
            </div>
            <button className="text-center hover:opacity-80 transition-opacity">
              <div className="text-2xl font-bold text-text-primary">
                {user.followers.toLocaleString()}
              </div>
              <div className="text-text-secondary text-sm">Followers</div>
            </button>
            <button className="text-center hover:opacity-80 transition-opacity">
              <div className="text-2xl font-bold text-text-primary">
                {user.following.toLocaleString()}
              </div>
              <div className="text-text-secondary text-sm">Following</div>
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8">
            {user.isOwnProfile ? (
              <Button
                variant="outline"
                icon={<FaEdit />}
                onClick={handleEditClick}
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  variant={user.isFollowing ? 'secondary' : 'primary'}
                  onClick={handleFollowClick}
                >
                  {user.isFollowing ? 'Following' : 'Follow'}
                </Button>
                <Button variant="outline">Message</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
