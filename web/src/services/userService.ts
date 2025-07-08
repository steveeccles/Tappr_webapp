import { doc, getDoc, setDoc, query, where, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
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

  static async updateUserProfile(userId: string, userData: Partial<UserProfile>): Promise<void> {
    try {
      await setDoc(doc(db, 'users', userId), {
        ...userData,
        updatedAt: new Date()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  static async uploadProfileImage(userId: string, file: File): Promise<string> {
    try {
      const storageRef = ref(storage, `profile-images/${userId}/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  }
}

// Export individual functions for easier importing
export const updateUserProfile = UserService.updateUserProfile;
export const uploadProfileImage = UserService.uploadProfileImage; 