import auth from '@react-native-firebase/auth';

export async function signIn(email: string, password: string) {
  return auth().signInWithEmailAndPassword(email, password);
}

export async function signUp(email: string, password: string) {
  return auth().createUserWithEmailAndPassword(email, password);
}

export async function sendPasswordReset(email: string) {
  return auth().sendPasswordResetEmail(email);
}

export async function signOut() {
  return auth().signOut();
}

export function getCurrentUser() {
  return auth().currentUser;
}

export function onAuthStateChanged(callback: (user: any) => void) {
  return auth().onAuthStateChanged(callback);
} 