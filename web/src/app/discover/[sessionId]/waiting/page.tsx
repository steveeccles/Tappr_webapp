'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DiscoveryService, { DiscoverySession } from '@/services/discoveryService';

export default function WaitingPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  
  const [session, setSession] = useState<DiscoverySession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    // Subscribe to session updates
    const unsubscribe = DiscoveryService.subscribeToDiscoverySession(sessionId, (updatedSession) => {
      if (!updatedSession) {
        setLoading(false);
        return;
      }

      setSession(updatedSession);
      setLoading(false);

      // If the session is completed, redirect to results
      if (updatedSession.status === 'completed') {
        router.push(`/discover/${sessionId}/results`);
      }
    });

    return unsubscribe;
  }, [sessionId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Session not found</h1>
          <p className="text-gray-600 mb-6">This discovery session doesn't exist or has been removed.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const timeRemaining = Math.max(0, session.expiresAt.getTime() - new Date().getTime());
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-4 inline-block mb-4">
            <h1 className="text-2xl font-bold text-indigo-600">Tappr</h1>
          </div>
        </div>

        {/* Waiting Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          
          {/* Animation */}
          <div className="mb-6">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
              <div className="absolute inset-4 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Answers Submitted! 
          </h2>
          
          <p className="text-gray-600 mb-6">
            We've sent a notification to <span className="font-semibold text-indigo-600">{session.targetUserName}</span> 
            to answer the same questions. You'll get notified when they respond!
          </p>

          {/* Status Steps */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">You answered 5 compatibility questions</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center mr-3 animate-pulse">
                  <span className="text-white text-sm">⏳</span>
                </div>
                <span className="text-gray-700">Waiting for {session.targetUserName} to respond</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                  <span className="text-gray-500 text-sm">3</span>
                </div>
                <span className="text-gray-500">View compatibility results together</span>
              </div>
            </div>
          </div>

          {/* Time Info */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center">
              <span className="text-blue-600 text-sm">
                ⏰ They have {hoursRemaining} hours to respond
              </span>
            </div>
          </div>

          {/* What happens next */}
          <div className="text-left bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">📱</span>
                <span>{session.targetUserName} will get a notification on their mobile app</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">📝</span>
                <span>They'll answer the same 5 questions you just completed</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">🎯</span>
                <span>You'll both see your compatibility score and matches</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">💬</span>
                <span>Perfect conversation starters for when you chat!</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
            >
              Check for Updates
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            >
              Close This Window
            </button>
          </div>

          {/* Bookmark Reminder */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              💡 <strong>Tip:</strong> Bookmark this page! You'll get a notification when results are ready, 
              but you can always come back here to check.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 