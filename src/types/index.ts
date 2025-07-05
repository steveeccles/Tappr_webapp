// User Profile Types
export interface UserProfile {
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  dateIdeas: string[];
  profileImageUrl?: string;
  age?: number;
  location?: string;
}

// Chat Types
export interface Chat {
  id: string;
  participants: string[];
  participantNames: { [userId: string]: string };
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: { [userId: string]: number };
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  type: 'text' | 'image';
}

export interface ChatConnection {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}

// Card Types
export interface CardCode {
  id: string;
  cardNumber: string;
  userId: string;
  isActive: boolean;
  createdAt: Date;
  lastTapped?: Date;
}

export interface CardAnalytics {
  totalTaps: number;
  uniqueVisitors: number;
  lastTapped?: Date;
} 