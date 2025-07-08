'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

export default function ActivateCard() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const qrId = params.qrId as string;

  const handleActivation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate QR card exists and is not already activated
      const qrCardRef = doc(db, 'qrCards', qrId);
      const qrCardDoc = await getDoc(qrCardRef);

      if (!qrCardDoc.exists()) {
        setError('Invalid QR code. This card does not exist.');
        setLoading(false);
        return;
      }

      const qrCardData = qrCardDoc.data();
      if (qrCardData.isActivated) {
        setError('This card has already been activated.');
        setLoading(false);
        return;
      }

      // Check if user exists
      const usersRef = collection(db, 'users');
      const userQuery = query(usersRef, where('email', '==', email.toLowerCase()));
      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.empty) {
        setError('No account found with this email. Please create an account first.');
        setLoading(false);
        return;
      }

      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();

      // Check if user already has a QR card
      if (userData.qrCodeId) {
        setError('This account already has a QR card linked.');
        setLoading(false);
        return;
      }

      // Activate the card
      await updateDoc(qrCardRef, {
        isActivated: true,
        activatedBy: userDoc.id,
        activatedAt: new Date().toISOString(),
      });

      // Link card to user
      await updateDoc(doc(db, 'users', userDoc.id), {
        qrCodeId: qrId,
        profileUrl: `https://tappr.uk/profile/${userData.username}`,
      });

      setSuccess(true);
      
      // Redirect to profile after 3 seconds
      setTimeout(() => {
        router.push(`/profile/${userData.username}`);
      }, 3000);

    } catch (err) {
      console.error('Activation error:', err);
      setError('Failed to activate card. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-green-700 mb-4">Card Activated!</h1>
          <p className="text-gray-600 mb-6">
            Your QR card has been successfully linked to your account.
            Redirecting to your profile...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Activate Your Tappr Card</h1>
          <p className="text-gray-600">
            Link this QR card (ID: <span className="font-mono font-bold">{qrId}</span>) to your account
          </p>
        </div>

        <form onSubmit={handleActivation} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Activating...' : 'Activate Card'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-500 hover:text-blue-600">
              Create one here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 