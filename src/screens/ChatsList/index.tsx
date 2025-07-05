import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { useAppContext } from '../../contexts/AppContext';
import ChatService, { Chat, ChatConnection } from '../../services/chatService';
import TapprHeader from '../../components/TapprHeader';
import { theme, commonStyles } from '../../styles/theme';

// Helper function to format timestamp
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

// Helper function to get other participant's name
const getOtherParticipantName = (chat: Chat, currentUserId: string): string => {
  const otherParticipantId = chat.participants.find(id => id !== currentUserId);
  return otherParticipantId ? chat.participantNames[otherParticipantId] || 'Unknown' : 'Unknown';
};

// Helper function to get avatar initial
const getAvatarInitial = (name: string): string => {
  return name.charAt(0).toUpperCase();
};

const ChatItem = ({ chat, currentUserId, onPress }: { chat: Chat; currentUserId: string; onPress: () => void }) => {
  const otherParticipantName = getOtherParticipantName(chat, currentUserId);
  const unreadCount = chat.unreadCount[currentUserId] || 0;
  
  return (
    <TouchableOpacity style={styles.chatItem} onPress={onPress}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getAvatarInitial(otherParticipantName)}</Text>
        </View>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{otherParticipantName}</Text>
          <Text style={styles.timestamp}>{formatTimestamp(chat.lastMessageTime)}</Text>
        </View>
        <Text 
          style={[
            styles.lastMessage,
            unreadCount > 0 && styles.unreadMessage
          ]}
          numberOfLines={1}
        >
          {chat.lastMessage || 'No messages yet'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const ChatsListScreen = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [pendingConnections, setPendingConnections] = useState<ChatConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const user = auth().currentUser;

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
      Alert.alert('Error', 'Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const handleChatPress = (chatId: string) => {
    // TODO: Navigate to individual chat screen
    console.log('Navigate to chat:', chatId);
    Alert.alert('Chat', `Opening chat ${chatId}`);
  };

  const handleAcceptConnection = async (connectionId: string) => {
    try {
      await ChatService.acceptChatConnection(connectionId);
      loadChatsAndConnections(); // Refresh the list
      Alert.alert('Success', 'Chat connection accepted!');
    } catch (error) {
      console.error('Error accepting connection:', error);
      Alert.alert('Error', 'Failed to accept connection');
    }
  };

  const handleDeclineConnection = async (connectionId: string) => {
    try {
      await ChatService.declineChatConnection(connectionId);
      loadChatsAndConnections(); // Refresh the list
    } catch (error) {
      console.error('Error declining connection:', error);
      Alert.alert('Error', 'Failed to decline connection');
    }
  };

  const renderChatItem = ({ item }: { item: Chat }) => (
    <ChatItem 
      chat={item} 
      currentUserId={user?.uid || ''} 
      onPress={() => handleChatPress(item.id)} 
    />
  );

  const renderPendingConnection = ({ item }: { item: ChatConnection }) => (
    <View style={styles.pendingItem}>
      <View style={styles.pendingInfo}>
        <Text style={styles.pendingTitle}>New Connection Request</Text>
        <Text style={styles.pendingName}>{item.fromUserName}</Text>
        <Text style={styles.pendingMessage}>wants to start a conversation</Text>
      </View>
      <View style={styles.pendingActions}>
        <TouchableOpacity 
          style={styles.acceptButton}
          onPress={() => handleAcceptConnection(item.id)}
        >
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.declineButton}
          onPress={() => handleDeclineConnection(item.id)}
        >
          <Text style={styles.declineButtonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <TapprHeader title="Messages" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading chats...</Text>
        </View>
      </View>
    );
  }

  // Empty State
  if (chats.length === 0 && pendingConnections.length === 0) {
    return (
      <View style={styles.container}>
        <TapprHeader title="Messages" />
        <View style={styles.emptyContainer}>
          <Feather name="message-circle" size={64} color={theme.colors.lightGray} />
          <Text style={styles.emptyTitle}>No messages yet</Text>
          <Text style={styles.emptySubtitle}>
            Share your Tappr cards to start conversations!
          </Text>
        </View>
      </View>
    );
  }

  // Has content
  return (
    <View style={styles.container}>
      <TapprHeader title="Messages" />
      
      {pendingConnections.length > 0 && (
        <View style={styles.pendingSection}>
          <Text style={styles.sectionTitle}>Pending Requests</Text>
          <FlatList
            data={pendingConnections}
            renderItem={renderPendingConnection}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        style={styles.chatList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ChatsListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.gray,
  },
  
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.gray,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  
  emptySubtitle: {
    fontSize: 16,
    color: theme.colors.lightGray,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  chatList: {
    flex: 1,
  },
  
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  avatarText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  
  unreadBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: theme.colors.black,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  
  unreadText: {
    color: theme.colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  chatInfo: {
    flex: 1,
  },
  
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.black,
  },
  
  timestamp: {
    fontSize: 12,
    color: theme.colors.gray,
  },
  
  lastMessage: {
    fontSize: 14,
    color: theme.colors.gray,
  },
  
  unreadMessage: {
    color: theme.colors.black,
    fontWeight: '500',
  },
  
  pendingSection: {
    backgroundColor: theme.colors.white,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.black,
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  
  pendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: theme.colors.backgroundSecondary,
    marginHorizontal: 24,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  
  pendingInfo: {
    flex: 1,
    marginRight: 12,
  },
  
  pendingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.black,
    marginBottom: 2,
  },
  
  pendingName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.primary,
    marginBottom: 2,
  },
  
  pendingMessage: {
    fontSize: 14,
    color: theme.colors.gray,
  },
  
  pendingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  
  acceptButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  
  acceptButtonText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  
  declineButton: {
    backgroundColor: theme.colors.backgroundSecondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  
  declineButtonText: {
    color: theme.colors.gray,
    fontSize: 14,
    fontWeight: '600',
  },
}); 