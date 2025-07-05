import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Example: Sign in anonymously
export async function signInAnonymously() {
  const credential = await auth().signInAnonymously();
  return credential.user.uid;
}

// Example: Read/write Firestore
export function getUserDoc(uid: string) {
  return firestore().collection('users').doc(uid).get();
}

// Additional Firebase utilities
export function getAuth() {
  return auth();
}

export function getFirestore() {
  return firestore();
}

// Get current user
export function getCurrentUser() {
  return auth().currentUser;
}

// Sign out
export async function signOut() {
  return auth().signOut();
} 