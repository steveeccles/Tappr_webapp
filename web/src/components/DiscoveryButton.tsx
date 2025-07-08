'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DiscoveryButtonProps {
  targetUser: {
    uid: string;
    username: string;
    name: string;
  };
}

export default function DiscoveryButton({ targetUser }: DiscoveryButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStartDiscovery = async () => {
    setIsLoading(true);
    
    try {
      // Create discovery session
      const response = await fetch('/api/discovery/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetUserId: targetUser.uid,
          targetUsername: targetUser.username,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create discovery session');
      }

      const { sessionId } = await response.json();
      
      // Redirect to discovery questions
      router.push(`/discovery/${sessionId}/questions`);
    } catch (error) {
      console.error('Error starting discovery:', error);
      alert('Failed to start discovery. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleStartDiscovery}
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Starting Discovery...
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Find out more
        </div>
      )}
    </button>
  );
} 