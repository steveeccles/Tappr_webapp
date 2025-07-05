'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserProfile } from '@/types';

interface ProfilePageProps {
  params: {
    username: string;
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        // In a real app, you'd query by username, but for now we'll use a demo
        // You can replace this with actual Firestore query by username
        setProfile({
          firstName: "Alex",
          lastName: "Smith",
          username: params.username,
          bio: "Love hiking, coffee, and good conversations. Always up for trying new restaurants or exploring the city. Looking for someone who shares my passion for adventure and authentic connections.",
          dateIdeas: [
            "Coffee walk in the park",
            "Visit the local art gallery",
            "Try that new sushi place downtown"
          ],
          profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
          age: 28,
          location: "London, UK"
        });
      } catch (err) {
        setError('Profile not found');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [params.username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600">This Tappr profile doesn't exist or has been deactivated.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-pink-600">TAPPR</h1>
            <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Get Your Own Cards
            </button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-pink-500 to-red-500 px-8 py-12 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img
                src={profile.profileImageUrl}
                alt={`${profile.firstName} ${profile.lastName}`}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-pink-100 text-lg mb-2">@{profile.username}</p>
                {profile.age && profile.location && (
                  <p className="text-pink-100">
                    {profile.age} • {profile.location}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About Me</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              {profile.bio}
            </p>

            {/* Date Ideas */}
            {profile.dateIdeas && profile.dateIdeas.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Date Ideas</h2>
                <div className="grid gap-4">
                  {profile.dateIdeas.map((idea, index) => (
                    <div key={index} className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💡</span>
                        <p className="text-gray-800 font-medium">{idea}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-4 px-6 rounded-lg font-semibold text-lg">
                💬 Start a Conversation
              </button>
              <button className="flex-1 border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white py-4 px-6 rounded-lg font-semibold text-lg">
                📅 Arrange a Date
              </button>
            </div>
          </div>
        </div>

        {/* Get Your Own Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Want your own Tappr cards?
          </h3>
          <p className="text-gray-600 mb-6">
            Join thousands making authentic connections with digital dating cards.
          </p>
          <button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 rounded-lg text-lg font-semibold">
            Get Started - £12.99/month
          </button>
        </div>
      </div>
    </div>
  );
} 