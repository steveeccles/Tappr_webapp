import { doc, getDoc, setDoc, query, where, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserProfile } from '@/types';

export class UserService {
  static async getUserByUsername(username: string): Promise<UserProfile | null> {
    try {
      // Query users collection by username
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const userDoc = querySnapshot.docs[0];
      return userDoc.data() as UserProfile;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return null;
    }
  }
  
  static async getUserById(userId: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) {
        return null;
      }
      
      return userDoc.data() as UserProfile;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  }
  
  static async createOrUpdateUser(userId: string, userData: UserProfile): Promise<void> {
    try {
      await setDoc(doc(db, 'users', userId), userData, { merge: true });
    } catch (error) {
      console.error('Error creating/updating user:', error);
      throw error;
    }
  }
} 