'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';

export default function DashboardPage() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.profile?.name || user?.displayName}! 👋
              </h1>
              <p className="text-gray-600 mt-2">@{user?.profile?.username}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Profile</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Profile URL:</span>
                <Link 
                  href={`/profile/${user?.profile?.username}`}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  View Profile
                </Link>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="text-gray-900">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Member since:</span>
                <span className="text-gray-900">
                  {user?.profile?.createdAt ? new Date(user.profile.createdAt).toLocaleDateString() : 'Recently'}
                </span>
              </div>
            </div>
            
            <Link 
              href="/profile"
              className="mt-4 w-full inline-block text-center py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
            >
              Manage Your Profile
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📱</div>
                <p>No recent activity</p>
                <p className="text-sm">Share your Tappr cards to start connecting!</p>
              </div>
            </div>
            
            <Link 
              href="/connections"
              className="mt-4 w-full inline-block text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              View Connections
            </Link>
          </div>
        </div>

        {/* Features Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Tappr Experience</h2>
          <div className="grid md:grid-cols-3 gap-4">
            
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-2xl mb-2">👤</div>
              <h3 className="font-medium text-gray-900">Profile</h3>
              <p className="text-sm text-gray-600">Create and customize your digital identity</p>
              <Link 
                href="/profile"
                className="mt-2 inline-block text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                Manage →
              </Link>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">💬</div>
              <h3 className="font-medium text-gray-900">Connections</h3>
              <p className="text-sm text-gray-600">Track your chat and date requests</p>
              <Link 
                href="/connections"
                className="mt-2 inline-block text-green-600 hover:text-green-700 text-sm font-medium"
              >
                View →
              </Link>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">⚙️</div>
              <h3 className="font-medium text-gray-900">Settings</h3>
              <p className="text-sm text-gray-600">Customize your account preferences</p>
              <Link 
                href="/settings"
                className="mt-2 inline-block text-gray-600 hover:text-gray-700 text-sm font-medium"
              >
                Configure →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 