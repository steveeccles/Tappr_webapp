'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import ChatService, { Chat, ChatMessage } from '@/services/chatService';
import { ArrowLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

export default function ChatPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const chatId = params.chatId as string;
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const [otherParticipantName, setOtherParticipantName] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user || !chatId) return;

    loadChatData();
    
    // Set up real-time message listener
    const unsubscribe = ChatService.subscribeToChatMessages(chatId, (updatedMessages) => {
      // Reverse messages since Firebase returns them in descending order
      setMessages(updatedMessages.reverse());
      setLoading(false);
      
      // Auto-scroll to bottom when new messages arrive
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    });

    // Mark messages as read when chat is opened
    ChatService.markMessagesAsRead(chatId);

    return unsubscribe;
  }, [user, chatId]);

  const loadChatData = async () => {
    try {
      const userChats = await ChatService.getUserChats();
      const currentChat = userChats.find(c => c.id === chatId);
      
      if (currentChat) {
        setChat(currentChat);
        const otherParticipantId = currentChat.participants.find(id => id !== user?.uid);
        const participantName = otherParticipantId 
          ? currentChat.participantNames[otherParticipantId] || 'Unknown'
          : 'Unknown';
        setOtherParticipantName(participantName);
      }
    } catch (error) {
      console.error('Error loading chat data:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim() || sending) return;

    try {
      setSending(true);
      await ChatService.sendMessage(chatId, inputText.trim());
      setInputText('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: ChatMessage, index: number) => {
    const isOwnMessage = message.senderId === user?.uid;
    const previousMessage = index > 0 ? messages[index - 1] : null;
    const showSenderName = !isOwnMessage && (!previousMessage || previousMessage.senderId !== message.senderId);
    
    return (
      <div
        key={message.id}
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isOwnMessage ? 'order-1' : 'order-2'}`}>
          {showSenderName && (
            <p className="text-xs text-gray-500 mb-1 px-3">
              {message.senderName}
            </p>
          )}
          <div
            className={`rounded-2xl px-4 py-2 ${
              isOwnMessage
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <p className="text-sm">{message.text}</p>
            <p className={`text-xs mt-1 ${
              isOwnMessage ? 'text-indigo-200' : 'text-gray-500'
            }`}>
              {formatMessageTime(message.timestamp)}
            </p>
          </div>
        </div>
      </div>
    );
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
      <div className="container mx-auto px-4 py-4 max-w-4xl h-screen flex flex-col">
        
        {/* Chat Header */}
        <div className="bg-white rounded-2xl shadow-xl p-4 mb-4 flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold mr-3">
            {otherParticipantName.charAt(0).toUpperCase()}
          </div>
          
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {otherParticipantName}
            </h1>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>

        {/* Messages Container */}
        <div className="bg-white rounded-2xl shadow-xl flex-1 flex flex-col overflow-hidden">
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6">
            {messages.length > 0 ? (
              <>
                {messages.map((message, index) => renderMessage(message, index))}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <div className="text-4xl mb-4">💬</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                  <p className="text-gray-600">Start the conversation!</p>
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || sending}
                className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <PaperAirplaneIcon className="h-6 w-6" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 