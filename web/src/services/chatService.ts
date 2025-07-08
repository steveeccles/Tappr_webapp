import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  arrayUnion, 
  Timestamp 
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

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
  cardCode?: string; // The card code that initiated the connection
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
  async createChatConnection(toUserId: string, toUserName: string, fromUserName: string): Promise<ChatConnection> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Create the connection request
    const connection: Omit<ChatConnection, 'id'> = {
      fromUserId: user.uid,
      toUserId: toUserId,
      fromUserName: fromUserName,
      toUserName: toUserName,
      status: 'pending',
      createdAt: new Date(),
    };

    const docRef = await addDoc(collection(db, 'chatConnections'), connection);
    
    return {
      id: docRef.id,
      ...connection,
    };
  }

  /**
   * Accept a chat connection request
   */
  async acceptChatConnection(connectionId: string): Promise<Chat> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Update the connection status
    await updateDoc(doc(db, 'chatConnections', connectionId), {
      status: 'accepted',
      acceptedAt: new Date(),
    });

    // Get the connection details
    const connectionDoc = await getDoc(doc(db, 'chatConnections', connectionId));
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

    const chatDocRef = await addDoc(collection(db, 'chats'), chat);

    return {
      id: chatDocRef.id,
      ...chat,
    };
  }

  /**
   * Decline a chat connection request
   */
  async declineChatConnection(connectionId: string): Promise<void> {
    await updateDoc(doc(db, 'chatConnections', connectionId), {
      status: 'declined',
    });
  }

  /**
   * Get all chats for the current user
   */
  async getUserChats(): Promise<Chat[]> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user.uid)
    );
    
    const snapshot = await getDocs(q);

    const chats = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        lastMessageTime: data.lastMessageTime?.toDate?.() || new Date(data.lastMessageTime) || new Date(),
        createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt) || new Date(),
      } as Chat;
    });

    // Sort by last message time (most recent first)
    return chats.sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
  }

  /**
   * Get pending chat connection requests for the current user
   */
  async getPendingConnections(): Promise<ChatConnection[]> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const q = query(
      collection(db, 'chatConnections'),
      where('toUserId', '==', user.uid),
      where('status', '==', 'pending')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt) || new Date(),
      acceptedAt: doc.data().acceptedAt?.toDate?.() || (doc.data().acceptedAt ? new Date(doc.data().acceptedAt) : undefined),
    })) as ChatConnection[];
  }

  /**
   * Send a message in a chat
   */
  async sendMessage(chatId: string, text: string): Promise<ChatMessage> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get user's name
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();
    const senderName = userData?.name || userData?.username || 'Anonymous';

    const message: Omit<ChatMessage, 'id'> = {
      text,
      senderId: user.uid,
      senderName,
      timestamp: new Date(),
      read: false,
    };

    // Add message to chat messages subcollection
    const messageRef = await addDoc(
      collection(db, 'chats', chatId, 'messages'),
      message
    );

    // Update chat's last message info
    await updateDoc(doc(db, 'chats', chatId), {
      lastMessage: text,
      lastMessageTime: new Date(),
      lastMessageSenderId: user.uid,
    });

    // Update unread counts for other participants
    const chatDoc = await getDoc(doc(db, 'chats', chatId));
    const chatData = chatDoc.data() as Chat;
    
    if (chatData) {
      const updatedUnreadCount = { ...chatData.unreadCount };
      chatData.participants.forEach(participantId => {
        if (participantId !== user.uid) {
          updatedUnreadCount[participantId] = (updatedUnreadCount[participantId] || 0) + 1;
        }
      });

      await updateDoc(doc(db, 'chats', chatId), {
        unreadCount: updatedUnreadCount,
      });
    }

    return {
      id: messageRef.id,
      ...message,
    };
  }

  /**
   * Get messages for a specific chat
   */
  async getChatMessages(chatId: string, messageLimit: number = 50): Promise<ChatMessage[]> {
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'desc'),
      limit(messageLimit)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.() || new Date(doc.data().timestamp) || new Date(),
    })) as ChatMessage[];
  }

  /**
   * Mark messages as read in a chat
   */
  async markMessagesAsRead(chatId: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Reset unread count for current user
    const chatDoc = await getDoc(doc(db, 'chats', chatId));
    const chatData = chatDoc.data() as Chat;
    
    if (chatData) {
      const updatedUnreadCount = { ...chatData.unreadCount };
      updatedUnreadCount[user.uid] = 0;

      await updateDoc(doc(db, 'chats', chatId), {
        unreadCount: updatedUnreadCount,
      });
    }
  }

  /**
   * Listen to real-time updates for user's chats
   */
  subscribeToUserChats(callback: (chats: Chat[]) => void): () => void {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user.uid)
    );

    return onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          lastMessageTime: data.lastMessageTime?.toDate?.() || new Date(data.lastMessageTime) || new Date(),
          createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt) || new Date(),
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
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.() || new Date(doc.data().timestamp) || new Date(),
      })) as ChatMessage[];

      callback(messages);
    });
  }
}

export default ChatService.getInstance(); 