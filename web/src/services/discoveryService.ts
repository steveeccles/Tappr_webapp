import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  query, 
  where, 
  getDocs,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { CompatibilityQuestion, getBalancedRandomQuestions, validateQuestionBank } from '@/data/compatibilityQuestions';

export interface DiscoverySession {
  id: string;
  initiatorId: string; // Person who clicked "Find out more"
  initiatorName: string;
  targetUserId: string; // Card owner
  targetUserName: string;
  questions: CompatibilityQuestion[];
  initiatorAnswers: { [questionId: string]: string };
  targetAnswers: { [questionId: string]: string };
  status: 'pending_initiator' | 'pending_target' | 'completed' | 'expired';
  compatibilityScore?: number;
  createdAt: Date;
  completedAt?: Date;
  expiresAt: Date; // 48 hours from creation
}

export interface CompatibilityResult {
  score: number;
  matches: Array<{
    question: string;
    initiatorAnswer: string;
    targetAnswer: string;
    isMatch: boolean;
  }>;
  insights: string[];
}

class DiscoveryService {
  private static instance: DiscoveryService;
  
  constructor() {
    // Validate question bank on initialization
    const validation = validateQuestionBank();
    if (!validation.isValid) {
      console.error('Question bank validation failed:', validation.errors);
      // In production, you might want to throw an error or use a fallback
    }
  }
  
  static getInstance(): DiscoveryService {
    if (!DiscoveryService.instance) {
      DiscoveryService.instance = new DiscoveryService();
    }
    return DiscoveryService.instance;
  }

  /**
   * Health check for the discovery system
   */
  static getSystemHealth() {
    const validation = validateQuestionBank();
    return {
      questionBank: validation,
      ready: validation.isValid
    };
  }

  /**
   * Create a new discovery session when someone clicks "Find out more"
   */
  async createDiscoverySession(
    targetUserId: string,
    targetUserName: string,
    initiatorName: string
  ): Promise<DiscoverySession> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get 5 random questions
    const questions = getBalancedRandomQuestions(5);
    
    // Create expiration date (48 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    const session: Omit<DiscoverySession, 'id'> = {
      initiatorId: user.uid,
      initiatorName,
      targetUserId,
      targetUserName,
      questions,
      initiatorAnswers: {},
      targetAnswers: {},
      status: 'pending_initiator',
      createdAt: new Date(),
      expiresAt,
    };

    const docRef = await addDoc(collection(db, 'discoverySessions'), session);
    
    return {
      id: docRef.id,
      ...session,
    };
  }

  /**
   * Submit answers from the initiator (web user)
   */
  async submitInitiatorAnswers(
    sessionId: string,
    answers: { [questionId: string]: string }
  ): Promise<void> {
    await updateDoc(doc(db, 'discoverySessions', sessionId), {
      initiatorAnswers: answers,
      status: 'pending_target',
      updatedAt: new Date(),
    });

    // TODO: Send notification to mobile user
    console.log('📱 Should send notification to mobile user');
  }

  /**
   * Submit answers from the target user (mobile user)
   */
  async submitTargetAnswers(
    sessionId: string,
    answers: { [questionId: string]: string }
  ): Promise<CompatibilityResult> {
    const sessionDoc = await getDoc(doc(db, 'discoverySessions', sessionId));
    if (!sessionDoc.exists()) {
      throw new Error('Discovery session not found');
    }

    const session = sessionDoc.data() as DiscoverySession;
    
    // Calculate compatibility
    const result = this.calculateCompatibility(
      session.questions,
      session.initiatorAnswers,
      answers
    );

    // Update session with target answers and results
    await updateDoc(doc(db, 'discoverySessions', sessionId), {
      targetAnswers: answers,
      status: 'completed',
      compatibilityScore: result.score,
      completedAt: new Date(),
    });

    // TODO: Send notification to web user
    console.log('🌐 Should send notification to web user');

    return result;
  }

  /**
   * Get discovery session by ID
   */
  async getDiscoverySession(sessionId: string): Promise<DiscoverySession | null> {
    const sessionDoc = await getDoc(doc(db, 'discoverySessions', sessionId));
    
    if (!sessionDoc.exists()) {
      return null;
    }

    const data = sessionDoc.data();
    return {
      id: sessionDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      completedAt: data.completedAt?.toDate(),
      expiresAt: data.expiresAt?.toDate() || new Date(),
    } as DiscoverySession;
  }

  /**
   * Get pending discovery sessions for a user (mobile app use)
   */
  async getPendingDiscoverySessions(userId: string): Promise<DiscoverySession[]> {
    const q = query(
      collection(db, 'discoverySessions'),
      where('targetUserId', '==', userId),
      where('status', '==', 'pending_target')
    );

    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        completedAt: data.completedAt?.toDate(),
        expiresAt: data.expiresAt?.toDate() || new Date(),
      } as DiscoverySession;
    });
  }

  /**
   * Get completed discovery sessions for a user
   */
  async getCompletedDiscoverySessions(userId: string): Promise<DiscoverySession[]> {
    const q = query(
      collection(db, 'discoverySessions'),
      where('initiatorId', '==', userId),
      where('status', '==', 'completed')
    );

    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        completedAt: data.completedAt?.toDate(),
        expiresAt: data.expiresAt?.toDate() || new Date(),
      } as DiscoverySession;
    });
  }

  /**
   * Listen to discovery session updates (for real-time notifications)
   */
  subscribeToDiscoverySession(
    sessionId: string,
    callback: (session: DiscoverySession | null) => void
  ): () => void {
    return onSnapshot(doc(db, 'discoverySessions', sessionId), (doc) => {
      if (!doc.exists()) {
        callback(null);
        return;
      }

      const data = doc.data();
      const session: DiscoverySession = {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        completedAt: data.completedAt?.toDate(),
        expiresAt: data.expiresAt?.toDate() || new Date(),
      } as DiscoverySession;

      callback(session);
    });
  }

  /**
   * Calculate compatibility score between two sets of answers
   */
  private calculateCompatibility(
    questions: CompatibilityQuestion[],
    initiatorAnswers: { [questionId: string]: string },
    targetAnswers: { [questionId: string]: string }
  ): CompatibilityResult {
    const matches = questions.map(question => {
      const initiatorAnswer = initiatorAnswers[question.id];
      const targetAnswer = targetAnswers[question.id];
      const isMatch = initiatorAnswer === targetAnswer;

      return {
        question: question.question,
        initiatorAnswer,
        targetAnswer,
        isMatch,
      };
    });

    // Calculate percentage of matching answers
    const matchCount = matches.filter(m => m.isMatch).length;
    const score = Math.round((matchCount / questions.length) * 100);

    // Generate insights based on score
    const insights = this.generateInsights(score, matches);

    return {
      score,
      matches,
      insights,
    };
  }

  /**
   * Generate insights based on compatibility score and matches
   */
  private generateInsights(score: number, matches: Array<any>): string[] {
    const insights: string[] = [];

    if (score >= 80) {
      insights.push("🎯 You're incredibly compatible! You share similar values and preferences.");
    } else if (score >= 60) {
      insights.push("✨ Great compatibility! You have a solid foundation with some interesting differences.");
    } else if (score >= 40) {
      insights.push("🤔 Mixed compatibility. You have some things in common but also unique perspectives.");
    } else {
      insights.push("🌈 Different perspectives! You might learn a lot from each other.");
    }

    // Add specific insights based on matches
    const exactMatches = matches.filter(m => m.isMatch);
    if (exactMatches.length > 0) {
      insights.push(`🤝 You both agreed on: "${exactMatches[0].question}"`);
    }

    const differences = matches.filter(m => !m.isMatch);
    if (differences.length > 0 && differences.length < matches.length) {
      insights.push(`💭 Different views on: "${differences[0].question}" - could make for interesting conversations!`);
    }

    return insights;
  }

  /**
   * Clean up expired sessions (should be run periodically)
   */
  async cleanupExpiredSessions(): Promise<void> {
    const now = new Date();
    const q = query(
      collection(db, 'discoverySessions'),
      where('expiresAt', '<', now),
      where('status', 'in', ['pending_initiator', 'pending_target'])
    );

    const snapshot = await getDocs(q);
    
    const updatePromises = snapshot.docs.map(doc => 
      updateDoc(doc.ref, { status: 'expired' })
    );

    await Promise.all(updatePromises);
  }
}

export default DiscoveryService.getInstance(); 