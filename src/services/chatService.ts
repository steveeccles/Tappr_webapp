import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  read: boolean;
}

export interface Chat {
  id: string;
  participants: string[]; // Array of user IDs
  participantNames: { [userId: string]: string }; // Map of userId to display name
  participantAvatars: { [userId: string]: string }; // Map of userId to avatar/profile image
  lastMessage: string;
  lastMessageTime: Date;
  lastMessageSenderId: string;
  unreadCount: { [userId: string]: number }; // Unread count per user
  createdAt: Date;
}

export interface ChatConnection {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUserName: string;
  toUserName: string;
  cardCode: string; // The card code that initiated the connection
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  acceptedAt?: Date;
}

class ChatService {
  private static instance: ChatService;
  
  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  /**
   * Create a new chat connection when someone taps a card and chooses "Chat"
   */
  async createChatConnection(cardCode: string, choice: 'chat' | 'date'): Promise<ChatConnection> {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get the card owner's information
    const cardSnapshot = await firestore()
      .collection('cardCodes')
      .where('code', '==', cardCode)
      .get();

    if (cardSnapshot.empty) {
      throw new Error('Card not found');
    }

    const cardData = cardSnapshot.docs[0].data();
    const cardOwnerId = cardData.userId;
    const cardOwnerUsername = cardData.username;

    // Get the current user's profile
    const userDoc = await firestore().collection('users').doc(user.uid).get();
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }

    const userData = userDoc.data();
    const currentUserName = userData?.firstName || userData?.username || 'Anonymous';

    // Create the connection request
    const connection: Omit<ChatConnection, 'id'> = {
      fromUserId: user.uid,
      toUserId: cardOwnerId,
      fromUserName: currentUserName,
      toUserName: cardOwnerUsername,
      cardCode: cardCode,
      status: 'pending',
      createdAt: new Date(),
    };

    const docRef = await firestore().collection('chatConnections').add(connection);
    
    return {
      id: docRef.id,
      ...connection,
    };
  }

  /**
   * Accept a chat connection request
   */
  async acceptChatConnection(connectionId: string): Promise<Chat> {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Update the connection status
    await firestore().collection('chatConnections').doc(connectionId).update({
      status: 'accepted',
      acceptedAt: new Date(),
    });

    // Get the connection details
    const connectionDoc = await firestore().collection('chatConnections').doc(connectionId).get();
    if (!connectionDoc.exists()) {
      throw new Error('Connection not found');
    }

    const connectionData = connectionDoc.data() as ChatConnection;

    // Create a new chat
    const chat: Omit<Chat, 'id'> = {
      participants: [connectionData.fromUserId, connectionData.toUserId],
      participantNames: {
        [connectionData.fromUserId]: connectionData.fromUserName,
        [connectionData.toUserId]: connectionData.toUserName,
      },
      participantAvatars: {}, // Will be populated when we load user profiles
      lastMessage: '',
      lastMessageTime: new Date(),
      lastMessageSenderId: '',
      unreadCount: {
        [connectionData.fromUserId]: 0,
        [connectionData.toUserId]: 0,
      },
      createdAt: new Date(),
    };

    const chatDocRef = await firestore().collection('chats').add(chat);

    return {
      id: chatDocRef.id,
      ...chat,
    };
  }

  /**
   * Decline a chat connection request
   */
  async declineChatConnection(connectionId: string): Promise<void> {
    await firestore().collection('chatConnections').doc(connectionId).update({
      status: 'declined',
    });
  }

  /**
   * Get all chats for the current user
   */
  async getUserChats(): Promise<Chat[]> {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const snapshot = await firestore()
      .collection('chats')
      .where('participants', 'array-contains', user.uid)
      .get();

    const chats = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        lastMessageTime: data.lastMessageTime?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Chat;
    });

    // Sort by last message time (most recent first)
    return chats.sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
  }

  /**
   * Get pending chat connection requests for the current user
   */
  async getPendingConnections(): Promise<ChatConnection[]> {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const snapshot = await firestore()
      .collection('chatConnections')
      .where('toUserId', '==', user.uid)
      .where('status', '==', 'pending')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      acceptedAt: doc.data().acceptedAt?.toDate(),
    })) as ChatConnection[];
  }

  /**
   * Send a message in a chat
   */
  async sendMessage(chatId: string, text: string): Promise<ChatMessage> {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get user's name
    const userDoc = await firestore().collection('users').doc(user.uid).get();
    const userData = userDoc.data();
    const senderName = userData?.firstName || userData?.username || 'Anonymous';

    const message: Omit<ChatMessage, 'id'> = {
      text,
      senderId: user.uid,
      senderName,
      timestamp: new Date(),
      read: false,
    };

    // Add message to chat messages subcollection
    const messageRef = await firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .add(message);

    // Update chat's last message info
    await firestore().collection('chats').doc(chatId).update({
      lastMessage: text,
      lastMessageTime: new Date(),
      lastMessageSenderId: user.uid,
    });

    // Update unread counts for other participants
    const chatDoc = await firestore().collection('chats').doc(chatId).get();
    const chatData = chatDoc.data() as Chat;
    
    const updatedUnreadCount = { ...chatData.unreadCount };
    chatData.participants.forEach(participantId => {
      if (participantId !== user.uid) {
        updatedUnreadCount[participantId] = (updatedUnreadCount[participantId] || 0) + 1;
      }
    });

    await firestore().collection('chats').doc(chatId).update({
      unreadCount: updatedUnreadCount,
    });

    return {
      id: messageRef.id,
      ...message,
    };
  }

  /**
   * Get messages for a specific chat
   */
  async getChatMessages(chatId: string, limit: number = 50): Promise<ChatMessage[]> {
    const snapshot = await firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    })) as ChatMessage[];
  }

  /**
   * Mark messages as read in a chat
   */
  async markMessagesAsRead(chatId: string): Promise<void> {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Reset unread count for current user
    const chatDoc = await firestore().collection('chats').doc(chatId).get();
    const chatData = chatDoc.data() as Chat;
    
    const updatedUnreadCount = { ...chatData.unreadCount };
    updatedUnreadCount[user.uid] = 0;

    await firestore().collection('chats').doc(chatId).update({
      unreadCount: updatedUnreadCount,
    });
  }

  /**
   * Listen to real-time updates for user's chats
   */
  subscribeToUserChats(callback: (chats: Chat[]) => void): () => void {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    return firestore()
      .collection('chats')
      .where('participants', 'array-contains', user.uid)
      .onSnapshot(snapshot => {
        const chats = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            lastMessageTime: data.lastMessageTime?.toDate() || new Date(),
            createdAt: data.createdAt?.toDate() || new Date(),
          } as Chat;
        });

        // Sort by last message time (most recent first)
        const sortedChats = chats.sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
        callback(sortedChats);
      });
  }

  /**
   * Listen to real-time updates for chat messages
   */
  subscribeToChatMessages(chatId: string, callback: (messages: ChatMessage[]) => void): () => void {
    return firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .limit(50)
      .onSnapshot(snapshot => {
        const messages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date(),
        })) as ChatMessage[];

        callback(messages);
      });
  }
}

export default ChatService.getInstance(); 