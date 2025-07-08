'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import Link from 'next/link';
import ChatService, { ChatConnection } from '@/services/chatService';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ConnectionRequest {
  id: string;
  type: 'chat' | 'date';
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
  createdAt: Timestamp;
}

export default function ConnectionsPage() {
  const { user } = useAuth();
  const [sentRequests, setSentRequests] = useState<ChatConnection[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<ChatConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('received');

  useEffect(() => {
    if (!user) return;

    loadConnections();

    // Listen to connection requests in real-time
    const sentQuery = query(
      collection(db, 'chatConnections'),
      where('fromUserId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const receivedQuery = query(
      collection(db, 'chatConnections'),
      where('toUserId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeSent = onSnapshot(sentQuery, (snapshot) => {
      const requests: ChatConnection[] = [];
      snapshot.forEach((doc) => {
        requests.push({ 
          id: doc.id, 
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          acceptedAt: doc.data().acceptedAt?.toDate()
        } as ChatConnection);
      });
      setSentRequests(requests);
      setLoading(false);
    });

    const unsubscribeReceived = onSnapshot(receivedQuery, (snapshot) => {
      const requests: ChatConnection[] = [];
      snapshot.forEach((doc) => {
        requests.push({ 
          id: doc.id, 
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          acceptedAt: doc.data().acceptedAt?.toDate()
        } as ChatConnection);
      });
      setReceivedRequests(requests);
    });

    return () => {
      unsubscribeSent();
      unsubscribeReceived();
    };
  }, [user]);

  const loadConnections = async () => {
    try {
      const [sent, received] = await Promise.all([
        getSentConnections(),
        ChatService.getPendingConnections(),
      ]);
      
      setSentRequests(sent);
      setReceivedRequests(received);
    } catch (error) {
      console.error('Error loading connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSentConnections = async (): Promise<ChatConnection[]> => {
    // For now, return empty array since we don't have a specific method for sent connections
    // In a real implementation, you'd query chatConnections where fromUserId === user.uid
    return [];
  };

  const handleAcceptConnection = async (connectionId: string) => {
    try {
      const chat = await ChatService.acceptChatConnection(connectionId);
      alert('Connection accepted! Starting chat...');
      
      // Navigate to the new chat
      window.location.href = `/chats/${chat.id}`;
    } catch (error) {
      console.error('Error accepting connection:', error);
      alert('Failed to accept connection');
    }
  };

  const handleDeclineConnection = async (connectionId: string) => {
    try {
      await ChatService.declineChatConnection(connectionId);
      alert('Connection declined');
    } catch (error) {
      console.error('Error declining connection:', error);
      alert('Failed to decline connection');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'accepted': return 'text-green-600 bg-green-100';
      case 'declined': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeEmoji = (type: string) => {
    return type === 'chat' ? '💬' : '💕';
  };

  const formatDate = (date: Date) => {
    if (!date) return 'Recently';
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // Less than a week
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderConnectionCard = (connection: ChatConnection, isSent: boolean) => (
    <div key={connection.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">💬</div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-gray-900">
                {isSent ? connection.toUserName : connection.fromUserName}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(connection.status)}`}>
                {connection.status.charAt(0).toUpperCase() + connection.status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Connection request
              {isSent ? ' sent to' : ' from'} {isSent ? connection.toUserName : connection.fromUserName}
            </p>
            
            {/* Accept/Decline buttons for pending received requests */}
            {!isSent && connection.status === 'pending' && (
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => handleAcceptConnection(connection.id)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors"
                >
                  Accept & Chat
                </button>
                <button
                  onClick={() => handleDeclineConnection(connection.id)}
                  className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded transition-colors"
                >
                  Decline
                </button>
              </div>
            )}
            
            {/* Chat link for accepted connections */}
            {connection.status === 'accepted' && (
              <Link 
                href="/chats"
                className="inline-block mt-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                Go to Chats →
              </Link>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">{formatDate(connection.createdAt)}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Connections</h1>
          <p className="text-gray-600">Manage your connection requests</p>
          
          {/* Quick Actions */}
          <div className="flex space-x-4 mt-4">
            <Link 
              href="/chats"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
            >
              Go to Chats
            </Link>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 mt-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('received')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'received'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Received ({receivedRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'sent'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sent ({sentRequests.length})
            </button>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {activeTab === 'received' ? (
            receivedRequests.length > 0 ? (
              receivedRequests.map((request) => renderConnectionCard(request, false))
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="text-4xl mb-4">📥</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No received requests</h3>
                <p className="text-gray-600">Share your Tappr profile to start receiving connection requests!</p>
              </div>
            )
          ) : (
            sentRequests.length > 0 ? (
              sentRequests.map((request) => renderConnectionCard(request, true))
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="text-4xl mb-4">📤</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No sent requests</h3>
                <p className="text-gray-600">When you tap someone's card, your connection requests will appear here!</p>
              </div>
            )
          )}
        </div>

        {/* Stats Summary */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Connection Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{sentRequests.length}</div>
              <div className="text-sm text-blue-600">Sent</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{receivedRequests.length}</div>
              <div className="text-sm text-green-600">Received</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {[...sentRequests, ...receivedRequests].filter(r => r.status === 'pending').length}
              </div>
              <div className="text-sm text-yellow-600">Pending</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {[...sentRequests, ...receivedRequests].filter(r => r.status === 'accepted').length}
              </div>
              <div className="text-sm text-purple-600">Connected</div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 