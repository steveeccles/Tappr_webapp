'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { UserService } from '@/services/userService';
import { UserProfile } from '@/types';
import ChatService from '@/services/chatService';
import DiscoveryService from '@/services/discoveryService';
import { useAuth } from '@/contexts/AuthContext';

export default function TapPage() {
  const params = useParams();
  const username = params.username as string;
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [visitorName, setVisitorName] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  
  const { user: authUser, loading: authLoading } = useAuth();

  useEffect(() => {
    loadUserProfile();
  }, [username]);

  // Pre-fill visitor name if user is authenticated
  useEffect(() => {
    if (authUser?.profile?.name && !visitorName) {
      setVisitorName(authUser.profile.name);
    }
  }, [authUser, visitorName]);

  const loadUserProfile = async () => {
    try {
      const userProfile = await UserService.getUserByUsername(username);
      setUser(userProfile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string) => {
    setSelectedAction(action);
    
    // For authenticated users, use their profile name
    const nameToUse = authUser?.profile?.name || visitorName.trim();
    
    if (!nameToUse) {
      alert('Please enter your name first!');
      setSelectedAction(null);
      return;
    }

    try {
      // Handle different actions
      switch (action) {
        case 'not-interested':
          // Just log and show thank you message
          console.log(`${nameToUse} is not interested in ${user?.name}'s profile`);
          alert('Thanks for letting us know! 👋');
          break;
          
        case 'find-out-more':
          // Create compatibility discovery session
          if (!user?.id) {
            // For anonymous users, redirect to full profile for now
            window.location.href = `/profile/${username}`;
            return;
          }
          
          try {
            const session = await DiscoveryService.createDiscoverySession(
              user.id,
              user.name || user.username,
              nameToUse
            );
            
            // Redirect to discovery questions
            window.location.href = `/discover/${session.id}`;
            return;
          } catch (error) {
            console.error('Error creating discovery session:', error);
            // Fallback to profile page
            window.location.href = `/profile/${username}`;
            return;
          }
          
        case 'chat':
          // Only authenticated users can create chat connections
          if (!authUser) {
            alert('Please sign in to send chat requests!');
            window.location.href = `/login?redirect=${encodeURIComponent(`/tap/${username}`)}`;
            return;
          }
          
          if (!user?.id) {
            alert('User profile not found');
            return;
          }
          
          // Create chat connection in Firebase using new ChatService
          await ChatService.createChatConnection(
            user.id,
            user.name || user.username,
            authUser.profile?.name || authUser.displayName || 'Unknown'
          );
          
          alert(`Chat request sent to ${user?.name}! 💬 You can view your conversations in the Chats tab.`);
          break;
          
        case 'arrange-date':
          // Only authenticated users can create date requests
          if (!authUser) {
            alert('Please sign in to send date requests!');
            window.location.href = `/login?redirect=${encodeURIComponent(`/tap/${username}`)}`;
            return;
          }
          
          if (!user?.id) {
            alert('User profile not found');
            return;
          }
          
          // For now, create a chat connection for date requests too
          // In the future, this could be a separate date request system
          await ChatService.createChatConnection(
            user.id,
            user.name || user.username,
            authUser.profile?.name || authUser.displayName || 'Unknown'
          );
          
          alert(`Date request sent to ${user?.name}! 💕 You can view your conversations in the Chats tab.`);
          break;
      }
    } catch (error) {
      console.error('Error handling action:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setSelectedAction(null);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User not found</h1>
          <p className="text-gray-600">This Tappr card doesn't seem to exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-md">
        
        {/* Tappr Logo */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-4 inline-block">
            <h1 className="text-2xl font-bold text-indigo-600">Tappr</h1>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          
          {/* Authentication Status Banner */}
          {authUser ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
              <div className="flex items-center">
                <div className="text-green-500 mr-2">✓</div>
                <div>
                  <p className="text-green-800 font-medium">Signed in as {authUser.profile?.name}</p>
                  <Link href="/dashboard" className="text-green-600 text-sm hover:underline">
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
              <div className="text-center">
                <p className="text-blue-800 mb-2">Sign in to send messages!</p>
                <div className="space-x-3">
                  <Link 
                    href={`/login?redirect=${encodeURIComponent(`/tap/${username}`)}`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Sign In
                  </Link>
                  <span className="text-blue-400">•</span>
                  <Link 
                    href={`/signup?redirect=${encodeURIComponent(`/tap/${username}`)}`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
          )}
          
          {/* Dynamic Greeting */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Hey{(authUser?.profile?.name || visitorName) && `, ${authUser?.profile?.name || visitorName}`}! You tapped {user.name?.split(' ')[0] || user.username}'s card! 
            </h2>
          </div>

          {/* Name Input - Only show for non-authenticated users */}
          {!authUser && (
            <div className="mb-6">
              <label htmlFor="visitorName" className="block text-sm font-medium text-gray-700 mb-2">
                Your name:
              </label>
              <input
                type="text"
                id="visitorName"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-lg"
              />
            </div>
          )}

          {/* Profile Picture */}
          <div className="text-center mb-6">
            <div className="inline-block">
              {user.avatar || user.photoURL ? (
                <Image
                  src={user.avatar || user.photoURL || ''}
                  alt={user.name || user.username}
                  width={120}
                  height={120}
                  className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-indigo-200">
                  <span className="text-3xl font-bold text-indigo-600">
                    {(user.name || user.username).charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mt-3">
              {user.name || `@${user.username}`}
            </h3>
            {user.bio && (
              <p className="text-gray-600 mt-2 text-sm">{user.bio}</p>
            )}
          </div>

          {/* Call to Action */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">So, what next?</h3>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleAction('not-interested')}
              disabled={selectedAction === 'not-interested'}
              className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors duration-200 disabled:opacity-50"
            >
              {selectedAction === 'not-interested' ? 'Processing...' : 'Not interested'}
            </button>
            
            <button
              onClick={() => handleAction('find-out-more')}
              disabled={selectedAction === 'find-out-more'}
              className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors duration-200 disabled:opacity-50"
            >
              {selectedAction === 'find-out-more' ? 'Starting...' : 'Find out more 🎯'}
            </button>
            
            <button
              onClick={() => handleAction('chat')}
              disabled={selectedAction === 'chat'}
              className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors duration-200 disabled:opacity-50"
            >
              {selectedAction === 'chat' ? 'Sending...' : 'Chat 💬'}
            </button>
            
            <button
              onClick={() => handleAction('arrange-date')}
              disabled={selectedAction === 'arrange-date'}
              className="w-full py-3 px-4 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-xl transition-colors duration-200 disabled:opacity-50"
            >
              {selectedAction === 'arrange-date' ? 'Sending...' : 'Arrange a date 💕'}
            </button>
          </div>

          {/* Note for anonymous users */}
          {!authUser && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm text-center">
                💡 Sign in to save your connections and chat directly within Tappr!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Powered by <span className="font-semibold text-indigo-600">Tappr</span>
          </p>
        </div>
      </div>
    </div>
  );
} 