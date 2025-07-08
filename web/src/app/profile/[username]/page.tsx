'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { UserService } from '@/services/userService';
import { UserProfile } from '@/types';
import { db } from '@/lib/firebase';
import { doc, collection, addDoc, setDoc, getDoc } from 'firebase/firestore';

function generateHex(length = 10) {
  return Array.from({length}, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

async function saveSubjectAction({ userHex, subjectName, subjectHex, action }: { userHex: string, subjectName: string, subjectHex: string, action: string }) {
  const userRef = doc(db, 'users', userHex);
  const actionsRef = collection(userRef, 'actions');
  await addDoc(actionsRef, {
    subjectName,
    subjectHex,
    action,
    timestamp: new Date().toISOString()
  });
}

async function createChatInstance(userHex: string, subjectHex: string, subjectName: string) {
  const chatId = `${userHex}_${subjectHex}`;
  const chatRef = doc(db, 'chats', chatId);
  const chatSnap = await getDoc(chatRef);
  if (!chatSnap.exists()) {
    await setDoc(chatRef, {
      participants: [userHex, subjectHex],
      subjectName,
      createdAt: new Date().toISOString()
    });
  }
  return chatId;
}

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [visitorName, setVisitorName] = useState('');
  const [subjectHex, setSubjectHex] = useState(() => typeof window !== 'undefined' && localStorage.getItem('subjectHex') || generateHex());
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('subjectHex', subjectHex);
    }
  }, [subjectHex]);

  useEffect(() => {
    loadUserProfile();
  }, [username]);

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
    const nameToUse = visitorName.trim();
    if (!nameToUse) {
      alert('Please enter your name first!');
      setSelectedAction(null);
      return;
    }
    try {
      await saveSubjectAction({
        userHex: user?.id || '',
        subjectName: nameToUse,
        subjectHex,
        action
      });
      if (action === 'chat' || action === 'arrange-date') {
        await createChatInstance(user?.id || '', subjectHex, nameToUse);
        setConfirmation(`Your request to ${action === 'chat' ? 'chat' : 'arrange a date'} has been sent!`);
      } else if (action === 'find-out-more') {
        setConfirmation('We will let the user know you want to find out more!');
      } else if (action === 'not-interested') {
        setConfirmation('Thanks for letting us know! 👋');
      }
    } catch (error) {
      console.error('Error handling action:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setSelectedAction(null);
    }
  };

  if (loading) {
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
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          {/* Dynamic Greeting */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Hey{visitorName && ` ${visitorName}`}! You tapped {user.name?.split(' ')[0] || user.name || ''}'s card!
            </h2>
          </div>
          {/* Name Input */}
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
              Bio
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
          {/* Confirmation Message */}
          {confirmation && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-center">{confirmation}</p>
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