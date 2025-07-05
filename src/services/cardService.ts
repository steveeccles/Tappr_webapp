import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export interface CardCode {
  id: string;
  code: string;
  userId: string;
  username: string;
  createdAt: Date;
  lastUsed?: Date;
  tapCount: number;
  active: boolean;
  cardNumber?: number; // For user reference (Card #1, Card #2, etc.)
}

export interface CardAnalytics {
  totalTaps: number;
  uniqueVisitors: number;
  lastTapped?: Date;
  popularTimes: { hour: number; count: number }[];
}

class CardService {
  private static instance: CardService;
  
  static getInstance(): CardService {
    if (!CardService.instance) {
      CardService.instance = new CardService();
    }
    return CardService.instance;
  }

  /**
   * Generate a secure, random 8-character card code
   */
  private generateCardCode(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Create a new card code for the current user
   */
  async createCardCode(): Promise<CardCode> {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get user's profile to get username
    const userDoc = await firestore().collection('users').doc(user.uid).get();
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }

    const userData = userDoc.data();
    const username = userData?.username;
    
    if (!username) {
      throw new Error('Username not found in user profile');
    }

    // Generate unique code
    let code: string;
    let isUnique = false;
    let attempts = 0;
    
    do {
      code = this.generateCardCode();
      const existingCard = await firestore()
        .collection('cardCodes')
        .where('code', '==', code)
        .get();
      
      isUnique = existingCard.empty;
      attempts++;
      
      if (attempts > 10) {
        throw new Error('Failed to generate unique card code');
      }
    } while (!isUnique);

    // Get user's current card count for numbering
    const userCards = await this.getUserCards();
    const cardNumber = userCards.length + 1;

    // Create card code document
    const cardCode: CardCode = {
      id: '', // Will be set by Firestore
      code: code!,
      userId: user.uid,
      username: username,
      createdAt: new Date(),
      tapCount: 0,
      active: true,
      cardNumber: cardNumber,
    };

    const docRef = await firestore().collection('cardCodes').add(cardCode);
    cardCode.id = docRef.id;

    return cardCode;
  }

  /**
   * Get all card codes for the current user
   */
  async getUserCards(): Promise<CardCode[]> {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const snapshot = await firestore()
      .collection('cardCodes')
      .where('userId', '==', user.uid)
      .get();

    const cards = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      lastUsed: doc.data().lastUsed?.toDate(),
    })) as CardCode[];

    // Sort by createdAt descending in the app
    return cards.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Deactivate a card (for subscription management)
   */
  async deactivateCard(cardId: string): Promise<void> {
    await firestore().collection('cardCodes').doc(cardId).update({
      active: false,
    });
  }

  /**
   * Reactivate a card
   */
  async reactivateCard(cardId: string): Promise<void> {
    await firestore().collection('cardCodes').doc(cardId).update({
      active: true,
    });
  }

  /**
   * Get card analytics for the current user
   */
  async getCardAnalytics(): Promise<CardAnalytics> {
    const cards = await this.getUserCards();
    
    const totalTaps = cards.reduce((sum, card) => sum + card.tapCount, 0);
    const lastTapped = cards
      .filter(card => card.lastUsed)
      .sort((a, b) => (b.lastUsed?.getTime() || 0) - (a.lastUsed?.getTime() || 0))[0]?.lastUsed;

    return {
      totalTaps,
      uniqueVisitors: totalTaps, // Simplified for now
      lastTapped,
      popularTimes: [], // Will implement detailed analytics later
    };
  }

  /**
   * Get the public URL for a card code
   */
  getCardUrl(code: string): string {
    return `https://tappr.uk/c/${code}`;
  }

  /**
   * Record a tap on a card (called by web app)
   */
  async recordTap(code: string): Promise<void> {
    const snapshot = await firestore()
      .collection('cardCodes')
      .where('code', '==', code)
      .get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      await doc.ref.update({
        tapCount: firestore.FieldValue.increment(1),
        lastUsed: new Date(),
      });
    }
  }

  /**
   * Get user profile by card code (for web app)
   */
  async getUserByCardCode(code: string): Promise<{ userId: string; username: string; active: boolean } | null> {
    const snapshot = await firestore()
      .collection('cardCodes')
      .where('code', '==', code)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const cardData = snapshot.docs[0].data() as CardCode;
    return {
      userId: cardData.userId,
      username: cardData.username,
      active: cardData.active,
    };
  }
}

export default CardService.getInstance(); 