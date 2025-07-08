'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import Link from 'next/link';
import ChatService, { Chat, ChatConnection } from '@/services/chatService';

export default function ChatsPage() {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [pendingConnections, setPendingConnections] = useState<ChatConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    loadChatsAndConnections();

    // Set up real-time listener for chats
    const unsubscribe = ChatService.subscribeToUserChats((updatedChats) => {
      setChats(updatedChats);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const loadChatsAndConnections = async () => {
    try {
      const [userChats, connections] = await Promise.all([
        ChatService.getUserChats(),
        ChatService.getPendingConnections(),
      ]);
      
      setChats(userChats);
      setPendingConnections(connections);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptConnection = async (connectionId: string) => {
    try {
      await ChatService.acceptChatConnection(connectionId);
      loadChatsAndConnections(); // Refresh the list
      alert('Chat connection accepted!');
    } catch (error) {
      console.error('Error accepting connection:', error);
      alert('Failed to accept connection');
    }
  };

  const handleDeclineConnection = async (connectionId: string) => {
    try {
      await ChatService.declineChatConnection(connectionId);
      loadChatsAndConnections(); // Refresh the list
    } catch (error) {
      console.error('Error declining connection:', error);
      alert('Failed to decline connection');
    }
  };

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
  };

  const getOtherParticipantName = (chat: Chat): string => {
    const otherParticipantId = chat.participants.find(id => id !== user?.uid);
    return otherParticipantId ? chat.participantNames[otherParticipantId] || 'Unknown' : 'Unknown';
  };

  const getUnreadCount = (chat: Chat): number => {
    return user ? chat.unreadCount[user.uid] || 0 : 0;
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">Chat with your connections</p>
        </div>

        {/* Pending Connection Requests */}
        {pendingConnections.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Requests</h2>
            <div className="space-y-4">
              {pendingConnections.map((connection) => (
                <div key={connection.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">New Connection Request</h3>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{connection.fromUserName}</span> wants to start a conversation
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimestamp(connection.createdAt)}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleAcceptConnection(connection.id)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDeclineConnection(connection.id)}
                      className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Chats */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {chats.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {chats.map((chat) => {
                const otherParticipantName = getOtherParticipantName(chat);
                const unreadCount = getUnreadCount(chat);
                
                return (
                  <Link
                    key={chat.id}
                    href={`/chats/${chat.id}`}
                    className="block hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center p-6">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-lg mr-4">
                        {otherParticipantName.charAt(0).toUpperCase()}
                      </div>
                      
                      {/* Chat Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {otherParticipantName}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {unreadCount > 0 && (
                              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                                {unreadCount}
                              </span>
                            )}
                            <span className="text-sm text-gray-500">
                              {formatTimestamp(chat.lastMessageTime)}
                            </span>
                          </div>
                        </div>
                        <p className={`text-sm mt-1 truncate ${
                          unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
                        }`}>
                          {chat.lastMessage || 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-600">
                Share your Tappr cards to start conversations!
              </p>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 